import { useAtom } from "jotai";
import { inventoryListAtom, makerListAtom } from "../atoms/inventoryListAtom.js";
import { shopCustomerAtom } from "../atoms/shopCustomerAtom.js";
import { shoppingCartAtom } from "../atoms/cartAtom.js";

import { useEffect, useState } from "react";
import { apiUrl } from '../config.js';
import { MdClose } from "react-icons/md";
import axios from "axios";

const Shopfront = () => {

    const [inventory, setInventory] = useAtom(inventoryListAtom);
    const [shopCustomer, setShopCustomer] = useAtom(shopCustomerAtom);
    const [shoppingCart, setShoppingCart] = useAtom(shoppingCartAtom);

    const [uiState, setUiState] = useState({
        loading: true,
        error: null,
        updating: false,
        viewList: true,
        viewItem: false,
        item: null,
    });

    useEffect(() => {
        // console.log('cart', shoppingCart);
        // console.log('customer', shopCustomer);
        
        setUiState(prev => ({...prev, loading: true, error: null}));
        fetch(`${apiUrl}/shopping/listInventories`)
            .then((response) => response.json())
            .then((data) => {
                setInventory(data);
                
            })
            .catch((err) => { 
                setUiState(prev => ({...prev, error: err})); 
                setInventory([]);
            })
            .finally(() => {  
                setUiState(prev => ({...prev, loading: false, error: null})); 
            });
        
    },[]);

    function InventoryDetails({ item }) {
        setUiState(prev => ({...prev, viewItem: true, viewList: false, item: item}));
    }
    const AddToCart = (inventoryId) => {
        setUiState(prev => ({...prev, updating: true}));
        const cartItem = {
            "customerId": shopCustomer?.customerId ?? 0,
            "shoppingBasketId": shoppingCart?.shoppingBasketId ?? 0,
            "inventoryId": inventoryId,
            "quantity": 1
          }
        console.log(cartItem);
        axios.post(`${apiUrl}/shopping/addToBasket`, cartItem)
        .then((result)=>{
            console.log(result.data);
            setShoppingCart(result.data);
            setUiState(prev => ({...prev, updating: false}));
            // update the inventory list to reflect the new quantity
            setUiState(prev => ({...prev, item: {...prev.item, quantity: prev.item.quantity - 1}}));
            setInventory(prev => prev.map(item => {
                if (item.inventoryId === inventoryId) {
                    return {...item, quantity: item.quantity - 1};
                }
                return item;
            }));

        }).catch((err)=>{
            console.error(err);
            setUiState(prev => ({...prev, updating: false}));
            setUiState(prev => ({...prev, error: err}));
        }).finally(()=>{

        })
    }

if (uiState.viewItem) {
    return (
        <div className="inventory-details">
            <h2>{uiState.item.name}</h2>
            <button className="closeBtn" onClick={() => setUiState(prev=>({...prev, viewItem: false, viewList: true}))}> <MdClose /> </button>
            {uiState.item.imageUrl && <img src={uiState.item.imageUrl} alt={uiState.item.name} />}
            <p>{uiState.item.description}</p>
            <p>Price: ${uiState.item.price}</p>
            <p className={uiState.item.quantity==0 ? "soldout": undefined}>Quantity: {uiState.item.quantity}</p>
            <p>Maker: {uiState.item.maker?.firstname + ' ' + uiState.item.maker?.lastname} </p>
            <p>Tags: {uiState.item.tags.join(", ")}</p>
                <button 
                    className={uiState.item.quantity==0 ? "soldout" : undefined} 
                    disabled={uiState.item.quantity==0 ? true: false} 
                    onClick={()=> AddToCart(uiState.item.inventoryId)}>
                        {uiState.updating ? "Adding ...": "Add to Cart"}
                </button> 
            
        </div>
    );
    }
if ( uiState.viewList){
    return (
        <div className="shopfront">
            <h1>Welcome to the Shop</h1>
            <p>Here you can find all the items available for sale.</p>
            <div className="inventory-list">
                {inventory?.map((item) => (
                    <div key={`inventory${item.inventoryId}`} className="inventory-item" onClick={() => InventoryDetails({item})}>
                        <h2>{item.name}</h2>
                        {item.imageUrl && <img src={item.imageUrl} alt={item.name} />}
                        <p>{item.description}</p>
                        <p>Price: ${item.price}</p>
                        <p className={item.quantity==0 ? "soldout": undefined}>Quantity: {item.quantity}</p>
                        <p>Maker: {item.maker?.firstname} {item.maker?.lastname}</p>
                    </div>
                ))}
        </div>
        </div>

    );}
}

export default Shopfront;