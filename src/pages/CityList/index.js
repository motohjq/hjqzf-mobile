import React from "react";
// import axios from "axios";
import {API} from '../../utils/api'
//导入NavBar组件
import { Toast } from 'antd-mobile';

//导入List组件
import {List,AutoSizer} from 'react-virtualized' 

//导入NavHeader组件
import NavHeader from "../../components/NavHeader";

//导入utils中获取当前定位城市的方法
import {getCurrentCity} from '../../utils'

import './index.css'
//导入CSSModules的样式文件
// import styles from './index.module.css'
// console.log(styles);


//数据格式化方法
const formatCityList=(list)=>{
    const cityList={}
    //遍历list数组
    list.forEach(item => {
        //获取每个城市的首字母
        const first=item.short.substr(0,1)
        //判断cityList中是否有该分类
        if(cityList[first]){
            //如果有 直接往这个分类里push数据
            cityList[first].push(item)
        }else{
            //如果没有 就先创建一个数组 然后再把当前的城市信息添加到数组中
            cityList[first]=[item]
        }
    })

    //获取索引数据
    const cityIndex=Object.keys(cityList).sort()
    return {
        cityList,
        cityIndex
    }
}

//封装处理字母索引的方法
const formarCityIndex=(letter)=>{
    switch(letter){
        case '#':
            return '当前定位'
        case 'hot':
            return '热门城市'
        default:
            return letter.toUpperCase()
    }
}

//索引的高度
const TITLE_HEIGHT=36
//每个城市名称的高度
const NAME_HEIGHT=50

//有房源的城市
const HOUSE_CITY=['北京','上海','广州','深圳']


export default class CityList extends React.Component{
    constructor(props){
        super(props)
        this.state={
            cityList:{},
            cityIndex:[],
            //指定右侧字母索引列表高亮的索引号
            activeIndex:0
        }
        //创建ref对象
        this.cityListComponent=React.createRef()
    }
    

    async componentDidMount(){
        await this.getCityList()

        //调用measureAllRows提前计算List中每一行的高度 实现scrollToRow的精确跳转
        this.cityListComponent.current.measureAllRows()
    }

    async getCityList(){
        const res=await API.get('/area/city?level=1')
        // console.log('城市列表数据',res);
        
        const {cityList,cityIndex}=formatCityList(res.data.body)
        //获取热门城市数据
        const hotRes=await API.get('/area/hot')
        cityList['hot']=hotRes.data.body
        cityIndex.unshift('hot')

        //获取当前定位城市信息
        const curCity=await getCurrentCity()

        cityList['#']=[curCity]
        cityIndex.unshift('#')

        // console.log(cityList,cityIndex,curCity);
        this.setState({
            cityList,
            cityIndex
        })
    }

    //切换城市
    changeCity({label,value}){
        if (HOUSE_CITY.indexOf(label)>-1) {
          localStorage.setItem('hjqzf_city',JSON.stringify({label,value}))
          this.props.history.go(-1)
        }else{
            Toast.info('该城市暂无房源数据',1,null,false)
        }
    }

      
    rowRenderer=({
            key, // Unique key within array of rows
            index, // 索引号
            isScrolling, // 当前项是否正在滚动
            isVisible, // 当前项在List是可见的
            style, // 一定要给每一行添加样式
        }) =>{
            const {cityIndex,cityList}=this.state
            const letter=cityIndex[index]
            return (
            <div key={key} style={style} className='city'>
                <div className="title">{formarCityIndex(letter)}</div>
                {
                    cityList[letter].map((item)=>(
                        <div className="name" key={item.value}
                        onClick={()=>this.changeCity(item)}
                        >{item.label}                       
                        </div>
                    ))
                }
            </div>
            );
        }

    getRowHeight=({index})=>{
        const {cityList,cityIndex}=this.state
        return TITLE_HEIGHT+cityList[cityIndex[index]].length*NAME_HEIGHT
    }

    //封装渲染右侧索引列表方法
    renderCityIndex(){
        const {cityIndex,activeIndex}=this.state
        return cityIndex.map((item,index)=>(
            <li className="city-index-item" key={item} onClick={()=>{
                this.cityListComponent.current.scrollToRow(index)
            }}>
                <span className={activeIndex===index? "index-active":''}>{item==='hot'?'热':item.toUpperCase()}</span>
            </li>
        ))
    }

    onRowsRendered=({startIndex})=>{
        // console.log(startIndex);
        if(this.state.activeIndex!==startIndex){
            this.setState({
                activeIndex:startIndex
            })
        }
    }

    render(){
        return <div className="citylist">
            {/* 测试元素 */}
            {/* <div className={styles.test}>测试样式覆盖问题</div> */}
            {/* 顶部导航栏 */}
            <NavHeader>
                城市选择
            </NavHeader>
        {/* 城市列表 */}
        <AutoSizer>
        {({height,width})=>(
            <List
            ref={this.cityListComponent}
            width={width}
            height={height}
            rowCount={this.state.cityIndex.length}
            rowHeight={this.getRowHeight}
            rowRenderer={this.rowRenderer}
            onRowsRendered={this.onRowsRendered}
            scrollToAlignment="start"
        />
        )}
        </AutoSizer>
        {/* 右侧索引列表 */}
        <ul className="city-index">
            {this.renderCityIndex()}
        </ul>
        </div>
    }
}