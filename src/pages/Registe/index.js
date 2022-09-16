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

class Registe extends Component {
  render() {
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>注册</NavHeader>
        <WhiteSpace size="xl" />
        <WingBlank>
          <Form>
            <div className={styles.formItem}>
              <label className={styles.label}>用户名</label>
              <Field className={styles.input} name='username' placeholder="请输入账号" />
            </div>
            <ErrorMessage className={styles.error} name='username' component='div'/>
            <div className={styles.formItem}>
              <label className={styles.label}>密码</label>
              <Field
                className={styles.input}
                name='password'
                type="password"
                placeholder="请输入密码"
              />
            </div>
            <ErrorMessage className={styles.error} name='password' component='div'/>
            <div className={styles.formItem}>
              <label className={styles.label}>重复密码</label>
              <Field
                className={styles.input}
                name='password1'
                type="password"
                placeholder="请重新输入密码"
              />
            </div>
            <ErrorMessage className={styles.error} name='password' component='div'/>
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                注册
              </button>
            </div>
          </Form>
          <Flex className={styles.backHome} justify="between">
            <Link to="/home">点我回首页</Link>
            <Link to="/login">已有账号，去登录</Link>
          </Flex>
        </WingBlank>
      </div>
    );
  }
}
Registe=withFormik({
  //提供状态
  mapPropsToValues:()=>({username:'',password:'',password1:''}),

  //添加表单校验规则
  validationSchema:yup.object().shape({
      username:yup.string().required('账号为必填项').matches(REG_UNAME,'长度为5-8位，只能出现数字字母下划线'),
      password:yup.string().required('密码为必填项').matches(REG_PWD,'长度为5-12位，只能出现数字字母下划线'),
      password1:yup.string().required('密码为必填项').matches(REG_PWD,'长度为5-12位，只能出现数字字母下划线')
  }),
  //表单提交事件
  handleSubmit:async(values,{props})=>{
      //获取账号和密码
      const {username,password,password1}=values
      // console.log('表单提交了',username,password,password1);
      if(password!==password1){
        Toast.info('两次密码不一致',2,null,false)
        return
      }
      //发送请求
      const res=await API.post('/user/registered',{
          username,
          password
      })
      console.log(res)
      const { status, body, description } = res.data;
      if(status===200){
          //创建
          Toast.info(description,2,null,false)
          //注意 无法在该方法中通过this来获取到路由信息 需要通过第二个参数中获取到props
          props.history.push('/login')
      }else{
          //登录失败
          // Toast.info(description,2,null,false)
      }
  }
})(Registe)
export default Registe;