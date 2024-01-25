import { useContext, useEffect } from "react";
import { Context } from "../../context";
import axios from "axios";

const StripeCallback = () => {
    const {state:{user}, dispatch } = useContext(Context);

    useEffect(() => {
        if(user){
            axios.post('/api/get-account-status').then(res => {

                dispatch({
                    type: 'LOGIN',
                    payload: res.data
                });

                window.localStorage.setItem('user', JSON.stringify(res.data))

                window.location.href = "/instructor";
            })
        }
    }, [user]);

    return (
        <div>Loading...</div>
    )
}

export default StripeCallback