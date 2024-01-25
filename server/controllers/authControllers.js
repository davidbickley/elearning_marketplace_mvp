import User from '../models/user.js';
import { hashPassword, comparePassword } from '../utils/auth.js';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import AWS from 'aws-sdk';

const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVersion: process.env.AWS_API_VERSION
}

const SES = new AWS.SES(awsConfig)

export const register = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name) return res.status(400).send("Name is required");
        if (!password || password.length < 6) {
            return res
                .status(400)
                .send("Password does not meet requirements");
        }

        let userExists = await User.findOne({ email }).exec();
        if (userExists) return res.status(400).send("Error. Email is taken.");

        const hashedPassword = await hashPassword(password);

        const user = new User({
            name, email, password: hashedPassword,
        });
        
        await user.save();

        console.log('Saved user:', user);
        return res.json({ ok: true });

    } catch (err) {

        console.log(err);
        return res.status(400).send('Error. Try again.')

    }
};

export const login = async (req, res) => {
    try {
        // Create variables from the email and password in the request body
        const { email, password } = req.body;

        // Search the database and find the user with the same email, if it exists
        const user = await User.findOne({ email }).exec();

        // Check if user exists in database
        if (!user) {
            return res.status(400).send("No user found.");
        }

        // Check submitted password against hash
        const match = await comparePassword(password, user.password);

        if (!match) {
            return res.status(400).send("Incorrect Credentials")
        }

        // Create signed JSON web token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        // Return user and token to client. Exclude hashed password.
        user.password = undefined

        // Send token in cookie
        res.cookie('token', token,  {
            httpOnly: true,
            // secure: true // only works on https
        });

        // Send user as JSON response
        res.json(user);

    } catch (err) {
        console.log(err);
        return res.status(400).send('Error, try again.');
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        return res.json({ message: 'Logout Successful.'})
    } catch (err) {
        console.log(err);
    }
};

export const currentUser = async (req, res) => {
    try {
        const user = await User.findById(req.auth._id).select('-password').exec();
        // console.log('CURRENT USER: ', user);
        return res.json({ ok: true });
    } catch (err) {
        console.log(err)
    }
};

export const sendTestEmail = async (req, res) => {
    // console.log('send email using SES');
    // res.json({ ok: true });

    const params = {
        Source: process.env.EMAIL_FROM,
        Destination: {
            ToAddresses: ['hello@davidbickley.com'],
        },
        ReplyToAddresses: [process.env.EMAIL_FROM],
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: `
                        <html>
                            <h1>Reset password Link</h1>
                            <p>Please use the following link to reset your password.</p>
                        </html>
                    `,
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: "Password Reset Link"
            },
        },
    };

    const emailSent = SES.sendEmail(params).promise();

    emailSent.then((data) => {
        console.log(data)
        res.json({ ok: true });
    })
    .catch( err => {
        console.log(err)
    })
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email);
        const shortCode = nanoid(6).toUpperCase();
        const user = await User.findOneAndUpdate({ email }, { passwordResetCode: shortCode });

        if (!user) {
            return res.status(400).send("User not found");
        };

        const params = {
            Source: process.env.EMAIL_FROM,
            Destination: {
                ToAddresses: [email]
            },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: `
                            <html>
                                <h1>Reset Password</h1> 

                                <p>Use this code to reset your password:</p>
                                <p><strong>${shortCode}</strong></p>
                            </html>
                        `
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: 'Reset Password'
                },
            },
        };

        const emailSent = SES.sendEmail(params).promise();

        emailSent.then((data) => {
            console.log(data);
            res.json({ ok: true });
        })
        .catch ((err) => {
            console.log(err);
        });

    } catch (err) {
        console.log(err);
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        
        // console.table({ email, code, newPassword })

        const hashedPassword = await hashPassword(newPassword);
        const user = User.findOneAndUpdate({
            email, 
            passwordResetCode: code
        }, {
            password: hashedPassword,
            passwordResetCode: ''
        }).exec();
        
        res.json({ ok: true });

    } catch (err) {
        console.log(err);
        return res.status(400).send("Error! Try again.");
    }
}