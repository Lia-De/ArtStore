import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { shoppingCartAtom } from '../atoms/cartAtom.js';
import { apiUrl } from '../config.js';
import { shopCustomerAtom } from '../atoms/shopCustomerAtom';
import { useForm } from 'react-hook-form';
import axios from 'axios';


const Checkout = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [shoppingCart, setShoppingCart] = useAtom(shoppingCartAtom);
    const [shopCustomer, setShopCustomer] = useAtom(shopCustomerAtom);
    const [purchaseCheck, setPurchaseCheck] = useState(false);
    const [uiState, setUiState] = useState({
        loading: true,
        error: null,
        updating: false,
        deleting: false
    });

    useEffect(() => {
        shopCustomer?.shopCustomerId && setPurchaseCheck(true);
        
        console.log(shopCustomer);
    }, [shopCustomer]);

    const onSubmit = (data) => {
        axios.post(`${apiUrl}/shopping/CreateUserProfile`, data)
        .then((result)=>{
            console.log(result.data);
            setShopCustomer(result.data);
            setPurchaseCheck(true);
        })
        .catch((err) => {
            setUiState(prev => ({...prev, error: err}));
        })
        .finally(() => {
            setUiState(prev => ({...prev, updating: false}));
        });
    }

    const confirmOrder = () => {
        console.log(shopCustomer) ; console.log(shoppingCart)
        setUiState(prev => ({...prev, updating: true}));

        
        axios.post(`${apiUrl}/shopping/confirmOrder`, order)
        .then((result)=>{
            console.log(result.data);
        })
        .catch((err) => {
            setUiState(prev => ({...prev, error: err}));
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
                        {shoppingCart.basketItems.map((item) => (
                            <tr key={item.inventoryId} className="checkout_container_cart_item">
                                    <td><img src={item.inventory?.imageUrl} alt={item.inventory.name} /></td>
                                    <td>{item.inventory.name} </td>
                                    <td>Quantity: {item.quantity}</td>
                                    <td  className="text-right">{item.price} kr</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan="3"  className="text-right">Total:</td>
                            <td>${shoppingCart.totalPrice}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

{!shopCustomer?.shopCustomerId &&
                <div className="checkout_container_customer">
                    <h2>Customer Information</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <label htmlFor="firstname">Firstname:</label>
                        <input type="text" id="firstname" defaultValue={shopCustomer.firstname}
                          {...register('firstname', {required: true})} />
                        <label htmlFor="lastname">Lastname:</label>
                        <input type="text" id="lastname" defaultValue={shopCustomer.lastname}
                          {...register('lastname', {required: true})} />
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" defaultValue={shopCustomer.email}
                          {...register('email', {required: true})} />
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
                        <label htmlFor="shippingMethod">Shipping Method:</label>
                        <select id="shippingMethod" defaultValue={shopCustomer.shippingMethod}
                          {...register('shippingMethod')}>
                            <option value="standard">Standard</option>
                            <option value="express">Express</option>
                        </select>
                        <button type="submit"
                         disabled={shopCustomer.customerId ? true: undefined} 
                        className={shopCustomer.customerId ? 'disabled': undefined}
                        >Save User Profile</button>
                    </form>
                </div>
}

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