// import axios from "axios";
import React from "react";
import {API} from '../../utils/api'

import {Link} from 'react-router-dom'
import {Toast} from 'antd-mobile'

//导入BASE_URL
import {BASE_URL} from '../../utils/url'

//导入百度地图组件
// import {Map,NavigationControl} from 'react-bmapgl';

//导入封装好的NavHeader组件
import NavHeader  from "../../components/NavHeader";

import './index.css'
//导入CSSModules的样式文件
import styles from './index.module.css'
import HouseItem from "../../components/HouseItem";

//解决脚手架中全局变量访问的问题
const BMap=window.BMap

//覆盖物样式
const labelStyle={
    cursor: 'pointer',
    border: '0px solid rgb(255, 0, 0)',
    padding: '0px',
    WhiteSpace: 'normal',
    fontSize: '12px',
    color: 'rgb(255, 255, 255)',
    textAlign: 'center',
}

export default class MyMap extends React.Component{
    state={
        houseList:[],
        //表示是否展示房源列表
        isShowList:false
    }

    componentDidMount(){
        this.initMap()
    }

    initMap(){
        //获取当前定位城市
        const {label,value}=JSON.parse(localStorage.getItem('hjqzf_city'))
        // console.log(label,value);
        //初始化地图实例
        //注意！在react脚手架中全局对象需要通过window来访问，否则会造成ESLint校验错误
        const map=new BMap.Map('container')
        //设置中心店坐标
        // const point = new BMap.Point(116.404, 39.915);

        //作用：能够在其他方法汇总通过this来获取地图对象
        this.map=map

        // 创建地址解析器实例     
        const myGeo = new BMap.Geocoder();      
        // 将地址解析结果显示在地图上，并调整地图视野    
        myGeo.getPoint(
            label, 
            async point=>{      
            if (point) {      
                //初始化地图实例
                map.centerAndZoom(point, 11);      
                // map.addOverlay(new BMap.Marker(point));  
                
                //添加控件
                map.addControl(new BMap.NavigationControl());    
                map.addControl(new BMap.ScaleControl());  

                //调用renderOverlays方法
                this.renderOverlays(value)

                // //获取房源数据
                // const res=await axios.get(`http://localhost:8080/area/map?id=${value}`)
                // console.log('房源数据',res);
                // res.data.body.forEach(item => {
                //     //为每一条数据创建覆盖物
                //     const {coord:{longitude,latitude},
                //     label:areaName,
                //     count,
                //     value} =item
                //     const areaPoint=new BMap.Point(longitude,latitude)
                //     const opts={
                //         position:areaPoint,
                //         offset:new BMap.Size(-35,-35)
                //     }
    
                //     //创建Label实例对象
                //     const label=new BMap.Label('',opts)

                //     //给label对象添加唯一标识
                //     label.id=value
                //     //设置房源覆盖物
                //     label.setContent(`
                //     <div class="${styles.bubble}">
                //         <p class="${styles.name}">${areaName}</p>
                //         <p>${count}套</p>
                //     </div>
                //     `)
                //     //设置样式                   
                //     label.setStyle(labelStyle)
                //     //添加单击事件
                //     label.addEventListener('click',()=>{
                //         // console.log('房源覆盖物被点击',label.id);
                //         //放大地图
                //         map.centerAndZoom(areaPoint,13)

                //         //解决清除覆盖物时，百度地图api的js文件自身报错问题
                //         setTimeout(()=>{
                //             map.clearOverlays()
                //         })
                //     })
                //     //添加覆盖物到地图中
                //     map.addOverlay(label)
                // });
                
            }  
        }, 
        label);

        //给地图绑定移动事件
        map.addEventListener('movestart',()=>{
            if(this.state.isShowList){
                this.setState({
                    isShowList:false
                })
            }
        })
    }

    //渲染覆盖物入口
    async renderOverlays(id){
        try {
        //开启loading
        Toast.loading('加载中...',0,null,false)
        const res=await API.get(`/area/map?id=${id}`)
        // console.log(res);
        //关闭loading
        Toast.hide()
        const data=res.data.body

        //调用getTypeAndZoom获取级别和类型
        const {nextZoom,type}= this.getTypeAndZoom()
        data.forEach(item=>{
            //创建覆盖物
            this.createOverlays(item,nextZoom,type)
        })
        } catch (e) {
        //关闭loading
        Toast.hide()
        }
    }

    //计算要绘制的覆盖物类型和下一个缩放级别
    getTypeAndZoom(){
        //调用地图的getZoom()方法，来获取当前缩放级别
        const zoom=this.map.getZoom()
        // console.log('当前地图的缩放级别',zoom);
        let nextZoom,type
        if (zoom>=10&&zoom<12) {
            //区
            nextZoom=13//下一个缩放级别
            type='circle'//绘制圆形覆盖物
        }else if (zoom>=12&&zoom<14) {
            //镇
            nextZoom=15
            type='circle'
        }else if (zoom>=14&&zoom<16) {
            //区
            type='rect'
        }
        return {
            nextZoom,
            type
        }
    }

