import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../config.js";
import * as Format from "../Helpers.js";

export default function UpdateOrders(){
const [uiState, setUiState] = useState({
    loading: true,
    error: null,
    updating: false,
});
const [orders, setOrders] = useState([]);
const [displayDetail, setDisplayDetail] = useState(0);
const [orderDetails, setOrderDetails] = useState([]);

useEffect(() => {
    setUiState(prev => ({...prev, loading: true, error: null}));
    axios.get(`${apiUrl}/admin/orders/active`)
        .then(response => {
            setOrders(response.data)
            console.log(response.data);
        })
        .catch(err => {
            setUiState(prev => ({...prev, error: err}));
            setOrders([]);
        })
        .finally(() => {
            setUiState(prev => ({...prev, loading: false}));
        });
    }, []);

    const changeDetail = (orderId) => {
        if (displayDetail === orderId) {
            setDisplayDetail(0);
        } else {
            setDisplayDetail(orderId);
        }
    }

    const DisplayDetail = (order) => {
        if (displayDetail === order.orderId) {
            return (
                <tr>
                <td colSpan="3">
                 <div>
                     {order.shoppingBasket.basketItems.map(item => (
                         <div key={item.inventoryId}>
                            <p>{item.inventory.name} x {item.quantity} @ {item.price} kr</p>
                            <p>Order created: {Format.formatDate(order.createdAt)}</p>
                            <p>Order updated: {Format.formatDate(order.updatedAt)}</p>
                         </div>
                     ))}
             </div>
         </td>
         <td colSpan="2">
                <div>
                <h3>Shipping Address:</h3>
                <p>{order.shopCustomer.firstname} {order.shopCustomer.lastname}</p>
                <p>{order.shopCustomer.address}</p>   
                <p>{order.shopCustomer.zipCode} {order.shopCustomer.city}</p>
                <p>{order.shopCustomer.country}</p>
                <p>{order.shopCustomer.phone}</p>
                <p>{order.shopCustomer.email}</p>
                <p>Payment method: {order.shopCustomer.paymentDetail}</p>

                </div>
                </td>
     </tr>
            )

        }
    }

    return (
        <div>
            <h1>Update Orders</h1>
            {uiState.loading && <p>Loading...</p>}
            {uiState.error && <p>Error: {uiState.error.message}</p>}
            {orders.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Items</th>
                            <th>Total Price</th>
                            <th>Created</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <>
                            <tr key={order.orderId}>
                                <td><button onClick={() => {changeDetail(order.orderId)}}>
                                    {order.orderId}
                                    </button></td>
                                <td>{order.shoppingBasket.basketItems.reduce((sum, item)=>sum + item.quantity, 0)}</td>
                                <td>{order.totalCost} kr (Shipping: {order.shippingCost} kr )</td>
                                <td>{Format.formatDate(order.createdAt)}</td>
                                <td>
                                    <button>Ship</button> 
                                    <button>Cancel & Refund</button>
                                </td>
                            </tr>
                            {(displayDetail === order.orderId) ?  DisplayDetail(order): undefined}
                            </>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No active orders found.</p>
            )}  
        </div>
    )
}