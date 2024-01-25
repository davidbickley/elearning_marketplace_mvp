import Course from "../models/course.js";
import slugify from 'slugify';
import User from "../models/user.js";
import Completed from "../models/completed.js";
import Stripe from 'stripe';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

export const createCourse = async (req, res) => {
    console.log("CREATE COURSE", req.body);

    try {
        const alreadyExist = await Course.findOne({
            slug: slugify(req.body.name.toLowerCase()),
        });

        if(alreadyExist) return res.status(400).send('Title is taken.')

        const course = await new Course({
            slug: slugify(req.body.name),
            instructor: req.auth._id,
            ...req.body,
        }).save();

        res.json(course);

    } catch (err) {
        console.log(err);
        return res.status(400).send('Course creation faild. Please try again.')
    }

  };

export const readCourse = async ( req, res ) => {
    try {
        const course = await Course.findOne({slug: req.params.slug}).populate('instructor', '_id name').exec();
        res.json(course);
    } catch (err) {
        console.log(err)
    }
};

export const addLesson = async (req, res) => {
    try {
        const { slug, instructorId } = req.params;
        const { title, content, vimeo_id } = req.body;

        if (req.auth._id != instructorId) {
            return res.status(403).send("Unauthorized");
        }

        const updated = await Course.findOneAndUpdate(
            {slug}, 
            {
                $push: { 
                    lessons: {
                        title, 
                        content, 
                        vimeo_id, 
                        slug: slugify(title)
                    }
                }
            },
            { new: true }
        )
        .populate('instructor', "_id name")
        .exec();
        
        res.json(updated)

    } catch (err) {
        console.log(err)
        return res.status(400).send("Add Lesson Failed")
    }
};

export const updateCourse = async (req, res) => {
    try {
        const {slug} = req.params;    
        const course = await Course.findOne({ slug }).exec();
        
        if (req.auth._id != course.instructor) {
            return res.status(400).send("Unauthorized");
        }
    
        const updated = await Course.findOneAndUpdate({ slug }, req.body, {
            new: true,
        }).exec();
    
        res.json(updated)
    } catch (err) {
        console.log(err)
        return res.status(400).send(err.message);
    }   
};

export const removeLesson = async (req, res) => {
    const { slug, lessonId } = req.params;    
    const course = await Course.findOne({ slug }).exec();

    if (req.auth._id != course.instructor) {
        return res.status(400).send("Unauthorized");
    }

    const deletedCourse = await Course.findByIdAndUpdate(course._id, {
        $pull: { lessons: { _id: lessonId }}
    }).exec();

    res.json({ ok: true });
};

export const updateLesson = async (req,res) => {
    try {
        // console.log("POST UPDATED", req.body)
        const { slug } = req.params;
        const { _id, title, content, vimeo_id, free_preview } = req.body;
        const course = await Course.findOne({ slug }).select('instructor').exec();
    
        if (course.instructor._id != req.auth._id) {
            return res.status(400).send("Unauthorized");
        }
    
        const updated = await Course.updateOne(
            { "lessons._id": _id }, 
            {
                $set: {
                    "lessons.$.title": title,
                    "lessons.$.content": content,
                    "lessons.$.vimeo_id": vimeo_id,
                    "lessons.$.free_preview": free_preview,
                }
            }, 
            { new: true }
        ).exec();
        console.log("UPDATED ==> ", updated);
        res.json({ ok: true });
    } catch (err) {
        console.log(err)
    }
};

export const publishCourse = async (req, res) => {
    try {
        const {courseId} = req.params;
        const course = await Course.findById(courseId).select('instructor').exec();
        
        if (req.auth._id != course.instructor) {
            return res.status(400).send("Unauthorized");
        }

        const updated = await Course.findByIdAndUpdate(
            courseId, 
            { published: true }, 
            { new: true }
        ).exec();

        res.json(updated);

    } catch (err) {
        console.log(err);
        return res.status(400).send('Publish Failed')
    }
};

export const unpublishCourse = async (req, res) => {
    try {
        const {courseId} = req.params;
        const course = await Course.findById(courseId).select('instructor').exec();
        
        if (req.auth._id != course.instructor) {
            return res.status(400).send("Unauthorized");
        }

        const updated = await Course.findByIdAndUpdate(
            courseId, 
            { published: false }, 
            { new: true }
        ).exec();

        res.json(updated);
    } catch (err) {
        console.log(err);
        return res.status(400).send('Unpublish Failed');
    }
};

export const listCourses = async (req, res) => {
    const allCourses = await Course.find({ published: true }).populate('instructor', '_id name').exec();
    res.json(allCourses);
};

