import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { shopCustomerAtom } from '../atoms/shopCustomerAtom.js';
import { useNavigate } from 'react-router';
import { apiUrl } from '../config.js';
import { useForm } from 'react-hook-form';
import axios from 'axios';

export default function Login() {

    const [uiState, setUiState] = useState({
        loading: true,
        error: null,
        register: false,
    });

    const { register, handleSubmit, reset } = useForm();
    const [shopCustomer, setShopCustomer] = useAtom(shopCustomerAtom);
    // const [login, setLogin] = useState(null);


    const onSubmit = (data) => {
        console.log('we are setting the data from the form');
        // setLogin(data);
        setUiState(prev => ({ ...prev, register: true }));
        axios.post(`${apiUrl}/shopping/login`, data)
        .then((response) => {
            console.log(response.data);
            setShopCustomer(response.data);
            setUiState(prev => ({ ...prev, loading: false, error: null }));
        })
        .catch((err) => {
            console.log(err);
            setUiState(prev => ({ ...prev, loading: false, error: err }));
            setShopCustomer({});
        })
        .finally(() => {
            setUiState(prev => ({ ...prev, loading: false }));
        });
    }

    useEffect(() => {
        

    }, [uiState.register]);

    return (
        <div className="login_container">
            <h1>Login</h1>
            {uiState.error && <p className="error">Error: {uiState.error.data}</p>}
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" {...register("email", {required: true})}/>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" {...register("password", {required: true})}/>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}