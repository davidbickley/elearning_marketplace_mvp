import { useReducer, createContext, useEffect, useState } from "react";
import axios from 'axios';
import  { useRouter } from 'next/router'

const initialState = {
    user: null,
};

const Context = createContext();

const rootReducer = ( state, action ) => {
    switch(action.type) {
        case "LOGIN":
            return { 
                ...state, 
                user: action.payload 
            }
        case "LOGOUT":
            return {
                ...state,
                user: null
            }
        default:
            return state;
    }
};

const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(rootReducer, initialState);
    const [csrfTokenSet, setCsrfTokenSet] = useState(false);

    const router = useRouter();

    useEffect(() => {
        dispatch({
            type: "LOGIN",
            payload: JSON.parse(window.localStorage.getItem('user'))
        })
    }, []);

    axios.interceptors.response.use((response) => {
        // any status codes in the 2XX range will trigger this function
        return response;
    }, (error) => {
        // any status codes outside the 2XX range will trigger this function
        let res = error.response;
        if(res.status === 401 && res.config && !res.config.__isRetryRequest) {
            return new Promise((resolve, reject) => {
                axios.get('/api/logout')
                .then((data) => {
                    console.log('/401 error > logout')
                    dispatch({ type:'LOGOUT'})
                    window.localStorage.removeItem('user');
                    router.push('/login')
                })
                .catch ((err) => {
                    console.log('AXIOS INTERCEPTOR ERROR:', err)
                    reject(error)
                });
            });
        }
        return Promise.reject(error);
    });

    useEffect(() => {
        const getCsrfToken = async () => {
            const { data } = await axios.get('/api/csrf-token');
            axios.defaults.headers.common['X-CSRF-Token'] = data.csrfToken;
            setCsrfTokenSet(true); // Update the state
        }
        getCsrfToken();
    }, [])
    

    return (
        <Context.Provider value={{ state, dispatch, csrfTokenSet }}>
            { children }
        </Context.Provider>
    )
};

export { Context, Provider };