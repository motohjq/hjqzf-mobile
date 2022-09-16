import React from "react";

/**
 * 嵌套路由：
 * 1.在pages文件夹中创建News/index.js组件
 * 2.在Home组件中，添加一个Route作为子路由的出口
 * 3.设置嵌套路由的path
 */

//导入路由
import {Route} from 'react-router-dom'

//导入News组件
import News  from "../News";
import Index  from "../Index";
import Profile  from "../Profile";
import HouseList  from "../HouseList";

//导入组件
import { TabBar } from 'antd-mobile'

//导入组件自己的样式文件
import './index.css'

//TabBar.Item 数据
const tabItems=[
    {
        title:'首页',
        icon:'icon-ind',
        path:'/home'
    },
    {
        title:'找房',
        icon:'icon-findHouse',
        path:'/home/list'
    },
    {
        title:'资讯',
        icon:'icon-infom',
        path:'/home/news'
    },
    {
        title:'我的',
        icon:'icon-my',
        path:'/home/profile'
    },
]

export default class Home extends React.Component{
    //状态代码
    state={
        selectedTab:this.props.location.pathname,
    };

    //当Home组件的内容发生更新时候调用
    componentDidUpdate(prevProps){
        // console.log(666);
        // console.log('上一次路由信息',prevProps);
        // console.log('当前路由信息',this.props);
        if(prevProps.location.pathname!==this.props.location.pathname){
            this.setState({
                selectedTab:this.props.location.pathname
            })
        }
    }

    //渲染TabBar.Item
    renderTabBarItem(){
        return tabItems.map((item)=>(
            <TabBar.Item
            title={item.title}
            key={item.title}
            icon={
                <i className={`iconfont ${item.icon}`}></i>
            }
            selectedIcon={
            <i className={`iconfont ${item.icon}`}></i>
            }
            selected={this.state.selectedTab === item.path}
            onPress={() => {
              this.setState({
                selectedTab: item.path,
              });
              //路由切换
            this.props.history.push(item.path)
            }}
          >
          </TabBar.Item>
        ))
    }

    render(){
        // console.log(this.props.location.pathname);
        return <div className="home">
            {/* 渲染子路由 */}
            <Route path='/home' exact component={Index}/>
            <Route path='/home/list' component={HouseList}/>
            <Route path='/home/news' component={News}/>
            <Route path='/home/profile' component={Profile}/>

        <TabBar
          tintColor="#21b97a"
          barTintColor="white"
          noRenderContent={true}
        >
            {this.renderTabBarItem()}
        </TabBar>
      </div>
    }
}