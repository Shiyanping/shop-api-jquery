## 商城移动端项目

### 开发工具介绍

> 基于idtc框架、jquery、less、artTemplate 开发的一款简单商城webapp项目

* idtc

> 作用：启动本地服务器，编译less文件，引用模板，打包，压缩的功能

* jquery，less

> 自行百度

* art-template

> 模板渲染框架，两种语法，本项目使用了简单语法`{{}}`的形式

### 开发步骤

#### 1. 安装idtc依赖
`npm install idtc -g`

#### 2. 启动项目
`idtc ws start`

#### 3. 打包项目
`idtc build`
`idtc build --release` 压缩打包

> 通过idt-config.js修改目录

### 数据来源
> idtc 框架自带 mock 数据功能，会根据代码访问接口的路径，生成到mock文件夹中，在制定的文件中书写自己和后端定义的数据结构即可

### 项目目录

```
├── LICENSE  
├── README.md   
├── commons  
│   ├── js  
│   │   ├── config.js // 接口js   
│   │   ├── methods.js // 封装的方法  
│   │   └── methods.min.js  
│   └── libs  
│       ├── artTemplate.js  
│       ├── dropload  
│       ├── jquery-1.11.0.min.js  
│       ├── larea  // 地区选择插件  
│       └── swiper  
├── createOrder.html  
├── evaluation.html  
├── historyDetail.html  
├── historyList.html    
├── idt-config.js   
├── images  
├── index.html   
├── productDetail.html    
├── productList.html   
├── less    
│   ├── base.css    
│   ├── createOrder.less    
│   ├── evaluation.less   
│   ├── historyDetail.less  
│   ├── historyList.less    
│   ├── index.less  
│   ├── modal.css   
│   ├── productDetail.less  
│   └── productList.less  
├── mock    // 接口数据  
│   ├── ajax    
│   │   └── mall    
│   │       └── api     
│   │           ├── banner      
│   │           │   └── list.js     
│   │           ├── category     
│   │           │   ├── list.js     
│   │           │   └── product     
│   │           │       └── list.js     
│   │           ├── evaluate        
│   │           │   ├── init.js     
│   │           │   ├── list.js     
│   │           │   └── save.js     
│   │           ├── order   
│   │           │   ├── confirm     
│   │           │   │   └── progress.js     
│   │           │   ├── create.js   
│   │           │   ├── detail.js  
│   │           │   └── history.js  
│   │           ├── position  
│   │           │   └── product  
│   │           │       └── list.js  
│   │           ├── product  
│   │           │   ├── confirmDetail.js  
│   │           │   ├── detail.js  
│   │           │   └── list.js  
│   │           └── user  
│   │               ├── checkCanBuy.js  
│   │               ├── getAddress.js  
│   │               ├── getCredit.js  
│   │               ├── personalID.js  
│   │               └── personalInformation.js  
│   └── velocity    
└── src  // 页面逻辑js 
    ├── createOrder
    │   └── main.js
    ├── evaluation
    │   └── main.js
    ├── historyDetail
    │   └── main.js
    ├── historyList
    │   └── main.js
    ├── index
    │   └── main.js
    ├── productDetail
    │   └── main.js
    └── productList
        └── main.js
``` 