import React from "react";
import { Route,Redirect } from "react-router-dom";
import { isAuth } from "../../utils/auth";

//<AuthRoute path='...' component={...}></AuthRoute>
const AuthRoute=({component:Component,...res})=>{
    return <Route 
    {...res}
    render={props=>{
        const isLogin=isAuth()
        if(isLogin){
            //已登录
            return <Component {...props}/>
        }else{
            //未登录
            return <Redirect 
            to={{
                pathname:'/login',
                state:{
                    from:props.location
                }
            }}/>
        }
    }}/>
}
export default AuthRoute