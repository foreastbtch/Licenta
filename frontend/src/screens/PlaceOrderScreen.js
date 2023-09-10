import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { createOrder } from '../actions/orderActions';
import CheckoutSteps from '../components/CheckoutSteps'
import { ORDER_CREATE_RESET } from '../constants/orderConstants';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function PlaceOrderScreen() {
    const cart = useSelector(state => state.cart);
    const navigate = useNavigate();
    useEffect(()=>{
        if(!cart.paymentMethod){
            navigate('/payment');
        }
    },[cart, navigate]);

    const orderCreate = useSelector(state => state.orderCreate);
    const {loading, success, error, order} = orderCreate;
    const toPrice = (num)=>{
        return Number(num.toFixed(2));
    }

    cart.itemsPrice = toPrice(cart.cartItems.reduce((a, c) => a + c.qty * c.price, 0));
    cart.shippingPrice = cart.itemsPrice > 100? toPrice(0): toPrice(10);
    cart.taxPrice = toPrice(0.05 * cart.itemsPrice);
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

    const dispatch = useDispatch();
    const placeOrderHandler = () =>{
        dispatch(createOrder({...cart, orderItems: cart.cartItems}));
    };

    useEffect(()=>{
        if(success){
            navigate(`/order/${order._id}`);
            dispatch({type: ORDER_CREATE_RESET});
        }
    },[success, dispatch, order, navigate]);

  return(
    <div>
        <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
        <div className='row top'>
            <div className='col-2'>
                <ul>
                    <li>
                        <div className='card card-body'>
                            <h2>Livrare</h2>
                            <p>
                                <strong>Nume: </strong>
                                {cart.shippingAddress.fullname}
                                <br/>
                                <strong>Adresa: </strong>
                                {cart.shippingAddress.address},
                                {" "}
                                {cart.shippingAddress.city},
                                {" "} 
                                {cart.shippingAddress.postalCode},
                                {" "} 
                                {cart.shippingAddress.country}
                            </p>
                        </div>
                    </li>
                    <li>
                        <div className='card card-body'>
                            <h2>Plata</h2>
                            <p>
                                <strong>Metoda: </strong>
                                {cart.paymentMethod}
                            </p>
                        </div>
                    </li>
                    <li>
                        <div className='card card-body'>
                            <h2>Produse</h2>
                            <ul>
                        {
                            cart.cartItems.map((item)=>(
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
                                <div>{cart.itemsPrice.toFixed(2)} Lei</div>
                            </div>
                        </li>
                        <li>
                            <div className='row'>
                                <div>Livrare</div>
                                <div>{cart.shippingPrice.toFixed(2)} Lei</div>
                            </div>
                        </li>
                        <li>
                            <div className='row'>
                                <div>Taxe</div>
                                <div>{cart.taxPrice.toFixed(2)} Lei</div>
                            </div>
                        </li>
                        <li>
                            <div className='row'>
                                <div><strong>Total comanda</strong></div>
                                <div><strong>{cart.totalPrice.toFixed(2)} Lei</strong></div>
                            </div>
                        </li>
                        <li>
                            <button type="button" onClick={placeOrderHandler} className="primary block" disabled={cart.cartItems.length === 0}>
                                Trimite Comanda
                            </button>
                        </li>
                        {
                            loading && <LoadingBox></LoadingBox>
                        }
                        {
                            error && <MessageBox variant="danger">{error}</MessageBox>
                        }
                    </ul>
                </div>
            </div>
        </div>
    </div>
   )

 }