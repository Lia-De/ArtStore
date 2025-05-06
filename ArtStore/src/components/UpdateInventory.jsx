import React, {useEffect, useState} from 'react';
import { useForm } from 'react-hook-form';

export const UpdateInventory = ( {item, setItem, setUpdating} ) => {
    const {register, handleSubmit} = useForm();
       
    const onSubmit = (data) => {
        setUpdating(false);
        console.log(data);
        // Call the API to update the item..
        setItem(prev => ({...prev, 
            name: data.name
            , description: data.description
            , quantity: data.quantity
            , price: data.price
            , imageUrl: data.imageUrl
            , tags: data.tags.split(",").map(tag => ({name: tag.trim()}))
            
    }));
    console.log(item)
}

    useEffect(() => {console.log(item);}, [item]);

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

                <label htmlFor="tags">Tags:</label>
                <input type="text" id="tags" defaultValue={item.tags?.map(item => item.name)} {...register("tags")} />

                <button type="submit">Update</button>
            </form>
        </div>
    );


}