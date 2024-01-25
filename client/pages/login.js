import { useState, useContext, useEffect } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import Link from 'next/link';
import { Context } from '../context';
import { useRouter } from 'next/router'

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { state, dispatch } = useContext(Context);
    const { user } = state

    const router = useRouter();

    useEffect(() => {
        if(user !== null){
            router.push('/')
        } 
    }, [user])

    console.log("State: ", state);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try{
            setLoading(true);
            const { data } = await axios.post(`/api/login`, {
                email, password
            });
            // console.log("LOGIN RESPONSE", data);
            dispatch({
                type: "LOGIN",
                payload: data
            });

            window.localStorage.setItem('user', JSON.stringify(data));

            toast.success('Login Successful.');

            router.push('/user');

        } catch (error) {
            toast.error(error.response.data);
        }

        setLoading(false);
    };



    return(
        <>
            <h1 className="jumbotron text-center bg-primary square">Login</h1>
            
            <div className="container col-md-4 offset-md-4 pb-5">
                <form onSubmit={handleSubmit}>
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
                    <button type="submit" className="btn btn-block btn-primary p-2" disabled={ !email || !password || loading} >{loading ? "Loading" : "Login"}</button>
                </form>
                <p className="text-center p-3">Not Registered Yet? <Link href="/register">Register</Link></p>
                <p className="text-center"><Link href="/register">Forgot Password?</Link></p>
            </div>
        </>
    )
}

export default Login;