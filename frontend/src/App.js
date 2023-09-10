import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { signout } from './actions/userActions';
import CartScreen from './screens/CartScreen';
import HomeScreen from './screens/HomeScreen';
import OrderScreen from './screens/OrderScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import ProductScreen from './screens/ProductScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignInScreen from './screens/SigninScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import { useEffect, useState } from 'react';
import { listProductCategories } from './actions/productActions';
import LoadingBox from './components/LoadingBox';
import MessageBox from './components/MessageBox';
import MapScreen from './screens/MapScreen';
import DeliveryScreen from './screens/DeliveryScreen';

function App() {

  const cart = useSelector(state => state.cart);
  const { cartItems } = cart;
  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  const dispatch = useDispatch();
  const signoutHandler = () => {
    dispatch(signout());
  }
  const productCategoryList = useSelector(state => state.productCategoryList);
  const { loading: loadingCategories, error: errorCategories, categories } = productCategoryList;
  useEffect(() => {
    // document.title = "eBuy";
    dispatch(listProductCategories());
  }, [dispatch]);

  // const tmpImage = "/images/logo.png";

  return (
    <BrowserRouter>
      <div className="grid-container">
        <header className="row">
          <div>
            <button type="button" className='open-sidebar' onClick={() => setSidebarIsOpen(true)}>
              <i className='fa fa-bars'></i>
            </button>
            {/* <Link to="/"><img className='logo' src={tmpImage} alt="logo"></img></Link> */}
            <Link className="brand" to="/">eBuy</Link>
          </div>
          <div>
            <SearchBox></SearchBox>
          </div>
          <div>
            <Link to="/cart">Cos de cumparaturi
              {cartItems.length > 0 && userInfo && (
                <span className='badge'>{cartItems.length}</span>
              )}
            </Link>
            {
              userInfo ? (
                <div className='dropdown'>
                  <Link to="#">{userInfo.name} <i className='fa fa-caret-down'></i></Link>
                  <ul className='dropdown-content'>
                    <li>
                      <Link to="/profile">Profilul meu</Link>
                    </li>
                    <li>
                      <Link to="/orderhistory">Comenzile mele</Link>
                    </li>
                    <li>
                      <Link to="#signout" onClick={signoutHandler}>Sign out</Link>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link to="/signin">Sign In</Link>
              )
            }
            {
              userInfo && userInfo.isAdmin && (
                <div className='dropdown'>
                  <Link to="#admin">Admin {' '}<i className='fa fa-caret-down'></i></Link>
                  <ul className='dropdown-content'>
                    <li>
                      <Link to="/dashboard">Dashboard</Link>
                    </li>
                    <li>
                      <Link to="/productlist">Produse</Link>
                    </li>
                    <li>
                      <Link to="/orderlist">Comenzi</Link>
                    </li>
                    <li>
                      <Link to="/userlist">Utilizatori</Link>
                    </li>
                  </ul>
                </div>
              )
            }
          </div>
        </header>
        <aside className={sidebarIsOpen ? 'open' : ''}>
          <ul className='categories'>
            <li>
              <strong>Categorii</strong>
              <button onClick={() => setSidebarIsOpen(false)} className="close-sidebar" type="button">
                <i className='fa fa-close'></i>
              </button>
            </li>
            {
              loadingCategories ? <LoadingBox></LoadingBox>
                :
                errorCategories ? <MessageBox variant="danger">{errorCategories}</MessageBox>
                  :
                  categories.map((c) => (
                    <li key={c}>
                      <Link to={`/search/category/${c}`} onClick={() => setSidebarIsOpen(false)}>{c}</Link>
                    </li>
                  ))
            }
          </ul>
        </aside>
        <main>
          <Routes>
            <Route path="/cart/" element={<CartScreen />}></Route>
            <Route path="/cart/:id" element={<CartScreen />}></Route>
            <Route path="/product/:id" element={<ProductScreen />} exact></Route>
            <Route path="/product/:id/edit" element={<ProductEditScreen />} exact></Route>
            <Route path="/signin" element={<SignInScreen />}></Route>
            <Route path="/register" element={<RegisterScreen />}></Route>
            <Route path="/shipping" element={<ShippingAddressScreen />}></Route>
            <Route path="/payment" element={<PaymentMethodScreen />}></Route>
            <Route path="placeorder" element={<PlaceOrderScreen />}></Route>
            <Route path="/order/:id" element={<OrderScreen />}></Route>
            <Route path="/orderhistory" element={<OrderHistoryScreen />}></Route>
            <Route path="/search/name/" element={<SearchScreen />} exact></Route>
            <Route path="/search/name/:name" element={<SearchScreen />} exact></Route>
            <Route path="/search/category/:category" element={<SearchScreen />} exact></Route>
            <Route path="/search/category/:category/name/:name" element={<SearchScreen />} exact></Route>
            <Route path="/search/category/:category/name/:name/min/:min/max/:max/rating/:rating/order/:order" element={<SearchScreen />} exact></Route>
            <Route path="/profile" element={<PrivateRoute><ProfileScreen /></PrivateRoute>}></Route>
            <Route path="/productlist" element={<AdminRoute><ProductListScreen /></AdminRoute>}></Route>
            <Route path="/orderlist" element={<AdminRoute><OrderListScreen /></AdminRoute>}></Route>
            <Route path="/userlist" element={<AdminRoute><UserListScreen /></AdminRoute>}></Route>
            <Route path="/user/:id/edit" element={<AdminRoute><UserEditScreen /></AdminRoute>}></Route>
            <Route path="/" element={<HomeScreen />} exact></Route>
            <Route path="/map" element={<PrivateRoute><MapScreen /></PrivateRoute>}></Route>
            <Route path="/dashboard" element={<AdminRoute><DeliveryScreen /></AdminRoute>}></Route>
          </Routes>
        </main>
        <footer className="row center">
          Toate drepturile rezervate(c).
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
