import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteOrder, listOrders } from '../actions/orderActions';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { ORDER_DELETE_RESET } from '../constants/orderConstants';

export default function OrderListScreen() {
    const orderList = useSelector(state => state.orderList);
    const { loading, error, orders } = orderList;
    const orderDelete = useSelector(state => state.orderDelete);
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = orderDelete;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(()=>{
        dispatch({type: ORDER_DELETE_RESET});
        dispatch(listOrders());
    },[dispatch, successDelete]);
    const deleteHandler = (order) => {
        if(window.confirm('Sunteti sigur ca stergeti?')){
            dispatch(deleteOrder(order._id));
        }
    };
    return(
        <div>
            <div>
        <h1>Comenzi</h1>
        {loadingDelete && <LoadingBox></LoadingBox>}
        {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
        {
            loading? <LoadingBox></LoadingBox>:
            error? <MessageBox variant="danger">{error}</MessageBox>
            :
            (
                <table className='table'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Client</th>
                            <th>Data</th>
                            <th>Total</th>
                            <th>Platit</th>
                            <th>Livrat</th>
                            <th>Actiuni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.user.name}</td>
                                    <td>{order.createdAt.substring(0,10)}</td>
                                    <td>{order.totalPrice.toFixed(2)}</td>
                                    <td>{order.isPaid ? order.paidAt.substring(0,10): 'Nu'}</td>
                                    <td>{order.isDelivered ? order.deliveredAt.substring(0,10) : 'Nu'}</td>
                                    <td>
                                        <button type="button" className='small'
                                            onClick={()=>navigate(`/order/${order._id}`)}>
                                                Detalii comanda
                                        </button>
                                        <button type="button" className='small'
                                            onClick={()=>deleteHandler(order)}>
                                                Stergere
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            )
        }
    </div>
        </div>
    )

 }