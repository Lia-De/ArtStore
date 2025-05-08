import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { shoppingCartAtom } from '../atoms/cartAtom.js';
import { apiUrl } from '../config.js';
import { shopCustomerAtom } from '../atoms/shopCustomerAtom';

const Cart = () => {
    const [cart, setCart] = useAtom(shoppingCartAtom);
    const [shopCustomer, setShopCustomer] = useAtom(shopCustomerAtom);
    const [uiState, setUiState] = useState({
        loading: true,
        error: null,
        updating: false,
    });
    return (
        <div className="cart">
            <h1>Shopping Cart</h1>
            <p>Your cart is empty.</p>
            <button className="btn btn-primary">Continue Shopping</button>
        </div>
    );
}
export default Cart;