import { useState, useEffect, useContext } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import Link from 'next/link';
import { Context } from '../context';
import { useRouter } from "next/router";

const Register = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { state:{user} } = useContext(Context);

    const router = useRouter();

    useEffect(() => {
        if(user !== null){
            router.push('/')
        } 
    }, [user])

    const handleSubmit = async (event) => {
        event.preventDefault();

        try{
            setLoading(true)
            const { data } = await axios.post(`/api/register`, {
                name, email, password
            })
            toast.success('Registration Successful.')
            setName(''),
            setEmail('');
            setPassword('')
        } catch (error) {
            toast.error(error.response.data);
        }

        setLoading(false)
    };



    return(
        <>
            <h1 className="jumbotron text-center bg-primary square">Register</h1>
            
            <div className="container col-md-4 offset-md-4 pb-5">
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        className="form-control mb-4 p-4" 
                        value={name} 
                        onChange={(event) => setName(event.target.value)} 
                        placeholder="Enter Name"    
                        required
                    />
                    <input 
                        type="email" 
                        className="form-control mb-4 p-4" 
                        value={email} 
                        onChange={(event) => setEmail(event.target.value)} 
                        placeholder="Enter Email"    
                        required
                    />
                    <input 
                        type="password" 
                        className="form-control mb-4 p-4" 
                        value={password} 
                        onChange={(event) => setPassword(event.target.value)} 
                        placeholder="Enter Password"    
                        required
                    />
                    <button type="submit" className="btn btn-block btn-primary p-2" disabled={ !name || !email || !password } >{loading ? "Loading" : "Register"}</button>
                </form>
                <p className="text-center p-3">Already Registered? <Link href="/login">Login</Link></p>
            </div>
        </>
    )
}

export default Register;