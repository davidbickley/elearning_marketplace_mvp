import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { Context } from '../context'
import { useRouter } from 'next/router';

const ForgotPassword = () => {
    
    // States
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Context
    const { state: {user}} = useContext(Context);

    // Router
    const router = useRouter();

    // Redirect if user is logged in
    useEffect(() => {
        if(user !== null) router.push('/');
    }, [user])

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading(true)
            const {data} = await axios.post('/api/forgot-password', { email });
            setSuccess(true)
            toast("Check your email for the secret code.")
        } catch (err) {
            toast(err.response.data)
        }
        setLoading(false)
    };

    const handleResetPassword = async (event) => {
        event.preventDefault(0);
        try {
            setLoading(true);
            const { data } = await axios.post('/api/reset-password', { 
                email, 
                code, 
                newPassword 
            });
            setEmail('');
            setCode(''),
            setNewPassword(''),
            setLoading(false);
            toast('Password Updated!')
        } catch (err) {
            setLoading(false)
            console.log(err);
        }
    }

    return (
        <>
            <h1 className='jumbotron text-center bg-primary square'>Forgot Password</h1>
            <div className='container col-md-4 offset-md-4 pb-5'>
                <form onSubmit={ success ? handleResetPassword : handleSubmit }>
                    <input 
                        type="email" 
                        className='form-control mb-4 p-4' 
                        value={email} 
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder='Enter Email'
                        required 
                    />
                    { success && (
                        <>
                            <input 
                                type="text" 
                                className='form-control mb-4 p-4' 
                                value={code} 
                                onChange={(event) => setCode(event.target.value)}
                                placeholder='Your Secret Code'
                                required 
                            />
                            <input 
                                type="password" 
                                className='form-control mb-4 p-4' 
                                value={newPassword} 
                                onChange={(event) => setNewPassword(event.target.value)}
                                placeholder='Your New Password'
                                required 
                            />
                        </>
                    )}
                    <button type="submit" className='btn btn-primary btn-block p2' disabled={ loading || !email }>
                        {loading ? 'Loading...' : "Submit"}
                    </button>
                </form>
            </div>
        </>
    )
}

export default ForgotPassword