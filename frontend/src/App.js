// import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {BrowserRouter, Link, Route, Routes} from 'react-router-dom';
import { signout } from './actions/userActions';
import CartScreen from './screens/CartScreen';
import HomeScreen from './screens/HomeScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import ProductScreen from './screens/ProductScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignInScreen from './screens/SigninScreen';

function App() {

  const cart = useSelector(state => state.cart);
  const {cartItems} = cart;
  const userSignin = useSelector(state =>state.userSignin);
  const {userInfo} = userSignin;

  const dispatch = useDispatch();
  const signoutHandler = () => {
    dispatch(signout());
  }
//   useEffect(() => {
//     document.title = "eBuy";
//  }, []);

  const tmpImage = "/images/logo.png";

  return (
    <BrowserRouter>
    <div className="grid-container">
      <header className="row">
        <div>
          <Link to="/"><img className='logo' src={tmpImage} alt="logo"></img></Link>
          {/* <Link className="brand" to="/">eBuy</Link> */}
        </div>
        <div>
          <Link to="/cart">Cos de cumparaturi
          {cartItems.length >0 && userInfo &&(
          <span className='badge'>{cartItems.length}</span>
          )}
          </Link>
          {
            userInfo ? (
              <div className='dropdown'>
                <Link to="#">{userInfo.name} <i className='fa fa-caret-down'></i></Link>
                <ul className='dropdown-content'>
                  <Link to="#signout" onClick={signoutHandler}>Sign out</Link>
                </ul>
              </div>
            ) : (
              <Link to="/signin">Sign In</Link>
            )
          }
        </div>
      </header>
      <main>
      <Routes>
        <Route path="/cart/" element={<CartScreen/>}></Route>
        <Route path="/cart/:id" element={<CartScreen/>}></Route>
        <Route path="/product/:id" element={<ProductScreen/>}></Route>
        <Route path="/signin" element={<SignInScreen/>}></Route>
        <Route path="/register" element={<RegisterScreen/>}></Route>
        <Route path="/shipping" element={<ShippingAddressScreen/>}></Route>
        <Route path="/payment" element={<PaymentMethodScreen/>}></Route>
        <Route path="placeorder" element={<PlaceOrderScreen/>}></Route>
        <Route path="/" element={<HomeScreen/>} exact></Route>
      </Routes>
      </main>
      <footer className="row center">
        All rights reserved.
      </footer>
    </div>
    </BrowserRouter>
  );
}

export default App;
