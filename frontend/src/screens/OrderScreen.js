import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { deliverOrder, detailsOrder, payOrder } from '../actions/orderActions';
import Axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import { ORDER_DELIVER_RESET, ORDER_PAY_RESET } from '../constants/orderConstants';

export default function OrderScreen() {

    const { id } = useParams();
    const orderId = id;
    const [sdkReady, setSdkReady] = useState(false);
    const orderDetails = useSelector(state => state.orderDetails);
    const { order, loading, error } = orderDetails;
    const orderPay = useSelector(state => state.orderPay);
    const { loading: loadingPay, error: errorPay, success: successPay } = orderPay;
    const orderDeliver = useSelector(state => state.orderDeliver);
    const { loading: loadingDeliver, error: errorDeliver, success: successDeliver } = orderDeliver;
    const dispatch = useDispatch();
    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;

    useEffect(()=>{
        const addPayPalScript = async() => {
            const { data } = await Axios.get('/api/config/paypal');
            const script = document.createElement('script');
            script.type = "text/javascript";
            script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
            script.async = true;
            script.onload = () =>{
                setSdkReady(true);
            };
            document.body.appendChild(script);
        };
        if(!order || successPay || successDeliver || (order && order._id !== orderId)){
            dispatch({type: ORDER_PAY_RESET});
            dispatch({type: ORDER_DELIVER_RESET});
            dispatch(detailsOrder(orderId));
        }else{
            if(!order.isPaid){
                if(!window.paypal){
                    addPayPalScript();
                }else{
                    setSdkReady(true);
                }
            }
        }
    },[dispatch, orderId, order, sdkReady, successPay, successDeliver]);

    const successPaymentHandler = (paymentResult) =>{
        dispatch(payOrder(order, paymentResult)); 
    };

    const deliverHandler = () =>{
        dispatch(deliverOrder(order._id));
    };

  return loading? (<LoadingBox></LoadingBox>) 
  : 
  error? (<MessageBox variant="danger">{error}</MessageBox>) 
  :
  (
    <div>
        <h1>Comanda {order._id}</h1>
        <div className='row top'>
            <div className='col-2'>
                <ul>
                    <li>
                        <div className='card card-body'>
                            <h2>Livrare</h2>
                            <p>
                                <strong>Nume: </strong>
                                {order.shippingAddress.fullname}
                                <br/>
                                <strong>Adresa: </strong>
                                {order.shippingAddress.address},
                                {" "}
                                {order.shippingAddress.city},
                                {" "} 
                                {order.shippingAddress.postalCode},
                                {" "} 
                                {order.shippingAddress.country}
                            </p>
                            {
                                order.isDelivered? <MessageBox variant="success">Livrat la {order.deliveredAt}</MessageBox> 
                                :
                                <MessageBox variant="danger">Comanda nu a fost livrata inca</MessageBox>
                            }
                        </div>
                    </li>
                    <li>
                        <div className='card card-body'>
                            <h2>Plata</h2>
                            <p>
                                <strong>Metoda: </strong>
                                {order.paymentMethod}
                            </p>
                            {
                                order.isPaid? <MessageBox variant="success">Platit la {order.paidAt}</MessageBox> 
                                :
                                <MessageBox variant="danger">Comanda nu a fost inca platita</MessageBox>
                            }
                        </div>
                    </li>
                    <li>
                        <div className='card card-body'>
                            <h2>Produse</h2>
                            <ul>
                        {
                            order.orderItems.map((item)=>(
                                <li key={item.product}>
                                    <div className='row'>
                                        <div>
                                            <img src={item.image} alt={item.name} className="small"></img>
                                        </div>
                                    <div className='min-30'>
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </div>
                                    <div>
                                        {item.qty} x {item.price} Lei = {item.qty * item.price} Lei
                                    </div>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                        </div>
                    </li>
                </ul>
            </div>
            <div className='col-1'>
                <div className='card card-body'>
                    <ul>
                        <li>
                            <h2>Comanda</h2>
                        </li>
                        <li>
                            <div className='row'>
                                <div>Produse</div>
                                <div>{order.itemsPrice.toFixed(2)} Lei</div>
                            </div>
                        </li>
                        <li>
                            <div className='row'>
                                <div>Livrare</div>
                                <div>{order.shippingPrice.toFixed(2)} Lei</div>
                            </div>
                        </li>
                        <li>
                            <div className='row'>
                                <div>Taxe</div>
                                <div>{order.taxPrice.toFixed(2)} Lei</div>
                            </div>
                        </li>
                        <li>
                            <div className='row'>
                                <div><strong>Total comanda</strong></div>
                                <div><strong>{order.totalPrice.toFixed(2)} Lei</strong></div>
                            </div>
                        </li>
                        {
                            !order.isPaid && (
                                <li>
                                    {!sdkReady? (<LoadingBox></LoadingBox>):
                                        (
                                            <>
                                            {errorPay && <MessageBox variant="danger">{errorPay}</MessageBox>}
                                            {loadingPay && <LoadingBox></LoadingBox>}
                                            <PayPalButton amount= {order.totalPrice} onSuccess={successPaymentHandler}></PayPalButton>
                                            </>
                                        )
                                    }
                                </li>
                            )
                        }
                        {
                            userInfo.isAdmin && order.isPaid && !order.isDelivered &&(
                                <li>
                                    {loadingDeliver && <LoadingBox></LoadingBox>}
                                    {errorDeliver && <MessageBox variant="danger">{errorDeliver}</MessageBox>}
                                    <button type="button" className='primary block' onClick={deliverHandler}>Livreaza comanda</button>
                                </li>
                            )
                        }
                    </ul>
                </div>
            </div>
        </div>
    </div>
   )

 }