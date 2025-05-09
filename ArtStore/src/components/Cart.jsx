import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { shoppingCartAtom } from '../atoms/cartAtom.js';
import { apiUrl } from '../config.js';
import { shopCustomerAtom } from '../atoms/shopCustomerAtom';
import { Link } from 'react-router';

const Cart = () => {
    const [shoppingCart, setShoppingCart] = useAtom(shoppingCartAtom);
    const [shopCustomer, setShopCustomer] = useAtom(shopCustomerAtom);
    const [cartItems, setCartItems] = useState([]);
    const [uiState, setUiState] = useState({
        loading: true,
        error: null,
        updating: false,
    });

    useEffect(() => { 
        setUiState(prev => ({...prev, loading: true, error: null}));
        fetch(`${apiUrl}/shopping/cart/${shoppingCart.shoppingBasketId}`)
            .then((response) => response.json())
            .then((data) => {
                setCartItems(data);
            })
            .catch((err) => { 
                setUiState(prev => ({...prev, error: err}));
                setCartItems([]);
                setShoppingCart(null); 
            })
            .finally(() => {  
                setUiState(prev => ({...prev, loading: false, error: null})); 
            });
    }
    , []);

    console.log(shoppingCart);
    return (
        <div className="cart">
            <h1>Shopping Cart</h1>
            {!shoppingCart && <p>Your cart is empty.</p>}
            {cartItems && cartItems.map((item) => (
                <div key={item.inventoryId} className="cart-item">
                    <img src={item.imageUrl} alt={item.name} />
                    <div className="cart-item-details">
                        <h2>{item.name}</h2>
                        <p>Price: ${item.price}</p>
                        <p>Quantity: {item.quantity}</p>
                    </div>
                </div>
            ))}
            {shoppingCart && <p>Total: ${shoppingCart.totalPrice} kr</p>}
            <Link to="/"><button>Continue Shopping</button></Link>
        </div>
    );
}
export default Cart;