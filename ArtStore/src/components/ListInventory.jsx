import {useState, useEffect} from 'react';
import axios from 'axios';
import {useForm } from 'react-hook-form';
import * as Format from '../Helpers.js';
import { UpdateInventory } from './UpdateInventory.jsx';
import { apiUrl } from '../config.js';
import { useAtom } from 'jotai';
import { inventoryListAtom, makerListAtom } from '../atoms/inventoryListAtom.js';


export default function ListInventory(){
    const [uiState, setUiState] = useState({
        loading: true,
        error: null,
        updating: false,
        reload: false
    });
    const [inventory, setInventory] = useAtom(inventoryListAtom);
    const [makerList, setMakerList] = useAtom(makerListAtom);
    const [singleInventory, setSingleInventory] = useState({});
    const { register, handleSubmit, reset } = useForm();

    useEffect( () => {
        uiState.reload && setUiState(prev => ({...prev, reload: false}));
        setUiState(prev => ({...prev, loading: true, error: null}));
        axios.get(`${apiUrl}/admin/inventory`)
        .then((response) => {
            setInventory(response.data);
            
        }) .catch ((err) => { 
            setUiState(prev => ({...prev, error: err})); 
            setInventory([]);
        })
        .finally(() => {  setUiState(prev => ({...prev, loading: false})); });
        
        setUiState(prev => ({...prev, loading: true, error: null}));
        axios.get(`${apiUrl}/admin/makerlistDTO`)
        .then((response) => {
            setMakerList(response.data);
            // console.log(response.data);
        }) .catch ((err) => { setUiState(prev => ({...prev, error: err})); })
        .finally(() => {  setUiState(prev => ({...prev, loading: false})); });

    }, [uiState.reload]);
    

    function AddNewInventory(){
        const [selectedFile, setSelectedFile] = useState(null);

        
        const onSubmit = async (data) => {
            // console.log(data.imageUpload[0])
            var imageresult = null;
            
            const formData = new FormData();
            formData.append("imageUpload", data.imageUpload[0]); 
            // console.log(formData);
            try {
                imageresult = await axios.post(
                    `${apiUrl}/admin/uploadImage`, // adjust as needed
                    formData
                );
                
            } catch (error) {
                console.error("Upload failed:", error);
                alert("Upload failed: " + (error.response?.data || error.message));
            }
            
            console.log(imageresult.data);
            const imageUrl = imageresult ? `${apiUrl}/images/${imageresult.data}` : data.imageUrl;
            console.log(imageUrl);

            const newInventory = {
                Name: data.name,
                maker: {
                    makerId: parseInt(data.makerId, 10),
                    firstname: data.makerFirst,
                    lastname: data.makerLast,
                },
                description: data.description,
                quantity: parseFloat(data.quantity),
                price: parseInt(data.price, 10),
                imageUrl: imageUrl,
                tags: data.tags.split(",").map(tag => tag.trim()),

            }
            // console.log(newInventory);
            setUiState(prev => ({
                ...prev, 
                loading: true,
                error: null
            }));

            axios.post(`${apiUrl}/admin/addInventory`, newInventory, {
                headers: {
                  'Content-Type': 'application/json',
                }
              })
            .then(() => {
                // setInventory(prev => [...prev, response.data]);
                setUiState(prev => ({...prev, reload: true}));
            })
            .catch ((err) => {
                console.error(err.response?.data || err.message);
                setUiState(prev => ({...prev, error: err}));
            })
            .finally(() => { 
                setUiState(prev => ({...prev, loading: false}));
                reset();
            });
        }
        function MakerListElements() {
            return (
                <select id="maker" {...register("makerId")} >
                    <option value="0">Select a maker</option>
                    {makerList.map((item) => (
                        <option key={`maker${item.makerId}`} value={item.makerId}>
                            {item.name}
                        </option>
                    ))}
                </select>)
      }
        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <h3>Add New Inventory</h3>
                <label htmlFor="maker">Maker:</label>
                <MakerListElements />
                <label htmlFor="newmaker">New Maker:</label>
                <input type="text" id="newmaker" placeholder="Firstname" {...register("makerFirst")}/>
                <input type="text" id="newmaker2" placeholder="Lastname" {...register("makerLast")}/>
                <label htmlFor="name">Item name:</label>
                <input type="text" id="name" {...register("name" , { required: true})}/>

                <label htmlFor="description">Description:</label>
                <input type="text" id="description" {...register("description")} />

                <label htmlFor="quantity">Quantity:</label>
                <input type="number" id="quantity" {...register("quantity", { required: true})} />

                <label htmlFor="price">Price:</label>
                <input type="number" step="0.01" id="price" {...register("price", { required: true})} />

                <label htmlFor="imageUrl">Image URL:</label>
                <input type="text" id="imageUrl" {...register("imageUrl")} />
                
                <label htmlFor="imageUpload">Upload image:</label>
                <input type="file" id="imageUpload" accept="image/*"   
                    {...register("imageUpload", {
                        onChange: (e) => {  return e.target.files; }
                    })} />

                <label htmlFor="tags">Tags:</label>
                <input type="text" id="tags" {...register("tags")} />

                <button type="submit">Add</button>
            </form>
        );
    }

    // Check to see if we have an updated item.
    // useEffect(() => {singleInventory != {} && console.log(singleInventory);}, [singleInventory]);
    


    const updateItem = (item) => {
        
        setUiState(prev => ({...prev, loading: true, updating: true}));

        setSingleInventory({});
        console.log(item);
        axios.get(`${apiUrl}/admin/inventory/${item}`)
        .then((response) => {
            setSingleInventory(response.data);
        })
        .catch((err) => {
            console.error(err);
            setSingleInventory(null);
        })
        .finally(() => {
            setUiState(prev => ({...prev, loading: false}));
        });

    }

    const inventoryElements = inventory.map((item) => {
        return (
            <div key={item.inventoryId} className='inventory-item'>
                <h3>{item.name} by {item.maker?.firstname + ' ' +item.maker?.lastname} </h3>
                <p>{item.description}</p>
                <p>{item.price} kr</p>
                <p className={item.quantity==0 ? "soldout": undefined}>Available: {item.quantity}</p>
                <p>Items in shoppingBaskets: {item.currentlyInBaskets}</p>
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
            
            {inventory && !uiState.updating && (<h2>Inventory</h2>)}
            {uiState.loading && <p>Loading...</p>}
            {uiState.error && <p>Error: {uiState.error.message}</p>}
            {inventory && !uiState.updating && <>
                <div className='inventory-list'>
                    {inventoryElements}
                </div>
                <AddNewInventory />
                </>
            }
            {uiState.updating && !uiState.loading && <>
            <h2>Updating</h2>
            { singleInventory && <UpdateInventory item={singleInventory} setItem={setSingleInventory} setUiState={setUiState} />}
            
            </>}
        </div>
    );

}
