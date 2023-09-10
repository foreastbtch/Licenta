import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { createProduct, deleteProduct, listProducts } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useNavigate } from 'react-router-dom';
import { PRODUCT_CREATE_RESET, PRODUCT_DELETE_RESET } from '../constants/productConstants';

export default function ProductListScreen() {
    const productList = useSelector(state => state.productList);
    const { loading, error, products } = productList;
    const productCreate = useSelector(state => state.productCreate);
    const { loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct } = productCreate;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const productDelete = useSelector(state => state.productDelete);
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDelete;
    useEffect(()=>{
        if(successCreate) {
            dispatch({type: PRODUCT_CREATE_RESET});
            navigate(`/product/${createdProduct._id}/edit`);
        }
        if(successDelete) {
            dispatch({type:PRODUCT_DELETE_RESET});
        }
        dispatch(listProducts({}));
    },[dispatch, createdProduct, navigate, successCreate, successDelete]);
    
    const deleteHandler = (product) =>{
        if(window.confirm('Sunteti sigur ca stergeti produsul?')){
            dispatch(deleteProduct(product._id));
        }
    };
    const createHandler = () =>{
        dispatch(createProduct());
    };
  return(
    <div>
        <div className='row'>
            <h1>Produse</h1>
            <button type="button" className='primary' onClick={createHandler}>Adauga produs</button>
        </div>

        {loadingDelete && <LoadingBox></LoadingBox>}
        {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
        
        {loadingCreate && <LoadingBox></LoadingBox>}
        {errorCreate && <MessageBox variant="danger">{errorCreate}</MessageBox>}
        {
            loading? <LoadingBox></LoadingBox>
            :
            error? <MessageBox variant="danger">{error}</MessageBox>
            :
            <table className='table'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Denumire</th>
                        <th>Pret</th>
                        <th>Categorie</th>
                        <th>Actiuni</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        products.map((product) => (
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.category}</td>
                                <td>
                                    <button type='button' className='small' onClick={() => navigate(`/product/${product._id}/edit`)}>Editare</button>
                                    <button type='button' className='small' onClick={() => deleteHandler(product)}>Stergere</button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        }
    </div>
   )

 }