    //创建覆盖物
    createOverlays(data,zoom,type){
        const {coord:{longitude,latitude},
            label:areaName,
            count,
            value} =data
        
        //创建坐标对象
        const areaPoint=new BMap.Point(longitude,latitude)
        if(type==='circle'){
            //区//镇
            this.createCircle(areaPoint,areaName,count,value,zoom)
        }else{
            //小区
            this.createRect(areaPoint,areaName,count,value)
        }
    }

    //创建区、镇覆盖物
    createCircle(point,name,count,id,zoom){
                const opts={
                    position:point,
                    offset:new BMap.Size(-35,-35)
                }        
                //创建Label实例对象
                    const label=new BMap.Label('',opts)

                    //给label对象添加唯一标识
                    label.id=id
                    //设置房源覆盖物
                    label.setContent(`
                    <div class="${styles.bubble}">
                        <p class="${styles.name}">${name}</p>
                        <p>${count}套</p>
                    </div>
                    `)
                    //设置样式                   
                    label.setStyle(labelStyle)
                    //添加单击事件
                    label.addEventListener('click',()=>{
                        //调用renderOverlays()方法，获取该区域下的房源数据
                        this.renderOverlays(id)
                        // console.log('房源覆盖物被点击',label.id);
                        //放大地图
                        this.map.centerAndZoom(point,zoom)

                        //解决清除覆盖物时，百度地图api的js文件自身报错问题
                        setTimeout(()=>{
                            this.map.clearOverlays()
                        })
                    })
                    //添加覆盖物到地图中
                    this.map.addOverlay(label)
                
    }

    //创建小区覆盖物
    createRect(point,name,count,id){
        //创建覆盖物
        const label=new BMap.Label('',{
            position:point,
            offset:new BMap.Size(-50,-28)
        })

        //给label对象添加唯一标识
        label.id=id

        //设置房源覆盖物
        label.setContent(`
        <div class='${styles.rect}'>
            <span class='${styles.housename}'>${name}</span>
            <span class='${styles.housenum}'>${count}套</span>
            <i class='${styles.arrow}'></i>
        </div>
        `)

        //设置样式
        label.setStyle(labelStyle)

        //添加单击事件
        label.addEventListener('click',(e)=>{
            this.getHouseList(id)
            // console.log('小区被点击了');
            const target=e.changedTouches[0]
            // console.log(target);
            this.map.panBy(
                window.innerWidth/2-target.clientX,
                (window.innerHeight-330)/2-target.clientY
            )
        })

        //添加覆盖物到地图
        this.map.addOverlay(label)
    }

    //获取小区房源数据
    async getHouseList(id){
        try {
        //开启loading
        Toast.loading('加载中...',0,null,false)        
        const res=await API.get(`/houses?cityId=${id}`)
        // console.log(res);
        //关闭loading
        Toast.hide()
        this.setState({
            houseList:res.data.body.list,

            //展示房源列表
            isShowList:true
        })
        } catch (e) {
        //关闭loading
        Toast.hide()
        }
    }

    //获取渲染房屋列表的方法
    renderHouseList(){
        return this.state.houseList.map((item)=>(
            <HouseItem 
            key={item.houseCode} 
            src={BASE_URL+item.houseImg}
            title={item.title}
            desc={item.desc}
            tags={item.tags}
            price={item.price}/>
    ))
    }


    
    render(){
        return <div className="map">
            {/* 测试元素 */}
            {/* <div className="test">测试样式覆盖问题</div> */}
            {/* 顶部导航栏组件 */}
            <NavHeader onLeftClick={()=>this.props.history.push('/home')}>
                地图找房
            </NavHeader>
            {/* 地图容器元素 */}
            <div id="container"></div>
            {/* 房源列表 */}
            <div className={[
                styles.houseList,
                this.state.isShowList?styles.show:'']
                .join(' ')
                //如果isShowList为true 拼接后是className='houseList show' 房屋列表会从底下冒上来
                //如果isShowList为false 拼接后是className='houseList'  房屋列表会出现在屏幕底下

            }>
                <div className={styles.titleWrap}>
                    <h1 className={styles.listTitle}>房屋列表</h1>
                    <Link className={styles.titleMore} to='/home/list'>更多房源</Link>
                </div>
                <div className={styles.houseItems}>
                    {/* 房屋结构 */}
                    {this.renderHouseList()}
                </div>
            </div>

        </div>
    }
}