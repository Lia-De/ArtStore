import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../config.js";
import * as Format from "../Helpers.js";

export default function UpdateOrders(){
const [uiState, setUiState] = useState({
    loading: true,
    error: null,
    updating: false,
    reload: false,
    loadingOrders: 'active'
});
const [orders, setOrders] = useState([]);
const [displayDetail, setDisplayDetail] = useState(0);
const [orderDetails, setOrderDetails] = useState([]);

useEffect(() => {
    setUiState(prev => ({...prev, loading: true, error: null}));
    axios.get(`${apiUrl}/admin/orders/${uiState.loadingOrders}`)
        .then(response => {
            setOrders(response.data)
        })
        .catch(err => {
            setUiState(prev => ({...prev, error: err}));
            setOrders([]);
        })
        .finally(() => {
            setUiState(prev => ({...prev, loading: false, reload: false}));
            setDisplayDetail(0);
            setOrderDetails([]);
        });
    }, [uiState.reload]);

    const changeDetail = (orderId) => {
        if (displayDetail === orderId) {
            setDisplayDetail(0);
            setOrderDetails([]);
        } else {
            setDisplayDetail(orderId);
            setOrderDetails(orders.filter(order => order.orderId === orderId));
            // console.log(orders.filter(order => order.orderId === orderId));
        }
    }

    const shipOrder = (orderId) => {
        setUiState(prev => ({...prev, loading: true, error: null}));
        axios.post(`${apiUrl}/admin/order/ship/${orderId}`)
        .catch(err => {
            setUiState(prev => ({...prev, error: err.response.data}));
        }).finally(() => {
            setUiState(prev => ({...prev, loading: false, reload: true}));
            setDisplayDetail(0);
            setOrderDetails([]);
    
        });
    }

    const refundOrder = (orderId) => {
        setUiState(prev => ({...prev, loading: true, error: null}));
        axios.post(`${apiUrl}/admin/order/refund/${orderId}`)
        .then(response => {console.log(response.data)})
        .catch(err => {
            setUiState(prev => ({...prev, error: err.response.data}));
        }).finally(() => {
            setUiState(prev => ({...prev, loading: false, reload: true}));
            setDisplayDetail(0);
            setOrderDetails([]);
        });
    }

    const DisplayDetail = (order) => {
        if (displayDetail === order.orderId) {
            return (
                <tr className="highlight" key={`detail-${order.orderId}`}>
                <td colSpan="3">
                 <div>
                     {order.shoppingBasket.basketItems.map(item => (
                         <div key={item.inventoryId}>
                            <p>{item.inventory.name} x {item.quantity} @ {item.price} kr</p>
                         </div>
                     ))}
                     <p>Order created: {Format.formatDate(order.createdAt)}</p>
                     <p>Order updated: {Format.formatDate(order.updatedAt)}</p>
                     <p>Payment Method: {order.paymentDetail}</p>
              
                        {order.status === 0 && <>  
                        <button
                        disabled={displayDetail === order.orderId ? undefined : true}
                        className={displayDetail === order.orderId ? undefined : 'disabled'}
                        onClick={() => {shipOrder(order.orderId)}}>
                            Ship
                    </button>
                    <button
                        disabled={displayDetail === order.orderId ? undefined : true}
                        className={displayDetail === order.orderId ? undefined : 'disabled'}
                        onClick={() => {refundOrder(order.orderId)}}>
                            Cancel & Refund
                    </button>
                    </>}
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
                <button
                onClick={() => {
                    setUiState(prev => ({
                        ...prev, 
                        loadingOrders: 'active', 
                        reload: true}))}
                    }>Active Orders</button>
                <button
                onClick={() => {
                    setUiState(prev => ({
                        ...prev, 
                        loadingOrders: 'shipped', 
                        reload: true}))}
                    }>Shipped Orders</button>
                
                <button
                onClick={() => {
                    setUiState(prev => ({
                        ...prev, 
                        loadingOrders: 'refunded', 
                        reload: true}))}
                    }>Refunded Orders</button>

            {uiState.loading && <p>Loading...</p>}
            {uiState.error && <p>Error: {uiState.error.message}</p>}
            {orders.length > 0 ? (
                <table id="orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Items</th>
                            <th>Total Price</th>
                            <th>Created</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <>
                            <tr className={displayDetail === order.orderId ? 'highlight' : undefined}
                            key={`order-${order.orderId}`}>
                                <td><button onClick={() => {changeDetail(order.orderId)}}>
                                    {order.orderId}
                                    </button></td>
                                <td>{order.shoppingBasket.basketItems.reduce((sum, item)=>sum + item.quantity, 0)}</td>
                                <td>{order.totalCost} kr (Shipping: {order.shippingCost} kr )</td>
                                <td>{Format.formatDate(order.createdAt)}</td>
                                <td>
                                    {Format.statusLabels[order.status] ?? order.status}
                                </td>
                            </tr>
                            {(displayDetail === order.orderId) ?  DisplayDetail(order): undefined}
                            </>
                        ))}
                    </tbody>
                </table>
            ) : (
                <>
                <p>No active orders found.</p>
     
                </>
            )}  
        </div>
    )
}