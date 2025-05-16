import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { shoppingCartAtom } from '../atoms/cartAtom.js';
import { apiUrl } from '../config.js';
import { shopCustomerAtom } from '../atoms/shopCustomerAtom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router';


const Checkout = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [shoppingCart, setShoppingCart] = useAtom(shoppingCartAtom);
    const [shopCustomer, setShopCustomer] = useAtom(shopCustomerAtom);
    const [purchaseCheck, setPurchaseCheck] = useState(false);
    const [paymentDetail, setPaymentDetail] = useState(null);
    const [shippingMethod, setShippingMethod] = useState(null);
    const [totalCost, setTotalCost] = useState(0);
    const [uiState, setUiState] = useState({
        loading: true,
        error: null,
        updating: false,
        deleting: false
    });
    const navigate = useNavigate();
    useEffect(() => {
        setTotalCost(shoppingCart.totalPrice);
        return () => {
            setTotalCost(0);
            setPaymentDetail(null);
            setShippingMethod(null);
            setPurchaseCheck(false);
        }
    }, []);
    useEffect(() => {
        console.log('cart', shoppingCart);
        shopCustomer?.shopCustomerId && paymentDetail && shippingMethod && setPurchaseCheck(true);
        if (shippingMethod) {
            if (shippingMethod === "standard") {
                setTotalCost(shoppingCart.totalPrice + 50);
            } else if (shippingMethod === "express") {
                setTotalCost(shoppingCart.totalPrice + 150);
            }
        }
    }, [shopCustomer, paymentDetail, shippingMethod]);

    const onSubmit = (data) => {
        axios.post(`${apiUrl}/shopping/CreateUserProfile`, data)
        .then((result)=>{
            // console.log(result.data);
            setShopCustomer(result.data);
        })
        .catch((err) => {
            setUiState(prev => ({...prev, error: err}));
        })
        .finally(() => {
            setUiState(prev => ({...prev, updating: false}));
        });
    }

    const confirmOrder = () => {
        // console.log(shopCustomer);
        // console.log(shoppingCart);
        setUiState(prev => ({...prev, updating: true}));

        const order = {
            customerId: shopCustomer.shopCustomerId,
            shoppingBasketId: shoppingCart.shoppingBasketId,
            paymentDetail: paymentDetail,
            shoppingMethod: shippingMethod,

        }
        console.log(order);
        axios.post(`${apiUrl}/shopping/checkout`, order)
        .then((result)=>{
            // console.log(result.data);
            alert("Order confirmed ", result.data);
            setShoppingCart([]);
            navigate('/cart');
        })
        .catch((err) => {
            setUiState(prev => ({...prev, error: err}));
            console.log(err.response.data);
        })
        .finally(() => {
            setUiState(prev => ({...prev, updating: false}));
        });
    }


    return (
        <div className="checkout">
            <h1>Checkout</h1>
            <div className="checkout_container">
                <div className="checkout_container_cart">
                    <table>
                        <tbody>
                        {shoppingCart?.basketItems?.map((item) => (
                            <tr key={item.inventoryId} className="checkout_container_cart_item">
                                    <td><img src={item.inventory?.imageUrl} alt={item.inventory.name} /></td>
                                    <td>{item.inventory.name} </td>
                                    <td>Quantity: {item.quantity}</td>
                                    <td  className="text-right">{item.price} kr</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan="3"  className="text-right">Total: {shippingMethod === "standard" ? '+ 50 kr': shippingMethod === "express" ? '+ 150 kr' : ''}</td>
                            <td>{totalCost} kr</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

            {!shopCustomer?.shopCustomerId &&
                <div className="checkout_container_customer">
                    <h2>Customer Information</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <label htmlFor="firstname">* Firstname: </label>
                        <input type="text" id="firstname" defaultValue={shopCustomer.firstname}
                          {...register('firstname', {required: true})} />
                        <label htmlFor="lastname">* Lastname:</label>
                        <input type="text" id="lastname" defaultValue={shopCustomer.lastname}
                          {...register('lastname', {required: true})} />
                        <label htmlFor="email">* Email:</label>
                        <input type="email" id="email" defaultValue={shopCustomer.email}
                          {...register('email', {required: true})} />
                        {errors.email && <span className="error">Email is required</span>}
                        <label htmlFor="password">* Password:</label>
                        <input type="password" id="password" defaultValue={shopCustomer.password}
                          {...register('password', {required: true})} />
                        <label htmlFor="phone">Phone:</label>
                        <input type="text" id="phone" defaultValue={shopCustomer.phone}
                          {...register('phone')} />
                        <label htmlFor="address">Address:</label>
                        <input type="text" id="address" defaultValue={shopCustomer.address}
                          {...register('address')} />
                        <label htmlFor="city">City:</label>
                        <input type="text" id="city" defaultValue={shopCustomer.city}
                          {...register('city')} />
                        <label htmlFor="zip">Zip:</label>
                        <input type="text" id="zip" defaultValue={shopCustomer.zip}
                          {...register('zip')} />
                        <label htmlFor="country">Country:</label>
                        <input type="text" id="country" defaultValue={shopCustomer.country}
                          {...register('country')} />
                        
                        <button type="submit"
                         disabled={shopCustomer.customerId ? true: undefined} 
                        className={shopCustomer.customerId ? 'disabled': undefined}
                        >Save User Profile</button>
                    </form>
                </div>
        }
        <div className="checkout_container_payment">
            <h2>Shipping</h2>
            <form>
                <label htmlFor="standard">Standard, 50 sek</label>
                <input type="radio" name="shippingMethod" id="standard" onChange={() => setShippingMethod("standard")} />
                <label htmlFor="express">Express, 150 sek</label>
                <input type="radio" name="shippingMethod" id="express"  onChange={() => setShippingMethod("express")} />
            </form>

            <h2>Payment Information</h2>
            <form>
                <label htmlFor="cc">Credit Card</label>
                <input type="radio" name="paymentDetail" id="cc" onChange={() => setPaymentDetail("cc")} />
                <label htmlFor="swish">Swish</label>
                <input type="radio" name="paymentDetail" id="swish"  onChange={() => setPaymentDetail("swish")} />
                <label htmlFor="invoice">Invoice</label>
                <input type="radio" name="paymentDetail" id="invoice"  onChange={() => setPaymentDetail("invoice")} />
                <label htmlFor="bank">Bank Transfer</label>
                <input type="radio" name="paymentDetail" id="bank"  onChange={() => setPaymentDetail("bank")} />
            </form>
        </div>
                <div className="checkout_container_confirm">
                    
                    <button disabled={purchaseCheck ? undefined: true} 
                        className={purchaseCheck ? undefined: 'disabled'}
                        onClick={() => { confirmOrder()  } }>
                            Confirm Purchase
                    </button>
                </div>
            </div>
        </div>
    )
    

}
export default Checkout;