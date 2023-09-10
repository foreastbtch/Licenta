import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps'

export default function PaymentMethodScreen() {
    const cart = useSelector(state => state.cart);
    const {shippingAddress} = cart;
    const [paymentMethod, setPaymentMethod] = useState('PayPal');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const submitHandler = (e)=>{
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate('/placeorder');
    };
    useEffect(()=>{
        if(!shippingAddress.address){
            navigate('/shipping');
        }
    },[navigate, shippingAddress]);
  return(
    <div>
        <CheckoutSteps step1 step2 step3></CheckoutSteps>
        <form className='form' onSubmit={submitHandler}>
            <div>
                <h1>Metoda de Plata</h1>
            </div>
            <div>
                <div>
                    <input type="radio" id="paypal" value="PayPal" name="paymentMethod" required onChange={(e)=>setPaymentMethod(e.target.value)}></input>
                    <label htmlFor='paypal'>PayPal</label>
                </div>
            </div>
            <div>
                <div>
                    <input type="radio" id="stripe" value="Stripe" name="paymentMethod" required onChange={(e)=>setPaymentMethod(e.target.value)}></input>
                    <label htmlFor='stripe'>Stripe</label>
                </div>
            </div>
            <div>
                <div>
                    <input type="radio" id="amazon" value="Amazon Pay" name="paymentMethod" required onChange={(e)=>setPaymentMethod(e.target.value)}></input>
                    <label htmlFor='amazon'>Amazon Pay</label>
                </div>
            </div>
            <div>
                <div>
                    <input type="radio" id="gift" value="Gift Card" name="paymentMethod" required onChange={(e)=>setPaymentMethod(e.target.value)}></input>
                    <label htmlFor='gift'>Gift Card</label>
                </div>
            </div>
            <div>
                <button className='primary' type="submit">Continua</button>
            </div>
        </form>
    </div>
   )

 }