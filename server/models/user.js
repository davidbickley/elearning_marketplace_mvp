import mongoose from 'mongoose'

const { Schema } = mongoose;
const { ObjectId } = Schema

const userSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            trim: true,
            required: true,
            min: 6,
            max: 64,
        },
        photo: {
            type: String,
            default: "/avatar.png",
        },
        role: {
            type: [String],
            default: ["Subscriber"],
            enum: ["Subscriber", "Instructor", "Admin"]
        },
        courses: [{
            type: ObjectId, ref: "Course"
        }],
        stripe_account_id: {
            type: String,
            default: ''
        },
        stripe_seller: {
            type: Schema.Types.Mixed, // or `type: Object` if structure is not fixed
            default: {}
        },
        stripeSession: {
            type: Schema.Types.Mixed, // or `type: Object` if structure is not fixed
            default: {}
        },
        passwordResetCode: {
            type: String,
            default: ''
        },
    },
    { timestamps: true }
);

export default mongoose.model('User', userSchema)
