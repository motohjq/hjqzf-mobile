import React from "react"

//导入路由
import {BrowserRouter as Router,Route, Redirect} from 'react-router-dom'

//导入要使用的组件
// import {Button} from 'antd-mobile'

//导入首页和城市选择两个组件
import Home from './pages/Home'
import CityList from './pages/CityList'
import MyMap from "./pages/MyMap"
import HouseDetail from "./pages/Housedetail"
//登录
import Login from './pages/Login'
import Registe from './pages/Registe'

//房源发布
import Rent from "./pages/Rent"
import RentAdd from './pages/Rent/Add'
import RentSearch from './pages/Rent/Search'

//路由访问控制组件
import AuthRoute from "./components/AuthRoute"

function App() {
  return (
    <Router>
      <div className="App">
        {/* 配置默认路由 */}
      <Route path="/" exact render={()=><Redirect to='/home'/>}/>

      {/* 配置路由 */}
      <Route path="/home" component={Home}/>
      <Route path="/citylist" component={CityList}/>
      <Route path="/map" component={MyMap}/>
      <Route path='/detail/:id' component={HouseDetail}/>
      <Route path='/login' component={Login}/>
      <Route path='/registe' component={Registe}/>
      {/* 配置登录后才能访问的页面 */}
      <AuthRoute exact path='/rent' component={Rent}/>
      <AuthRoute path='/rent/add' component={RentAdd}/>
      <AuthRoute path='/rent/search' component={RentSearch}/>
    </div>
    </Router>
  );
}

export default App;