export const checkEnrollment = async (req, res) => {
    const { courseId } = req.params;
    const user = await User.findById(req.auth._id).exec();

    let ids = [];
    let length = user.courses && user.courses.length;

    for (let i = 0; i < length; i++) {
        ids.push(user.courses[i].toString())
    }

    res.json({
        status: ids.includes(courseId),
        course: await Course.findById(courseId).exec()
    });
};

export const freeEnrollment = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId).exec()
        if (course.paid) return;

        const result = await User.findByIdAndUpdate(
            req.auth._id, 
            {
                $addToSet: { courses: course._id},
            }, 
            { new: true}
        ).exec();
        res.json({
            message: 'Congratulations! You Are Enrolled!',
            course,
        })
    } catch (err) {
        console.log(err)
        return res.status(400).send("Enrollment failed")
    }
};

export const paidEnrollment = async (req, res) => {
    try {    
        const course = await Course.findById(req.params.courseId)
            .populate('instructor')
            .exec();

        if (!course.paid) return;

        // Set a platform fee of 5%
        const fee = (course.price * 5) / 100;

        // Create Stripe session
        const session = await stripe.checkout.sessions.create({
            
            // Set allowed payment methods
            payment_method_types: ['card'],

            // Purchase details
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: course.name,

                        },
                        unit_amount: Math.round(course.price.toFixed(2) * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',

            // Charge buyer and transfer remaining balance to seller (after platform fee)
            payment_intent_data: {
                application_fee_amount: Math.round(fee.toFixed(2) * 100),
                transfer_data: {
                    destination: course.instructor.stripe_account_id,
                },
            },

            // Redirect url after successful payment
            success_url: `${process.env.STRIPE_SUCCESS_URL}/${course._id}`,
            cancel_url: process.env.STRIPE_CANCEL_URL,
        });
        console.log('SESSION ID => ', session);

        await User.findByIdAndUpdate(req.auth._id, {stripeSession: session}).exec();
        res.send(session.id);
    } catch (err) {
        console.log('HANDLE PAID ENROLLMENT ERROR => ', err);
        return res.status(400).send("Enrollment failed.")
    }
};

export const stripeSuccess = async (req, res) => {
    try {
        // Find Course
        const course = await Course.findById(req.params.courseId).exec();

        // Get User from database, and get their Stripe session ID
        const user = await User.findById(req.auth._id).exec();

        // Handle case where user has no session ID
        if (!user.stripeSession.id) return res.sendStatus(400);

        // Retrieve Stripe session
        const session = await stripe.checkout.sessions.retrieve(user.stripeSession.id);

        // If status is paid, push course to user's course array
        if (session.payment_status === 'paid' || session.payment_status === 'complete') {
            const updatedUser = await User.findByIdAndUpdate(
                user._id, 
                {
                    $addToSet: { courses: course._id },
                    $set: { stripeSession: {} },
                }, 
                { new: true }
            ).exec();
            res.json({ success: true, course });
        } else {
            console.log('Payment not complete or not successful');
            res.status(400).send('Payment not successful');
        }
    } catch (err) {
        console.log("STRIPE SUCCESS ERROR => ", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

export const userCourses = async (req, res) => {
    const user = await User.findById(req.auth._id).exec();
    const courses = await Course
        .find({_id: { $in: user.courses } })
        .populate('instructor', '_id name')
        .exec();
    res.json(courses)
};

export const markCompleted = async (req, res) => {
    const {courseId, lessonId } = req.body
    const existing = await Completed.findOne({
        user: req.auth._id,
        course: courseId
    }).exec();

    if (existing) {
        // update
        const updated = await Completed.findOneAndUpdate(
            {
                user: req.auth._id,
                course: courseId
            }, {
                $addToSet: { lessons: lessonId },
            }
        ).exec();
        res.json({ ok: true });
    } else {
        // create
        const created = await new Completed({
            user: req.auth._id,
            course: courseId,
            lessons: lessonId
        }).save();
        res.json({ ok: true });
    }
};

export const markIncomplete = async (req, res) => {
    try {
        const { courseId, lessonId } = req.body

        const updated = await Completed.findOneAndUpdate({
            user: req.auth._id,
            course: courseId,
        },
        {
            $pull: { lessons: lessonId },
        }).exec();
        res.json({ ok: true })
    } catch (err) {
        console.log(err);
    } 
}

export const listCompleted = async (req, res) => {
    try {
      const list = await Completed.findOne({
        user: req.auth._id,
        course: req.body.courseId,
      }).exec();
      list && res.json(list.lessons);
    } catch (err) {
      console.log(err);
    }
  };
  
