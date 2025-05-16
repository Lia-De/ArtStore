import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { shoppingCartAtom } from '../atoms/cartAtom.js';
import { apiUrl } from '../config.js';
import { shopCustomerAtom } from '../atoms/shopCustomerAtom';
import { Link } from 'react-router';
import axios from 'axios';

const Cart = () => {
    const [shoppingCart, setShoppingCart] = useAtom(shoppingCartAtom);
    const [shopCustomer, setShopCustomer] = useAtom(shopCustomerAtom);

    const [cartItems, setCartItems] = useState([]);
    const [uiState, setUiState] = useState({
        loading: true,
        error: null,
        updating: false,
        deleting: false
    });


    useEffect(() => { 

        // console.log('cart', shoppingCart);
        // console.log('customer', shopCustomer);
     
        // fetch the basket from the server to make it complete
        setUiState(prev => ({...prev, loading: true, error: null}));
        shoppingCart?.shoppingBasketId && axios.get(`${apiUrl}/shopping/getBasket/${shoppingCart?.shoppingBasketId}`)
        .then ((response) => {
            setShoppingCart(response.data);
            setCartItems(response.data.basketItems ?? []);
        })
        .catch((err) => {
            setUiState(prev => ({...prev, error: err}));
            if (err.response.status === 404) {
                setShoppingCart([]);
                setCartItems([]);
            }   
        })
        .finally(() => {
            setUiState(prev => ({...prev, loading: false}));
        });
        
        // console.log('cartitems', cartItems);
        // Also make sure the user is validated
        
        if (shopCustomer?.shopCustomerId) {
            setUiState(prev => ({...prev, loading: true, error: null}));
            axios.get(`${apiUrl}/shopping/getUserProfile/${shopCustomer?.shopCustomerId}`)
            .then ((response) => {
                setShopCustomer(response.data);
            })
            .catch((err) => {
                setUiState(prev => ({...prev, error: err}));
                if (err.response.status === 404) {
                    setShopCustomer([]);
                }   
            })
            .finally(() => {
                setUiState(prev => ({...prev, loading: false}));
            });
        }
    }
    , []);
 
    useEffect(() => {
        uiState.deleting && (
            axios.post(`${apiUrl}/shopping/cancelBasket/${shoppingCart.shoppingBasketId}`)
            .then(() => {
                setUiState({ ...uiState, deleting: false });
                setShoppingCart(null);
                setCartItems([]);
            }).catch((err) => {
                setUiState({ ...uiState, deleting: false, error: err });
                alert("Error deleting cart", err.error);
            })
        )
    }, [uiState.deleting]);
    
    return (
    <>
        <div className="cart">
            <h1>Shopping Cart</h1>
            {!shoppingCart && <p>Your cart is empty.</p>}
            {cartItems && cartItems.map((item) => (
                <div key={item.inventoryId} className="cart-item">
                    <img src={item.inventory?.imageUrl} alt={item.inventory.name} />
                    <div className="cart-item-details">
                        <h2>{item.inventory.name}</h2>
                        <p>Price: ${item.inventory.price}</p>
                        <p>Quantity: {item.quantity}</p>
                    </div>
                </div>
            ))}
        </div>
            {shoppingCart?.totalPrice > 0 && <p>Total: {shoppingCart?.totalPrice} kr</p>}
            
            {shoppingCart?.totalPrice >1 && <button onClick={() => setUiState(prev => ({...prev, deleting: true}))}>Empty Cart</button>}
            <Link to="/"><button>Continue Shopping</button></Link>
            {shoppingCart?.totalPrice >1 &&  <Link to="/checkout">
                <button >Checkout</button></Link>}
    </>
    );
}
export default Cart;