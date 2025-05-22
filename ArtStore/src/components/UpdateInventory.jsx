import axios from 'axios';
import { apiUrl } from '../config.js';
import {useEffect, useState} from 'react';
import { useForm } from 'react-hook-form';

export const UpdateInventory = ( {item, setItem, setUiState} ) => {
    const {register, handleSubmit} = useForm();
    const [updated, setUpdated] = useState(false);
    const [updatedItem, setUpdatedItem] = useState(null);

    const onSubmit = async (data) => {
        
        // console.log(data);
        // Call the API to update the item..
           var imageresult = null;
            
        if (data.imageUpload[0] != null) { 
               const formData = new FormData();
            formData.append("imageUpload", data.imageUpload[0]); 
            // console.log(formData);
            try {
                imageresult = await axios.post(
                    `${apiUrl}/admin/uploadImage`, 
                    formData
                );
            } catch (error) {
                console.error("Upload failed:", error);
                alert("Upload failed: " + (error.response?.data || error.message));
            }
        }
        const imageUrl = imageresult ? `${apiUrl}/images/${imageresult.data}` : data.imageUrl;
            

        setUpdatedItem(()=> ({ 
            inventoryId: item.inventoryId
            , name: data.name
            , description: data.description
            , quantity: Number(data.quantity)
            , price: Number(data.price)
            , imageUrl: imageUrl
            , tags: data.tags.split(",").map(tag => tag.trim()),
            }));
        setUpdated(true);
}

    useEffect(() => {
        if (updated) {
            axios.post(`${apiUrl}/admin/inventory/update/${updatedItem.inventoryId}`, updatedItem, {
                headers: {
                  'Content-Type': 'application/json',
                }
            })
            .then((response) => {
                console.log("Item updated", response.data);
                // Perhaps need to check the result - some fields may not be updated
                setUpdated(false);
            })
            .catch((err) => {
                console.error("Error updating item", err);
                setUiState(prev => ({...prev, error: err.response.data}));
            })
            .finally(() => {
                setUiState(prev => ({...prev, updating: false, reload: true}));
            });
        }
    }, [updated]);

    return ( item &&
        <div className='update-inventory'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h3>Maker: {item.maker?.firstname +" " +item.maker?.lastname}</h3>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name"  defaultValue={item.name} {...register("name")}/>

                <label htmlFor="description">Description:</label>
                <input type="text" id="description" defaultValue={item.description} {...register("description")} />

                <label htmlFor="quantity">Quantity:</label>
                <input type="text" id="quantity" defaultValue={item.quantity} {...register("quantity")} />

                <label htmlFor="price">Price:</label>
                <input type="number" id="price"  defaultValue={item.price}{...register("price")} />

                <label htmlFor="imageUrl">Image URL:</label>
                <input type="text" id="imageUrl" defaultValue={item.imageUrl} {...register("imageUrl")} />
                
                <label htmlFor="imageUpload">Upload image:</label>
                <input type="file" id="imageUpload" accept="image/*"   
                    {...register("imageUpload", {
                        onChange: (e) => {  return e.target.files; }
                    })} />

                <label htmlFor="tags">Tags:</label>
                <input type="text" id="tags" defaultValue={item.tags?.map(item => item.name)} {...register("tags")} />

                <button type="submit">Update</button>
            </form>
        </div>
    );


}