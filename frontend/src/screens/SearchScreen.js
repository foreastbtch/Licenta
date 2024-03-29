import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { listProducts } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Product from '../components/Product';
import Rating from '../components/Rating';
import { prices, ratings } from '../utils';

export default function SearchScreen() {
    const navigate = useNavigate();
    const {name = 'all', category='all', min=0, max=0, rating=0, order='newest'} = useParams();
    const dispatch = useDispatch();
    const productList = useSelector(state => state.productList);
    const { loading, error, products } = productList;
    const productCategoryList = useSelector(state => state.productCategoryList);
    const { loading: loadingCategories, error: errorCategories, categories } = productCategoryList;
    useEffect(()=>{
        dispatch(listProducts({
            name: name !== 'all' ? name : '', 
            category: category !== 'all' ? category : '',
            min,
            max,
            rating,
            order
        }));
    },[dispatch, name, category, min, max, rating, order]);
    const getFilterUrl = (filter) =>{
        const filterCategory = filter.category || category;
        const filterName = filter.name || name;
        const filterRating = filter.rating || rating;
        const sortOrder = filter.order || order;
        const filterMin = filter.min ? filter.min : filter.min === 0 ? 0 : min;
        const filterMax = filter.max ? filter.max : filter.max === 0 ? 0 : max;
        return `/search/category/${filterCategory}/name/${filterName}/min/${filterMin}/max/${filterMax}/rating/${filterRating}/order/${sortOrder}`;
    };
    return(
        <div>
            <div className='row' style={{"marginTop": "1.5rem"}}>
                {
                    loading? <LoadingBox></LoadingBox>
                    :
                    error? <MessageBox variant="danger">{error}</MessageBox>
                    :
                    <div>
                        {products.length} rezultate
                    </div>
                }
                <div>
                    Sortare dupa {' '}
                    <select value={order} onChange={(e)=>navigate(getFilterUrl({order: e.target.value}))}>
                        <option value="newest">Cele mai noi</option>
                        <option value="lowest">Pret: Low to High</option>
                        <option value="highest">Pret: High to Low</option>
                        <option value="toprated">Dupa recenzii</option>
                    </select>
                </div>
            </div>
            <div className='row top'>
                <div className='col-1'>
                    <h3>Departament</h3>
                    <div>
                    {
                    loadingCategories? <LoadingBox></LoadingBox>
                    :
                    errorCategories? <MessageBox variant="danger">{errorCategories}</MessageBox>
                    :
                    <ul>
                        <li>
                            <Link
                                className={'all' === category? 'active' : ''}
                                to={getFilterUrl({category: 'all'})}>
                                Any
                            </Link>
                        </li>
                        {categories.map((c)=>(
                            <li key={c}>
                                <Link
                                    className={c === category? 'active' : ''}
                                    to={getFilterUrl({category: c})}>{c}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    }
                    </div>
                    <div>
                        <h3>Pret</h3>
                        <ul>
                            {prices.map((p)=>(
                                <li key={p.name}>
                                    <Link to={getFilterUrl({min: p.min, max: p.max})} 
                                    className={`${p.min}-${p.max}` === `${min}-${max}`?'active':''}>
                                        {p.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3>Recenzii</h3>
                        <ul>
                            {ratings.map((r)=>(
                                <li key={r.name}>
                                    <Link to={getFilterUrl({rating: r.rating})} 
                                    className={`${r.rating}` === `${rating}`?'active':''}>
                                        <Rating caption={" & mai mult"} rating={r.rating}></Rating>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className='col-3'>
                {
                    loading? <LoadingBox></LoadingBox>
                    :
                    error? <MessageBox variant="danger">{error}</MessageBox>
                    :
                        (<>
                            {products.length === 0 && (<MessageBox>Niciun rezultat!</MessageBox>)}
                            <div className="row center">
                                {
                                    products.map(product => (
                                        <Product key={product._id} product={product}></Product>
                                    ))
                                }
                            </div>
                        </>)
                }
                </div>
            </div>
        </div>
    )

 }