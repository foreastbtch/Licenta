import React, { useEffect, useRef, useState } from 'react';
import { LoadScript, GoogleMap, StandaloneSearchBox, Marker } from '@react-google-maps/api';
import LoadingBox from '../components/LoadingBox';
import Axios from 'axios';
import { USER_ADDRESS_MAP_CONFIRM } from '../constants/userConstants';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const libs = ['places'];
const defaultLocation = { lat: 44.44790843553962, lng: 26.098975396943366 };

export default function MapScreen() {
    const [googleApiKey, setGoogleApiKey] = useState('');
    const [center, setCenter] = useState(defaultLocation);
    const [location, setLocation] = useState(center);
    const navigate = useNavigate();

    const mapRef = useRef(null);
    const placeRef = useRef(null);
    const markerRef = useRef(null);

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

    const onMarkerLoad = (marker) => {
        markerRef.current = marker;
    }

    const onLoadPlaces = (place) => {
        placeRef.current = place;
    }

    const onIdle = () => {
        setLocation({ lat: mapRef.current.center.lat(), lng: mapRef.current.center.lng() })
    }

    const onPlacesChanged = () => {
        const place = placeRef.current.getPlaces()[0].geometry.location;
        setCenter({ lat: place.lat(), lng: place.lng() });
        setLocation({ lat: place.lat(), lng: place.lng() });
    }

    const dispatch = useDispatch();
    const onConfirm = () => {
        const places = placeRef.current.getPlaces();
        if (places && places.length === 1) {
            dispatch({
                type: USER_ADDRESS_MAP_CONFIRM,
                payload: {
                    lat: location.lat,
                    lng: location.lng,
                    address: places[0].formatted_address,
                    name: places[0].name,
                    vicinity: places[0].vicinity,
                    googleAddressId: places[0].id,
                },
            });
            alert('Locatie selectata cu succes!');
            navigate('/shipping');
        } else {
            alert("Introduceti adresa!");
        }
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

    return googleApiKey ? (
        <div className='full-container'>
            <LoadScript libraries={libs} googleMapsApiKey={googleApiKey}>
                <GoogleMap id="sample-map" mapContainerStyle={{ height: '100%', width: '100%' }}
                    center={center}
                    zoom={15}
                    onLoad={onLoad}
                    onIdle={onIdle}>
                    <StandaloneSearchBox onLoad={onLoadPlaces} onPlacesChanged={onPlacesChanged}>
                        <div className='map-input-box'>
                            <input type="text" placeholder='Introduceti adresa..'></input>
                            <button type="button" className='primary' onClick={onConfirm}>Confirma</button>
                        </div>
                    </StandaloneSearchBox>
                    <Marker position={location} onLoad={onMarkerLoad}></Marker>
                </GoogleMap>
            </LoadScript>
        </div>
    ) : <LoadingBox></LoadingBox>
}