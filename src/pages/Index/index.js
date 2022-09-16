import React from "react";
// import axios from 'axios'
import {API} from '../../utils/api'

import {BASE_URL} from '../../utils/url'

//导入组件
import { Carousel,Flex,Grid,WingBlank } from 'antd-mobile';

import {getCurrentCity} from '../../utils'

import  './index.css'
// import  './index.scss'

//导入图片
import Nav1 from '../../assets/images/nav-1.png';
import Nav2 from '../../assets/images/nav-2.png';
import Nav3 from '../../assets/images/nav-3.png';
import Nav4 from '../../assets/images/nav-4.png';
import SearchHeader from "../../components/SearchHeader";

//导航菜单的数据
const navs=[
    {
        id:0,
        img:Nav1,
        title:'整租',
        path:'/home/list'
    },
    {
        id:1,
        img:Nav2,
        title:'合租',
        path:'/home/list'
    },{
        id:2,
        img:Nav3,
        title:'地图找房',
        path:'/map'
    },{
        id:3,
        img:Nav4,
        title:'去出租',
        path:'/rent/add'
    },
]

//获取地理位置信息
navigator.geolocation.getCurrentPosition(position=>{
    console.log('当前位置信息',position);
    // do_something(position.coords.latitude,position.coords.longitude)
})

Array.from(new Array(4)).map((_val, i) => ({
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
    text: `name${i}`,
  }));

export default class Index extends React.Component{
    state = {
        //轮播图状态
        swipers:[],
        isSwiperLoaded:false,

        //租房小组的状态
        groups:[],
        //最新资讯的数据
        news:[],
        //当前城市名称
        curCityName:''
      }

    //获取轮播图数据的方法
    async getSwipers(){
        //请求数据
        const res=await API.get('/home/swiper')
        console.log(res);
        this.setState({
            swipers : res.data.body,
            isSwiperLoaded:true
        })
        
    }

    //获取租房小组的数据
    async getGroups(){
        const res=await API.get('/home/groups',{
            params:{
                area:'AREA|88cff55c-aaa4-e2e0'
            }
        })
        console.log(res);
        this.setState({
            groups:res.data.body
        })
    }

    //获取最新资讯数据的方法
    async getNews(){
        const res=await API.get(
            '/home/news?area=AREA%7C88cff55c-aaa4-e2e0'
        )
        console.log(res);
        this.setState({
            news:res.data.body
        })
    }

    async componentDidMount() {
        //调用请求轮播图的方法
        this.getSwipers()
        //调用请求租房小组的方法
        this.getGroups()
        //调用请求最新资讯的方法
        this.getNews()
        //通过IP定位获取到当前城市名称
        const curCity=await getCurrentCity()
        this.setState({
             curCityName:curCity.label
        })
    }
    
    //渲染轮播图
    renderSwipers(){
        return this.state.swipers.map(item=>(
            <a
                key={item.id}
                href="http://www.alipay.com"
                style={{ 
                display: 'inline-block', 
                width: '100%', 
                height: 212
               }}
              >
                <img
                  src={`http://localhost:4000${item.imgSrc}`}
                  alt=""
                  style={{ width: '100%', verticalAlign: 'top' }}
                />
              </a>
        ))
    }

    //渲染导航菜单
    renderNavs(){
        return navs.map(item=>{
            return (
                <Flex.Item
                key={item.id}
                onClick={()=>{
                    // console.log(item.path);
                    this.props.history.push(item.path)
                }}
                >
                <img src={item.img} alt=""/>
                <h2>{item.title}</h2>
            </Flex.Item>
            )
        })
    }

    //租房小组自定义布局的方法
    renderGroups(item){
        return <Flex className="group-item" justify="around" key={item.id}>
        <div className="desc">
            <p className="title">{item.title}</p>
            <span className="info">{item.desc}</span>
        </div>
        <img src={BASE_URL+item.imgSrc} alt=""/>
    </Flex>
    }

    //渲染最新资讯
    renderNews(){
        return this.state.news.map(item=>{
            return (
                <div className="news-item" key={item.key}>
                    <div className="imgWrap">
                        <img 
                        className="img"
                        src={`http://localhost:4000${item.imgSrc}`} 
                        alt=''/>
                    </div>
                    <Flex  className='content' direction="column" justify="between">
                        <h3 className="title">{item.title}</h3>
                        <Flex className="info" justify="between">
                            <span>{item.from}</span>
                            <span>{item.date}</span>
                        </Flex>
                    </Flex>
                </div>
                
            )
        })
    }

    render() {
        return (
            <div className="index">
                {/* 轮播图 */}
            <div className="swiper">
            {this.state.isSwiperLoaded?
            (<Carousel autoplay infinite autoplayInterval={5000}>
            {/* 调用轮播图的方法 */}
            {this.renderSwipers()}
          </Carousel>)
          :('')}
            {/* 搜索框 */}
            <SearchHeader cityName={this.state.curCityName}/>

            </div>
            {/* 导航菜单 */}
          <Flex className="nav">
            {/* 调用渲染导航菜单的方法 */}
           {this.renderNavs()}
          </Flex>
          {/* 租房小组 */}
          <div className="group">
            <h3 className="group-title">
                租房小组
                <span className="more">更多</span>
            </h3>

            {/* 宫格组件 */}
            <Grid 
            data={this.state.groups} 
            columnNum={2}
            square={false}
            hasLine={false}
            renderItem={(item)=>(
                this.renderGroups(item)
            )}
            />
          </div>
          {/* 最新资讯 */}
          <div className="news">
            <h3 className="group-title">最新资讯</h3>
                <WingBlank size="md">{this.renderNews()}</WingBlank>
            
          </div>
          </div>
            
        );
      }
}