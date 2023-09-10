import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { addToCart, removeFromCart } from '../actions/cartActions';
import MessageBox from '../components/MessageBox';

export default function CartScreen(props) {
    const { id } = useParams();
    const productId = id;
    const {search} =useLocation();
    const qtyInUrl = new URLSearchParams(search).get('qty');
    const qty = qtyInUrl?Number(qtyInUrl):1;
    const cart = useSelector(state => state.cart);
    const {cartItems} = cart;
    const navigate=useNavigate();
    const userSignin = useSelector(state =>state.userSignin);
    const {userInfo} = userSignin;
    // const qty = props.location.search? Number(props.location.search.split('=')[1]):1;
    const dispatch = useDispatch();
    useEffect(()=>{
      if(productId){
          dispatch(addToCart(productId,qty));
      }
  },[dispatch, productId, qty]);
  useEffect(()=>{
    if(!userInfo){
        navigate('/signin?redirect=/cart');
    }
},[navigate, userInfo]);
  const removeFromCartHandler = (id)=>{
      // delete action
      dispatch(removeFromCart(id));
  };
  const checkoutHandler = () =>{
    //   props.history.push('/signin?redirect=shipping');
        navigate('/signin?redirect=/shipping');
  }
    return(
        <div className='row top'>
            <div className='col-2'>
                <h1>Cos de cumparaturi</h1>
                {cartItems.length === 0?<MessageBox>
                    Cosul este gol. <Link to="/">Go Shopping</Link>
                </MessageBox>
                :
                (
                    <ul>
                        {
                            cartItems.map((item)=>(
                                <li key={item.product}>
                                    <div className='row'>
                                        <div>
                                            <img src={item.image} alt={item.name} className="small"></img>
                                        </div>
                                    <div className='min-30'>
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </div>
                                    <div>
                                        <select value={item.qty} onChange={e=> dispatch(addToCart(item.product, Number(e.target.value)))}>
                                        {
                                            [...Array(item.countInStock).keys()].map(x=>(
                                            <option key={x+1} value={x+1}>{x+1}</option>
                                            ))
                                        }
                                        </select>
                                    </div>
                                    <div>
                                        {item.price} Lei
                                    </div>
                                    <div>
                                        <button type="button" onClick={()=>removeFromCartHandler(item.product)}>
                                            Sterge Produs
                                        </button>
                                    </div>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                )
                }
            </div>
            <div className="col-1">
                <div className="card card-body">
                    <ul>
                        <li>
                            <h2>
                                Subtotal ({cartItems.reduce((a, c)=> a + c.qty, 0)} produse) : {(cartItems.reduce((a,c) => a + c.price * c.qty, 0)).toFixed(2)} Lei
                            </h2>
                        </li>
                        <li>
                            <button type="button" onClick={checkoutHandler} className="primary block" disabled={cartItems.length === 0}>Continuati catre plata</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )

 }