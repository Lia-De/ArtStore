import {useState, useEffect} from 'react';
import axios from 'axios';
import {useForm } from 'react-hook-form';

export default function ListInventory(){
    
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { register, handleSubmit } = useForm();

    useEffect( () => {
        
        const fetchInventory = async () => {
            try {
                const response = await axios.get('/api/admin/inventory');
                setInventory(response.data);
                console.log(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchInventory();
    }, []);

    return (
        <div>
        <h1>Art Store</h1>
        <p>This is the List Inventory component.</p>
        </div>
    );

}
