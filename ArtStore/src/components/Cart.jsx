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
    });

    useEffect(() => { 
        setCartItems(shoppingCart?.basketItems ?? []);
    }
    , [shoppingCart]);

    // console.log(shoppingCart);
    
    return (
        <div className="cart">
            <h1>Shopping Cart</h1>
            {!shoppingCart && <p>Your cart is empty.</p>}
            {cartItems && cartItems.map((item) => (
                <div key={item.inventoryId} className="cart-item">
                    <img src={item.inventory.imageUrl} alt={item.inventory.name} />
                    <div className="cart-item-details">
                        <h2>{item.inventory.name}</h2>
                        <p>Price: ${item.inventory.price}</p>
                        <p>Quantity: {item.quantity}</p>
                    </div>
                </div>
            ))}
            {shoppingCart && <p>Total: ${shoppingCart.totalPrice} kr</p>}
            
            <button>Empty Cart</button>
            <Link to="/"><button>Continue Shopping</button></Link>
        </div>
    );
}
export default Cart;