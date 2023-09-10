import React, { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux';
import Rating from '../components/Rating'
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { createReview, detailsProduct } from '../actions/productActions';
import { PRODUCT_REVIEW_CREATE_RESET } from '../constants/productConstants';

export default function ProductScreen(props){
  const { id } = useParams();
  const productId = id;
  const navigate = useNavigate();
  const[qty,setQty] = useState(1);
  const dispatch = useDispatch();
  const productDetails = useSelector(state => state.productDetails);
  const {loading, error, product} = productDetails;
  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;

  const productReviewCreate = useSelector(state => state.productReviewCreate);
  const { loading: loadingReviewCreate, error: errorReviewCreate, success: successReviewCreate } = productReviewCreate;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(()=>{
    if(successReviewCreate){
      window.alert('Recenzie trimisa!');
      setRating(0);
      setComment('');
      dispatch({type: PRODUCT_REVIEW_CREATE_RESET});
    }
    dispatch(detailsProduct(productId));
  },[dispatch, productId, successReviewCreate]);

  const addToCartHandler = () =>{
    // props.history.push(`/cart/${productId}?qty=${qty}`);
    navigate(`/cart/${productId}?qty=${qty}`);
  };

  const submitHandler = (e) =>{
    e.preventDefault();
    if(comment && rating){
      dispatch(createReview(productId, {rating, comment, name: userInfo.name}));
    }else{
      alert('Introdu comentariu si rating!');
    }
  }

  return(
    <div>
      {loading? (<LoadingBox></LoadingBox>)
      :
      error?(<MessageBox variant="danger">{error}</MessageBox>)
      :
      (<div className='back'>
        <Link to="/">Inapoi la rezultate</Link>
          <div className="row top">
            <div className='col-2'>
              <img className="large" src={product.image} alt={product.name}></img>
            </div>
            <div className="col-1">
              <ul>
                <li>
                  <h1>{product.name}</h1>
                </li>
                <li>
                  <Rating rating={product.rating} numReviews={product.numReviews}></Rating>
                </li>
                <li>
                  Pret: {product.price} Lei
                </li>
                <li>Descriere:
                    <p>{product.description}</p>
                  </li>
              </ul>
            </div>
            <div className="col-1">
              <div className="card card-body">
                <ul>
                  <li>
                    <div className='row'>
                      <div>Pret</div>
                      <div className="price">{product.price} Lei</div>
                    </div>
                  </li>
                  <li>
                    <div className='row'>
                      <div>Status</div>
                      <div>
                        {product.countInStock>0? (<span className="success">In Stoc</span>):
                        (<span className="danger">Lipsa Stoc</span>)}
                      </div>
                    </div>
                  </li>
                  {
                    product.countInStock >0 && (
                      <>
                        <li>
                          <div className='row'>
                            <div>Cantitate</div>
                            <div>
                              <select value={qty} onChange={e=>setQty(e.target.value)}>
                              {
                                [...Array(product.countInStock).keys()].map(x=>(
                                  <option key={x+1} value={x+1}>{x+1}</option>
                                ))
                              }
                              </select>
                            </div>
                          </div>
                        </li>
                        <li>
                          <button onClick={addToCartHandler} className="primary block">Adauga in Cos</button>
                        </li>
                      </>
                    )
                  }
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h2 id='reviews'>Recenzii</h2>
            {product.reviews.length === 0 && (<MessageBox>Nu exista nicio recenzie.</MessageBox>)}
            <ul>
              {product.reviews.map((review)=>(
                <li key={review._id}>
                  <strong>{review.name}</strong>
                  <Rating rating={review.rating} caption=" "></Rating>
                  <p>
                    {review.createdAt.substring(0, 10)}
                  </p>
                  <p>
                    {review.comment}
                  </p>
                </li>
              ))}
              <li>
                {userInfo ? (
                  <form className='form' onSubmit={submitHandler}>
                    <div>
                      <h2>Scrie o recenzie</h2>
                    </div>
                    <div>
                      <label htmlFor='rating'>Rating</label>
                      <select id='rating' value={rating} onChange={(e) => setRating(e.target.value)}>
                        <option value=''>Selecteaza...</option>
                        <option value='1'>1 - Foarte slab</option>
                        <option value='2'>2 - Slab</option>
                        <option value='3'>3 - Bun</option>
                        <option value='4'>4 - Foarte bun</option>
                        <option value='5'>5 - Excelent</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor='comment'>Comentariu</label>
                      <textarea id='comment' value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                    </div>
                    <div>
                      <label></label>
                      <button className='primary' type='submit'>Trimite</button>
                    </div>
                    <div>
                    {
                        loadingReviewCreate && <LoadingBox></LoadingBox>
                    }
                    {
                        errorReviewCreate && <MessageBox variant="danger">{errorReviewCreate}</MessageBox>
                    }
                    </div>
                  </form>
                ):(
                  <MessageBox><Link to="/signin">Conecteaza-te</Link> pentru a scrie o recenzie!</MessageBox>
                )}
              </li>
            </ul>
          </div>
      </div>)
      }
    </div>
   )

 }