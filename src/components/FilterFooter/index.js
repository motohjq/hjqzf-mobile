import React from "react";

import {Flex} from 'antd-mobile'
import PropTypes from 'prop-types'
import styles from './index.module.css'

function FilterFooter({
    cancelText,
    okText,
    onCancel,
    onOk,
    className
}){
    return (
        <Flex className={[styles.root,className||''].join(' ')}>
            {/* 取消按钮 */}
            <span className={[styles.btn,styles.cancel].join(' ')}
            onClick={onCancel}>{cancelText}</span>
            {/* 确定按钮 */}
            <span className={[styles.btn,styles.ok].join(' ')}
            onClick={onOk}>{okText}</span>
        </Flex>
    )
}
//props校验
FilterFooter.propsTypes={
    cancelText:PropTypes.string,
    okText:PropTypes.string,
    onCancel:PropTypes.func,
    onOk:PropTypes.func,
    className:PropTypes.string,

}
export default FilterFooter