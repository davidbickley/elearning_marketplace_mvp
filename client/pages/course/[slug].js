import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player'
import SingleCourseHero from '../../components/cards/SingleCourseHero';
import SingleCourseLessons from '../../components/cards/SingleCourseLessons';
import { Context } from '../../context';
import { useContext } from 'react';
import {toast} from 'react-toastify';
import {loadStripe} from '@stripe/stripe-js';

const SingleCourse = ({course}) => {
    
    const { state: { user }} = useContext(Context);
    const [enrolled, setEnrolled] = useState({})
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        if(user && course) checkEnrollment();
    }, [user, course])

    const router = useRouter();
    const { slug } = router.query;

    const checkEnrollment = async(req, res) => {
        const { data } = await axios.get(`/api/check-enrollment/${course._id}`);
        console.log("CHECK ENROLLMENT", data);
        setEnrolled(data)
    }

    const handlePaidEnrollment = async (event) => {
        // console.log("Handle Paid Enrollment")
        try {
            setLoading(true);
            if (!user) router.push('/login');
            if (enrolled.status) return router.push(`/user/course/${enrolled.course.slug}`);

            const { data } = await axios.post(`/api/paid-enrollment/${course._id}`);
            const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
            stripe.redirectToCheckout({ sessionId: data });
            
            toast(data.message)
            return router.push(`user/course/${data.course.slug}`)   
        } catch (err) {
            toast('Enrollment failed. Try again.')
            console.log(err)
        }
        setLoading(false)
    }

    const handleFreeEnrollment = async (event) => {
        event.preventDefault();

        try {
            setLoading(true)
            if (!user) router.push('/login')
            if (enrolled.status) return router.push(`user/course/${enrolled.course.slug}`)

            const { data } = await axios.post(`/api/free-enrollment/${course._id}`)
            toast(data.message)
            return router.push(`user/course/${data.course.slug}`)
        } catch (err) {
            toast("Enrollment failed. Try again.")
            console.log(err)
        }
        setLoading(false)
    }

    return (
        <>
            <SingleCourseHero 
                course={course} 
                user={user}
                paid={course.paid} 
                handleFreeEnrollment={handleFreeEnrollment}
                handlePaidEnrollment={handlePaidEnrollment}
                enrolled={enrolled}     
            />

            {course.lessons && (
                <SingleCourseLessons lessons={course.lessons} />
            )}
        </>
    )
};

export async function getServerSideProps({query}) {
    const { data } = await axios.get(`${process.env.API}/course/${query.slug}`)
    return{
        props: {
            course: data
        }
    }
}

export default SingleCourse