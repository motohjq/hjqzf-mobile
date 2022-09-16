import React,{ Component }  from "react";

import { WhiteSpace ,WingBlank,Flex,Toast} from "antd-mobile";
import {Link} from 'react-router-dom'
import {withFormik,Form,Field,ErrorMessage} from 'formik'
import * as yup from 'yup'
import NavHeader from "../../components/NavHeader";
import {API} from '../../utils/api'

import styles from "./index.module.css";

// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component{
    // state={
    //     username:'',
    //     password:''
    // }
    // getUserName=(e)=>{
    //     this.setState({
    //         username:e.target.value
    //     })
    // }
    // getPassword=(e)=>{
    //     this.setState({
    //         password:e.target.value
    //     })
    // }
    // 表单提交事件的事件处理程序
    // handleSubmit=async (e)=>{
    //     //阻止表单提交时的默认行为
    //     e.preventDefault()
    //     //获取账号和密码
    //     const {username,password}=this.state
    //     // console.log('表单提交了',username,password);
    //     //发送请求
    //     const res=await API.post('/user/login',{
    //         username,
    //         password
    //     })
    //     console.log(res);
    //     const {status,body,description}=res.data
    //     if(status===200){
    //         //登录成功
    //         localStorage.setItem('hjqzf_token',body.token)
    //         this.props.history.go(-1)
    //     }else{
    //         //登录失败
    //         Toast.info(description,2,null,false)
    //     }
    // }
    render(){
        //通过props获取高阶组件传递进来的属性
        // const {values,handleSubmit,handleChange,handleBlur,errors,touched}=this.props
        // console.log(values,'====',handleSubmit,'====',handleChange);
        // console.log(errors,touched);
        return (
            <div className={styles.root}>
                {/* 顶部导航 */}
                <NavHeader className={styles.navHeader}>
                    账号登录
                </NavHeader>
                <WhiteSpace size="xl"/>
                {/* 登录表单 */}
                <WingBlank>
                    <Form>
                        <div className={styles.formItem}>
                            <Field 
                            className={styles.input}
                            name='username'
                            placeholder='请输入账号'/>
                        </div>
                        <ErrorMessage className={styles.error} name='username' component='div'/>
                        {/* {errors.username&&touched.username&&(
                            <div className={styles.error}>{errors.username}</div>
                        )} */}
                        {/* 长度5-8位 只能出现数字字母下划线 */}
                        {/* <div className={styles.error}>账号为必填项</div> */}
                        <div className={styles.formItem}>
                            <Field 
                            className={styles.input} 
                            name='password'
                            type='password'
                            placeholder='请输入密码'/>
                        </div>
                        <ErrorMessage className={styles.error} name='password' component='div'/>
                        {/* {errors.password&&touched.password&&(
                            <div className={styles.error}>{errors.password}</div>
                        )} */}
                        {/* 长度5-12位 只能出现数字字母下划线 */}
                        {/* <div className={styles.error}>密码为必填项</div> */} 
                        <div className={styles.formSubmit}>
                            <button 
                            className={styles.submit} 
                            type='submit'>
                                登录
                            </button>
                        </div>                       
                    </Form>
                    <Flex className={styles.backHome}>
                        <Flex.Item>
                            <Link to='/registe'>还没有账号，去注册~</Link>
                        </Flex.Item>
                    </Flex>
                </WingBlank>
            </div>
        )
    }
}
Login=withFormik({
    //提供状态
    mapPropsToValues:()=>({username:'',password:''}),

    //添加表单校验规则
    validationSchema:yup.object().shape({
        username:yup.string().required('账号为必填项').matches(REG_UNAME,'长度为5-8位，只能出现数字字母下划线'),
        password:yup.string().required('密码为必填项').matches(REG_PWD,'长度为5-12位，只能出现数字字母下划线')
    }),
    //表单提交事件
    handleSubmit:async(values,{props})=>{
        //获取账号和密码
        const {username,password}=values
        // console.log('表单提交了',username,password);
        //发送请求
        const res=await API.post('/user/login',{
            username,
            password
        })
        console.log(res)
        const { status, body, description } = res.data;
        if(status===200){
            //登录成功
            localStorage.setItem('hjqzf_token',body.token)
            if(!props.location.state){
                //此时表示是直接进入到该页面 直接调用go(-1)
                props.history.go(-1)
            }else{
                props.history.replace(props.location.state.from.pathname)
            }
            //注意 无法在该方法中通过this来获取到路由信息 需要通过第二个参数中获取到props
        }else{
            //登录失败
            Toast.info(description,2,null,false)
        }
    }
})(Login)
//注意 此处返回的是高阶组件包装后的组件
export default Login