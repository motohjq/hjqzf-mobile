import React,{Component} from "react";

import FilterTitle from '../FilterTitle'
import FilterMore from '../FilterMore'
import FilterPicker from '../FilterPicker'

import {API} from '../../../../utils/api'

import styles from './index.module.css'

//标题高亮的状态
const titleSelectedStatus={
    area:false,
    mode:false,
    price:false,
    more:false
}

//FilterPicker和FilterMore组件的选中值
const selectedValues={
    area:['area','null'],
    mode:['null'],
    price:['null'],
    more:[]
}

export default class Filter extends Component{
    state={
        titleSelectedStatus,
        //控制FilterPicker或FilterMore组件的展示和隐藏
        openType:'',
        //所有筛选条件的数据
        filtersData:{},
        //筛选条件选中值
        selectedValues,
    }
    //点击标题菜单实现高亮
    //注意：this指向的问题
    onTitleClick=type=>{
        //给body添加样式
        this.htmlBody.className='body-fixed'
        const {titleSelectedStatus,selectedValues}=this.state
        //创建新的标题选中状态对象
        const newTitleSelectedStatus={...titleSelectedStatus}
        //遍历标题选中状态对象
        Object.keys(titleSelectedStatus).forEach(key=>{
            //key表示数组中的每一项
            if (key===type) {
                //当前标题
                newTitleSelectedStatus[type]=true
                return
            }
            //其他标题
            const selectedVal=selectedValues[key]
            if(key==='area'&&(selectedVal.length!==2||selectedVal[0]!=='area')){
                //高亮
                newTitleSelectedStatus[key]=true
            }else if (key==='mode'&&selectedVal[0]!=='null') {
                newTitleSelectedStatus[key]=true
                
            }else if(key==='price'&&selectedVal[0]!=='null'){
                newTitleSelectedStatus[key]=true
            }else if(key==='more'&&selectedVal.length!==0){
                //更多选项FilterMore组件
                newTitleSelectedStatus[key]=true
            }else{
                newTitleSelectedStatus[key]=false
            }
        })
        this.setState({
            openType:type,
            //使用新的标题选中状态对象来更新
            titleSelectedStatus:newTitleSelectedStatus
        })
        // this.setState(prevState=>{
        //     // console.log(prevState);
        //     return{
        //         titleSelectedStatus:{
        //             ...prevState.titleSelectedStatus,
        //             [type]:true
        //         },
        //         //展示对话框
        //         openType:type
        //     }
        // })
    }

