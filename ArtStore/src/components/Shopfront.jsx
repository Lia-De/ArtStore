import { useAtom } from "jotai";
import { inventoryListAtom, makerListAtom } from "../atoms/inventoryListAtom.js";
import { use, useEffect, useState } from "react";
import { apiUrl } from '../config.js';
import { MdClose } from "react-icons/md";

const Shopfront = () => {

    const [inventory, setInventory] = useAtom(inventoryListAtom);
    const [makerList, setMakerList] = useAtom(makerListAtom);

    const [uiState, setUiState] = useState({
        loading: true,
        error: null,
        updating: false,
        viewList: true,
        viewItem: false,
        item: null,
    });

    useEffect(() => {
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
            .finally(() => {  setUiState(prev => ({...prev, loading: false})); });
        
    },[]);

    function InventoryDetails({ item }) {
        setUiState(prev => ({...prev, viewItem: true, viewList: false, item: item}));
    }
if (uiState.viewItem) {
    return (
        <div className="inventory-details">
            <h2>{uiState.item.name}</h2>
            <button className="closeBtn" onClick={() => setUiState(prev=>({...prev, viewItem: false, viewList: true}))}><MdClose /></button>
            {uiState.item.imageUrl && <img src={uiState.item.imageUrl} alt={uiState.item.name} />}
            <p>{uiState.item.description}</p>
            <p>Price: ${uiState.item.price}</p>
            <p>Quantity: {uiState.item.quantity}</p>
            <p>Maker: {uiState.item.maker?.firstname + ' ' + uiState.item.maker?.lastname} </p>
            <button>Add to Cart</button>
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
                        <p>Quantity: {item.quantity}</p>
                        <p>Maker: {makerList.find(maker => maker.makerId === item.maker.makerId)?.name} </p>
                    </div>
                ))}
        </div>
        </div>

    );}
}

export default Shopfront;