import React from "react";
import { Flex } from 'antd-mobile'
import styles from './index.module.css'

const titleList = [
    { title: '区域', type: 'area' },
    { title: '方式', type: 'mode' },
    { title: '租金', type: 'price' },
    { title: '筛选', type: 'more' },
]

export default function FilterTitle({ titleSelectedStatus,onClick }) {
    return (
        <Flex className={styles.root}>
            {titleList.map((item) => {
                const isSelected=titleSelectedStatus[item.type]
                return (
                    //onClick(item.type)这个onClick是传过来的 执行的是onTitleClick
                    <Flex.Item key={(item.type)} onClick={()=>onClick(item.type)}>
                        {/* 选中类名：selected */}
                        <span className={[styles.dropdown,isSelected? styles.selected:''].join(' ')}>
                            <span>{item.title}</span>
                            <i className="iconfont icon-arrow"></i>
                        </span>
                    </Flex.Item>
                )
            })}
        </Flex>

    )
}