import React from 'react';
import ReactDOM from 'react-dom';

//导入antd-mobile的样式
import 'antd-mobile/dist/antd-mobile.css'

//导入字体图标库的样式文件
import './assets/fonts/iconfont.css'

//导入样式文件react-virtualized/styles.css
import 'react-virtualized/styles.css'

//注意：自己的全局样式要放在组件库样式的后面
import './index.css';

//注意！应该把组件的导入放在样式导入后面 避免覆盖

import App from './App';

import './utils/url'

ReactDOM.render(<App />,document.getElementById('root'));

