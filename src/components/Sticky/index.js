import React,{Component,createRef} from "react";
import styles from './index.module.css'
import PropTypes from 'prop-types'

class Sticky extends Component{
    //创建ref对象
    placeholder=createRef()
    content=createRef()

    //scroll事件的事件处理程序
    handleScroll=()=>{
        const {height}=this.props
        //获取ref对应的dom对象
        const placeholderEl=this.placeholder.current
        const contentEl=this.content.current

        const {top}= placeholderEl.getBoundingClientRect()
        if (top<0) {
            // 吸顶
            placeholderEl.style.height=`${height}px`
            contentEl.classList.add(styles.fixed)
        }else{
            //取消吸顶
            placeholderEl.style.height='0px'
            contentEl.classList.remove(styles.fixed)
        }
    }

    //监听scroll事件
    componentDidMount(){
        window.addEventListener('scroll',this.handleScroll)
    }
    componentWillUnmount(){
        window.removeEventListener('scroll',this.handleScroll)

    }
    render(){
        return (
            <div>
                {/* 占位元素 */}
                <div ref={this.placeholder}></div>
                {/* 内容元素 */}
                <div ref={this.content}>{this.props.children}</div>
            </div>
        )
    }
}
Sticky.propTypes={
    height:PropTypes.number.isRequired,
}

export default Sticky