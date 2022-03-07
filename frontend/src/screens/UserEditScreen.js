import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { detailsUser, updateUser } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { USER_UPDATE_RESET } from '../constants/userConstants';

export default function UserEditScreen() {
    const { id } = useParams();
    const userId = id;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isSeller, setIsSeller] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const userDetails = useSelector(state => state.userDetails);
    const { loading, error, user } = userDetails;

    const userUpdate = useSelector(state => state.userUpdate);
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = userUpdate;

    const submitHandler = (e) =>{
        e.preventDefault();
        dispatch(updateUser({_id: userId, name, email, isSeller, isAdmin}));
    }
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(()=>{
        if(successUpdate){
            dispatch({type: USER_UPDATE_RESET});
            navigate('/userlist');
        }
        if(!user){
            dispatch(detailsUser(userId));
        }else{
            setName(user.name);
            setEmail(user.email);
            setIsSeller(user.isSeller);
            setIsAdmin(user.isAdmin);
        }
    },[dispatch, user, userId, navigate, successUpdate]);
    return(
        <div>
            <form className='form' onSubmit={submitHandler}>
                <div>
                    <h1>Editare {name}</h1>
                    {loadingUpdate && <LoadingBox></LoadingBox>}
                    {errorUpdate && <MessageBox variant="danger">{errorUpdate}</MessageBox>}
                </div>
                {   
                    loading? <LoadingBox></LoadingBox>
                    :
                    error? <MessageBox variant="danger">{error}</MessageBox>
                    :
                    <>
                    <div>
                        <label htmlFor='name'>Nume</label>
                        <input id="name" type="text" placeholder='Nume...' value={name} onChange={(e) => setName(e.target.value)}></input>
                    </div>
                    <div>
                        <label htmlFor='email'>Email</label>
                        <input id="email" type="text" placeholder='Email...' value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    </div>
                    <div>
                        <label htmlFor='isSeller'>Comerciant</label>
                        <input id="isSeller" type="checkbox" checked={isSeller} onChange={(e) => setIsSeller(e.target.checked)}></input>
                    </div>
                    <div>
                        <label htmlFor='isAdmin'>Administrator</label>
                        <input id="isAdmin" type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)}></input>
                    </div>
                    <div>
                        <button type='submit' className='primary'>
                            Actualizare
                        </button>
                    </div>
                    </>
                }
            </form>
        </div>
    )

 }