    //取消隐藏对话框
    onCancel=(type)=>{
        this.htmlBody.className=''
        // console.log('cancel',type);
        const {titleSelectedStatus,selectedValues}=this.state
        const newTitleSelectedStatus={...titleSelectedStatus}
        const selectedVal=selectedValues[type]
        if(type==='area'&&(selectedVal.length!==2||selectedVal[0]!=='area')){
            //高亮
            newTitleSelectedStatus[type]=true
        }else if (type==='mode'&&selectedVal[0]!=='null') {
            newTitleSelectedStatus[type]=true
            
        }else if(type==='price'&&selectedVal[0]!=='null'){
            newTitleSelectedStatus[type]=true
        }else if(type==='more'&&selectedVal.length!==0){
            //更多选项FilterMore组件
            newTitleSelectedStatus[type]=true
        }else{
            newTitleSelectedStatus[type]=false
        }
        this.setState({
            openType:'',
            titleSelectedStatus:newTitleSelectedStatus,
        })
    }
    //确定隐藏对话框
    onSave=(type,value)=>{
        this.htmlBody.className=''
        // console.log(type,value);
        //其他标题
        const {titleSelectedStatus}=this.state
        const newTitleSelectedStatus={...titleSelectedStatus}
        const selectedVal=value
        if(type==='area'&&(selectedVal.length!==2||selectedVal[0]!=='area')){
            //高亮
            newTitleSelectedStatus[type]=true
        }else if (type==='mode'&&selectedVal[0]!=='null') {
            newTitleSelectedStatus[type]=true
            
        }else if(type==='price'&&selectedVal[0]!=='null'){
            newTitleSelectedStatus[type]=true
        }else if(type==='more'&&selectedVal.length!==0){
            //更多选项FilterMore组件
            newTitleSelectedStatus[type]=true
        }else{
            newTitleSelectedStatus[type]=false
        }
        const newSelectedValues={
            ...this.state.selectedValues,
            //只更新当前type对应的选中值
            [type]:value
        }
        //筛选条件数据
        const filters={}
        const {area,mode,price,more}=newSelectedValues
        // console.log(newSelectedValues,area);
        //区域
        const areaKey=area[0]
        let areaValue='null'
        if(area.length===3){
            areaValue=area[2]!=='null'? area[2]:area[1]
        }
        filters[areaKey]=areaValue

        //方式和租金
        filters.mode=mode[0]
        filters.price=price[0]

        //更多筛选条件more
        filters.more=more.join(',')
        console.log(filters);

        //调用父组件中的方法 将筛选数据传递给父组件
        this.props.onFilter(filters)

        this.setState({
            openType:'',
            titleSelectedStatus:newTitleSelectedStatus,
            selectedValues:newSelectedValues
        })
    
    }
    componentDidMount(){
        //获取body
        this.htmlBody=document.body
        this.getFiltersData()
    }

    //封装获取所有筛选条件的方法
    async getFiltersData(){
        //获取当前定位城市id
        const {value}=JSON.parse(localStorage.getItem('hjqzf_city'))
        const res= await API.get(`/houses/condition?id=${value}`)
        console.log(res);
        this.setState({
            filtersData:res.data.body
        })
    }

    //渲染FilterPicker组件的方法
    renderFilterPicker(){
        const {
            openType,
            filtersData:{area,subway,rentType,price},
            selectedValues}
            =this.state
        if(openType!=='area'&&openType!=='mode'&&openType!=='price') return null

        //根据openType拿到当前筛选条件的数据
        let data=[]
        let cols=3
        let defaultValue=selectedValues[openType]
        switch (openType) {
            case 'area':
                //获取区域数据
                data=[area,subway];
                cols=3
                break;
            case 'mode':
                data=rentType;
                cols=1
                break;
            case 'price':
                data=price;
                cols=1
                break;
            default:
                break;
        }
        return <FilterPicker
         key={openType}
         onCancel={this.onCancel}
         onSave={this.onSave}
         data={data}
         cols={cols}
         type={openType}
         defaultValue={defaultValue}/>
    }

    //渲染FilterMore组件的方法
    renderFilterMore(){
        const {
            openType,
            selectedValues,
            filtersData:{roomType,oriented,floor,characteristic}} =this.state
        const defaultValue=selectedValues.more
        if(openType!=='more')return null
        const data={
            roomType,
            oriented,
            floor,
            characteristic
        }
        return <FilterMore 
                data={data} 
                type={openType} 
                onSave={this.onSave} 
                onCancel={this.onCancel}
                defaultValue={defaultValue}
                />
    }


    render(){
        const {titleSelectedStatus,openType}=this.state
        return (
            <div className={styles.root}>
                {/* 前三个菜单的遮罩层 */}
                {openType==='area'||openType==='mode'||openType==='price'?
                    (
                        <div className={styles.mask} onClick={()=>this.onCancel(openType)}></div>
                    ):null}

                <div className={styles.content}>
                    {/* 标题栏 */}
                    <FilterTitle titleSelectedStatus={titleSelectedStatus} onClick={this.onTitleClick}/>
                    {/* 前三个菜单对应的内容 */}
                    {this.renderFilterPicker()}
                    {/* 最后一个菜单对应的内容 */}
                    {this.renderFilterMore()}
                </div>
            </div>

        )
    }
}