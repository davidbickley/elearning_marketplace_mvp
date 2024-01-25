import { useContext, useState } from 'react';
import { Context } from '../../context';
import { toast } from 'react-toastify';
import axios from 'axios';
import UserRoute from '../../components/routes/UserRoute'

const BecomeInstructor = () => {

    const [loading, setLoading] = useState(false);
    const {state:{user}} = useContext(Context);

    const becomeInstructor = () => {
        // console.log("Become Instructor")
        setLoading(true)
        axios.post('/api/make-instructor')
            .then(res => {
                console.log(res)
                window.location.href = res.data;
            })
            .catch(err => {
                console.log(err.response.status)
                toast('Stripe onboarding failed. Try again.')
                setLoading(false);
            })
    }


    return ( 
        <>
            <h1 className='jumbotron text-center square'>Become Instructor</h1>

            <div className='container'>
                <div className='row'>
                    <div className='col-md-6 offset-md-3 text-center'>
                        <div className='pt-4'>
                            <h2>Setup payout to publish courses on our platform.</h2>
                            <p className='lead text-warning'>We partner with Stripe to transfer your earnings to your bank account.</p>
                            <button 
                                className='mb-3' 
                                type='primary' 
                                onClick={becomeInstructor} 
                                disabled={user && user.role && user.role.includes("Instructor") || loading}
                            >
                                {loading ? "Processing..." : "Payout Setup"}
                            </button>
                            <p className='lead'>You will be redirected to Stripe to continue the onboarding process.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BecomeInstructor