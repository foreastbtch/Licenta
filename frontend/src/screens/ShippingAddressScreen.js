import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';

export default function ShippingAddressScreen(props) {
    const navigate=useNavigate();
    const userSignin = useSelector(state =>state.userSignin);
    const {userInfo} = userSignin;
    const cart = useSelector(state => state.cart);
    const {shippingAddress} = cart;
    
    useEffect(()=>{
        if(!userInfo){
            navigate('/signin');
        }
    },[navigate, userInfo]);

    const [fullname, setFullname] = useState(shippingAddress.fullname || '');
    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [country, setCountry] = useState(shippingAddress.country || '');
    const dispatch = useDispatch();
    const submitHandler = (e)=>{
        e.preventDefault();
        dispatch(saveShippingAddress({fullname, address, city, postalCode, country}));
        navigate('/payment');
    }
  return(
    <div>
        <CheckoutSteps step1 step2></CheckoutSteps>
        <form className='form' onSubmit={submitHandler}>
                <div>
                    <h1>Adresa de livrare</h1>
                </div>
                <div>
                    <label htmlFor='fullname'>Nume</label>
                    <input type="text" id="fullname" placeholder='Introduceti numele' value={fullname} onChange={(e)=> setFullname(e.target.value)} required></input>

                </div>
                <div>
                    <label htmlFor='address'>Adresa</label>
                    <input type="text" id="address" placeholder='Introduceti adresa' value={address} onChange={(e)=> setAddress(e.target.value)} required></input>

                </div>
                <div>
                    <label htmlFor='city'>Oras</label>
                    <input type="text" id="city" placeholder='Introduceti orasul' value={city} onChange={(e)=> setCity(e.target.value)} required></input>

                </div>
                <div>
                    <label htmlFor='postalcode'>Cod Postal</label>
                    <input type="text" id="postalcode" placeholder='Introduceti codul postal' value={postalCode} onChange={(e)=> setPostalCode(e.target.value)} required></input>

                </div>
                <div>
                    <label htmlFor='country'>Tara</label>
                    <input type="text" id="country" placeholder='Introduceti tara' value={country} onChange={(e)=> setCountry(e.target.value)} required></input>

                </div>
            <div>
                <label></label>
                <button className='primary' type="submit">Continua</button>
            </div>
        </form>
    </div>
   )

 }