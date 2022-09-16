import React from "react";
import { Flex,Toast} from 'antd-mobile'
import SearchHeader from "../../components/SearchHeader";
import Filter from './components/Filter'
import { API } from "../../utils/api";
import {List,AutoSizer,WindowScroller, InfiniteLoader,} from 'react-virtualized'
import { BASE_URL } from "../../utils/url";
import {getCurrentCity} from '../../utils'

import styles from './index.module.css'
import HouseItem from "../../components/HouseItem";
import Sticky from "../../components/Sticky";
import NoHouse from "../../components/NoHouse";

//获取当前城市定位信息
// const {label,value} =JSON.parse(localStorage.getItem('hjqzf_city'))

export default class HouseList extends React.Component{
    state={
        //列表数据
        list:[],
        //总条数
        count:0,
        //数据是否加载中
        isLoading:false
    }
    //初始化默认值
    label=''
    value=''
    //初始化实例属性
    filters={}
    async componentDidMount(){
        const {label,value}=await getCurrentCity()
        this.label=label
        this.value=value
        this.searchHouseList()
    }

    //用来获取房屋列表数据
    async searchHouseList(){
        this.setState({
            isLoading:true
        })
        //开启loading
        Toast.loading('加载中...',0,null,false)
        const res=await API.get('/houses',{
            params:{
                cityId:this.value,
                ...this.filters,
                start:1,
                end:20
            }
        })
        // console.log(res);
        const {list,count}=res.data.body
        //关闭loading
        Toast.hide()
        //提示房源数量
        if(count!==0){
            Toast.info(`共找到${count}套房源`,2,null,false)
        }
        this.setState({
            list,
            count,
            //数据加载完成的状态
            isLoading:false
        })
    }
    //接收Filter组件中的筛选条件数据
    onFilter=(filters)=>{
        //返回页面顶部
        window.scrollTo(0,0)
        this.filters=filters
        // console.log('HouseList',this.filters);
        //调用获取房屋数据的方法
        this.searchHouseList()
    }
    renderHouseList=({
        key, 
        index,
        style, 
    }) =>{
        //根据索引号获取当前这一行的房屋数据
        const {list}=this.state
        const house=list[index]

        //判断house是否存在
        //不存在的时候就渲染一个loading元素
        if(!house){
            return (
                <div key={key} style={style}>
                    <p className={styles.loading}></p>
                </div>
            )
        }
        // console.log(house);
        return (<HouseItem 
        key={key} 
        onClick={()=>this.props.history.push(`/detail/${house.houseCode}`)}
        style={style} 
        src={BASE_URL+house.houseImg}
        title={house.title}
        desc={house.desc}
        tags={house.tags}
        price={house.price}>

        </HouseItem>)
    }
    // 判断列表中的每一行数据是否加载完毕
    isRowLoaded = ({ index }) => {
        return !!this.state.list[index];
    };

    // 用来获取更多房屋列表数据
    // 注意：该方法的返回值是一个Promise对象，并且这个对象应该在数据加载完成时，来调用resolve让Promise对象的状态变为已完成
    loadMoreRows = ({ startIndex, stopIndex }) => {
        // console.log(startIndex, stopIndex);
        // return fetch(`path/to/api?startIndex=${startIndex}&stopIndex=${stopIndex}`)
        //   .then(response => {
        //     // Store response data in list...
        //   })
        return new Promise((resolve) => {
        API.get("/houses", {
            params: {
            cityId: this.value,
            ...this.filters,
            start: startIndex,
            end: stopIndex,
            },
        }).then((res) => {
            // console.log("loadMoreRows：", res);
            this.setState({
            list: [...this.state.list, ...res.data.body.list],
            });
            // 数据加载完成调用resolve即可
            resolve();
        });
        });
    };

    //渲染列表数据
    renderList(){
        const {count,isLoading}=this.state
        if(count===0&&!isLoading){
            return <NoHouse>没有找到房源，请换个搜索条件~</NoHouse>
        }
        return (
            <InfiniteLoader
            isRowLoaded={this.isRowLoaded}
            loadMoreRows={this.loadMoreRows}
            rowCount={count}
            >
                {({onRowsRendered,registerChild})=>(
                    <WindowScroller>
                    {({height,isScrolling,scrollTop})=>(
                        <AutoSizer>
                            {({width})=>(
                                <List
                                onRowsRendered={onRowsRendered}
                                ref={registerChild}
                                autoHeight//设置高度为WindowScroller最终渲染的列表高度
                                width={width}//视口宽度
                                height={height}//视口高度
                                rowCount={count}//List列表项的总条目数
                                rowHeight={120}//每一行的高度
                                rowRenderer={this.renderHouseList}//渲染列表项中的每一行
                                isScrolling={isScrolling}
                                scrollTop={scrollTop}
                            />
                            )}
                        </AutoSizer>
                    )}
                </WindowScroller>
                )}
            </InfiniteLoader>
        )
    }
    
    render(){
        return <div className="root">
            {/* 顶部搜索导航 */}
            <Flex className={styles.header}>
            <i className="iconfont icon-back" onClick={()=>this.props.history.go(-1)}></i>
            <SearchHeader cityName={this.label} className={styles.searchHeader}/>
            </Flex>
            {/* 条件筛选栏 */}
            <Sticky height={40}>
                <Filter onFilter={this.onFilter}/>
            </Sticky>
            {/* 房屋列表 */}
            <div className={styles.houseItems}>
            {this.renderList()}
            </div>
            </div>
    }
}