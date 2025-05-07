import {useState, useEffect} from 'react';
import axios from 'axios';
import {useForm } from 'react-hook-form';
import * as Format from '../Helpers.js';
import { UpdateInventory } from './UpdateInventory.jsx';
import { apiUrl } from '../config.js';

export default function ListInventory(){
    
    const [inventory, setInventory] = useState([]);
    const [singleInventory, setSingleInventory] = useState({});
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);
    const { register, handleSubmit, reset } = useForm();

    useEffect( () => {
        setLoading(true);
        setError(null);
                axios.get(`${apiUrl}/admin/inventory`)
                .then((response) => {
                    setInventory(response.data);
                    console.log(response.data);
                }) .catch ((err) => { setError(err); })
                .finally(() => {  setLoading(false); });
    }, []);
    

    function AddNewInventory(){
        const onSubmit = (data) => {
            reset();
            const newInventory = {
                Name: data.name,
                maker: {
                    firstname: data.makerFirst,
                    lastname: data.makerLast,
                },
                description: data.description,
                quantity: parseFloat(data.quantity),
                price: parseInt(data.price, 10),
                imageUrl: data.imageUrl,
                tags: data.tags.split(",").map(tag => tag.trim()),

            }
            // console.log(newInventory);
            setLoading(true);
            setError(null);
            axios.post(`${apiUrl}/admin/addInventory`, newInventory, {
                headers: {
                  'Content-Type': 'application/json',
                }
              })
            .then((response) => {
                setInventory(prev => [...prev, response.data]);
            })
            .catch ((err) => {
                console.error(err.response?.data || err.message);
                setError(err)
            })
            .finally(() => { setLoading(false); });
        }
        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <h3>Add New Inventory</h3>
                <label htmlFor="maker">Maker:</label>
                <input type="text" id="maker" placeholder="Firstname" {...register("makerFirst")}/>
                <input type="text" id="maker2" placeholder="Lastname" {...register("makerLast")}/>
                <label htmlFor="name">Item name:</label>
                <input type="text" id="name" {...register("name")}/>

                <label htmlFor="description">Description:</label>
                <input type="text" id="description" {...register("description")} />

                <label htmlFor="quantity">Quantity:</label>
                <input type="number" id="quantity" {...register("quantity")} />

                <label htmlFor="price">Price:</label>
                <input type="number" step="0.01" id="price" {...register("price")} />

                <label htmlFor="imageUrl">Image URL:</label>
                <input type="text" id="imageUrl" {...register("imageUrl")} />

                <label htmlFor="tags">Tags:</label>
                <input type="text" id="tags" {...register("tags")} />

                <button type="submit">Add</button>
            </form>
        );
    }

    // Check to see if we have an updated item.
    // useEffect(() => {singleInventory != {} && console.log(singleInventory);}, [singleInventory]);

    const updateItem = (item) => {
        setUpdating(true);
        setLoading(true);
        setSingleInventory({});
        console.log(item);
        axios.get(`${apiUrl}/admin/inventory/${item}`)
        .then((response) => {
            setSingleInventory(response.data);
        })
        .catch((err) => {
            console.error(err);
        })
        .finally(() => {
            setLoading(false);
        });

    }

    const inventoryElements = inventory.map((item) => {
        return (
            <div key={item.inventoryId} className='inventory-item'>
                <h3>{item.name} by {item.maker?.firstname + ' ' +item.maker?.lastname} </h3>
                <p>{item.description}</p>
                <p>{item.price} kr</p>
                <p>Quantity {item.quantity}</p>
                {item.imageUrl && <img src={item.imageUrl} alt={item.name} />}
                <p>Added: {Format.formatUnixTime(item.createdAt)}</p>
                <p>Last update: {Format.formatUnixTime(item.updatedAt)}</p>
                <p>Tags: {item.tags.join(", ")}</p>
                <button onClick={() => updateItem(item.inventoryId) }>Update</button>
                <button onClick={() => {}}>Delete</button>
            </div>
        );
    })

    return (
        <div>
            <h1>Art Store</h1>
            
            {inventory && !updating && <h2>Inventory</h2>}
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {inventory && !updating && <>
                <div className='inventory-list'>
                    {inventoryElements}
                </div>
                <AddNewInventory />
                </>
            }
            {updating && !loading && <>
            <h2>Updating</h2>
            { singleInventory && <UpdateInventory item={singleInventory} setItem={setSingleInventory} setUpdating={setUpdating} />}
            
            </>}
        </div>
    );

}
