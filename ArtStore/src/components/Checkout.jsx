import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { shoppingCartAtom } from '../atoms/cartAtom.js';
import { apiUrl } from '../config.js';
import { shopCustomerAtom } from '../atoms/shopCustomerAtom';

const Checkout = () => {
    const [shoppingCart, setShoppingCart] = useAtom(shoppingCartAtom);
    const [shopCustomer, setShopCustomer] = useAtom(shopCustomerAtom);
    const [uiState, setUiState] = useState({
        loading: true,
        error: null,
        updating: false,
        deleting: false
    });

}
export default Checkout;