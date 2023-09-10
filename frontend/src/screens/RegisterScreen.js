import React, { useEffect, useState } from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {register} from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function RegisterScreen(props) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const {search} = useLocation();
    const navigate = useNavigate();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';
    const userRegister = useSelector(state =>state.userRegister);
    const {userInfo, loading, error} = userRegister;
    
    const dispatch = useDispatch();
    const submitHandler = (e)=>{
        e.preventDefault();
        if(password !== confirmPassword){
            alert('Parolele nu se potrivesc!');
        }else{
            dispatch(register(name, email, password));
        }
    };
    useEffect(()=>{
        if(userInfo){
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);
  return(
    <div>
        <form className='form' onSubmit={submitHandler}>
            <div>
                <h1>Creeaza un cont</h1>
            </div>
            {loading && <LoadingBox></LoadingBox>}
            {error && <MessageBox variant="danger">{error}</MessageBox>}
            <div>
                <label htmlFor='name'>Name</label>
                <input type="text" id="name" placeholder='Enter name' required onChange={e=>setName(e.target.value)}></input>
            </div>
            <div>
                <label htmlFor='email'>Email address</label>
                <input type="email" id="email" placeholder='Enter email' required onChange={e=>setEmail(e.target.value)}></input>
            </div>
            <div>
                <label htmlFor='password'>Password</label>
                <input type="password" id="password" placeholder='Enter password' required onChange={e=>setPassword(e.target.value)}></input>
            </div>
            <div>
                <label htmlFor='confirmPassword'>Confirm Password</label>
                <input type="password" id="confirmPassword" placeholder='Confirm Password' required onChange={e=>setConfirmPassword(e.target.value)}></input>
            </div>
            <div>
                <label></label>
                <button className='primary' type="submit">Register</button>
            </div>
            <div>
                <label></label>
                <div>
                    Aveti deja un cont? {' '}
                    <Link to={`/signin?redirect=${redirect}`}>Sign In</Link>
                </div>
            </div>
        </form>
    </div>
   )

 }