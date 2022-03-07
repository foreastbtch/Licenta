import { Navigate } from 'react-router-dom';
import React from 'react'
import { useSelector } from 'react-redux'

// export default function PrivateRoute({component: Component, ...rest}) {
//     const userSignin = useSelector(state => state.userSignin);
//     const { userInfo } = userSignin;
//   return(
//     <Route {...rest} render={(props) => userInfo? (<Component {...props}></Component>) : (
//         <Navigate to="/signin"/>
//     )}>
//     </Route>
//    )

//  }

const PrivateRoute = ({ children }) =>{
    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;
    return userInfo ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;