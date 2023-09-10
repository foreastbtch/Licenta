/* global google */
import React, { useEffect, useRef, useState } from 'react';
import { LoadScript, GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import LoadingBox from '../components/LoadingBox';
import Axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { deliverOrder, listOrders } from '../actions/orderActions';
import MessageBox from '../components/MessageBox';


const defaultLocation = { lat: 44.44790843553962, lng: 26.098975396943366 };

export default function DeliveryScreen() {
    const [libs] = useState(['places']);
    const [googleApiKey, setGoogleApiKey] = useState('');
    const [center, setCenter] = useState(defaultLocation);
    const [location, setLocation] = useState(center);
    // const [directions, setDirections] = useState(null);
    const [confirmOrder, setConfirmOrder] = useState(0);
    const [orderId, setOrderId] = useState('');

    const dispatch = useDispatch();

    const confirmOrderHandler = (orderId) =>{
        if(window.confirm('Confirmati comanda?')){
            
            dispatch(deliverOrder(orderId));
            setConfirmOrder(confirmOrder + 1);
        }
    };

    const orderList = useSelector(state => state.orderList);
    const { loading, error, orders } = orderList;
    useEffect(() => {
        // dispatch(listOrders());
        // drawRoute(orders[0], orders[1]);
        // console.log(confirmOrder);
        const updateMarkers = async () =>{
            dispatch(listOrders());
        }
        updateMarkers();
    }, [dispatch, confirmOrder]);

    const mapRef = useRef(null);

    useEffect(() => {
        const fetch = async () => {
            const { data } = await Axios('/api/config/google');
            setGoogleApiKey(data);
            getUserCurrentLocation();
        }
        fetch();
    }, []);

    const onLoad = (map) => {
        mapRef.current = map;
    }

    const onIdle = () => {
        setLocation({ lat: mapRef.current.center.lat(), lng: mapRef.current.center.lng() })
    }

    const getUserCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation OS not supported by this browser!');
        } else {
            navigator.geolocation.getCurrentPosition((position) => {
                setCenter({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            });
        }
    }

    // const drawRoute = async (order1, order2) =>{
    //     const directionsService = new google.maps.DirectionsService()
    //     const result = await directionsService.route({
    //         origin: {lat: order1.shippingAddress.lat, lng: order1.shippingAddress.lng},
    //         destination: {lat: order2.shippingAddress.lat, lng: order2.shippingAddress.lng},
    //         travelMode: "DRIVING"
    //     });
    //     console.log(result);
    //     setDirections(result.routes);
    // }

    return googleApiKey ?
        (
            <div className='full-container'>
                <LoadScript libraries={libs} googleMapsApiKey={googleApiKey}>
                    <GoogleMap id="sample-map" mapContainerStyle={{ height: '80%', width: '100%' }}
                        center={center}
                        zoom={15}
                        onLoad={onLoad}
                        onIdle={onIdle}>
                        {loading ? (<LoadingBox></LoadingBox>)
                            :
                            error ? (<MessageBox variant="danger">{error}</MessageBox>)
                                :
                                (<div>
                                    {
                                        orders.map((order) => ( order.isDelivered === false ? (<Marker key={order.shippingAddress.lat} position={{ lat: order.shippingAddress.lat, lng: order.shippingAddress.lng }}></Marker>):undefined))
                                        
                                    }
                                    {/* <DirectionsRenderer directions = {directions}></DirectionsRenderer> */}
                                </div>)
                        }
                    </GoogleMap>
                </LoadScript>
                <form className='form-map'>
                    <div className='formfield'>
                        <label htmlFor='orderId' className='label'>Confirma Comanda</label>
                        <input type="text" id="orderId" placeholder='ID Comanda' required className='input' onChange={e=>setOrderId(e.target.value)}></input>
                    </div>
                    <button type="button" className='map-button' onClick={() => confirmOrderHandler(orderId)}>Confirmare livrare comanda</button>
                </form>
            </div>
        ) : <LoadingBox></LoadingBox>
}