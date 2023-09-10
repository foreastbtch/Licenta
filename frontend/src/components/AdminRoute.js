import { Navigate } from 'react-router-dom';
import React from 'react'
import { useSelector } from 'react-redux'

// export default function AdminRoute({component: Component, ...rest}) {
//     const userSignin = useSelector(state => state.userSignin);
//     const { userInfo } = userSignin;
//   return(
//     <Route {...rest} render={(props) => userInfo && userInfo.isAdmin ? (<Component {...props}></Component>) : (
//         <Navigate to="/signin"/>
//     )}>
//     </Route>
//    )

//  }

const AdminRoute = ({ children }) =>{
    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;
    return userInfo && userInfo.isAdmin ? children : <Navigate to="/signin" />;
};

export default AdminRoute;