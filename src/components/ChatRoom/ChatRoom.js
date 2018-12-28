import React,{Component} from "react"
import {withRouter} from "react-router-dom"
import { Icon, Input, Row, Col, Button, Tooltip, Popover } from "antd"
import ChatRoomScss from "./ChatRoom.scss"
import {post,get,getUrl} from "server/http";
import api from "server/api"
import cookie from "utils/cookie"
import Config from "config/config"
import {getLocalData, addLocalData} from "utils/localstorage";



import io from 'socket.io-client';

// var socket = require('socket.io-client')('http://127.0.0.1:5000/');

/*第三方组件*/
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css';

import { Scrollbars } from 'react-custom-scrollbars';


/*静态资源*/
import peopleImg from "../../images/650.jpg"
import ContentEditDiv from "./contentEditDiv/contentEditDiv";



class ChatRoom extends Component{
    constructor(props){
        super(props)
        this.contentEditDiv = React.createRef();
        this._scrollRef = React.createRef()
        this.state = {
            keyName:"",
            socket:null,//websocket
            nowUserName:"",//现在的时间
            nowChatUserIndex:{},//目前正在聊天的对象
            keyNameTimer:null,//防抖计时器
            isnotSearch:true,
            /*定义返回格式*/
            html:"",
            panels: [],
            searchUserList:[

            ]
        }
    }

    componentWillMount(){
        let self = this
        /*reload localstorage*/
        self.getPanelData()

        /*socket register*/
    }

    componentDidMount(){
        let self = this
        self.registerSockets()
    }

    /*注册websocket*/
    registerSockets(){
        let self = this
        const socket = io('http://127.0.0.1:5000');
        self.setState({
            socket:socket,
        })
        socket.on('connect',res=>{
            socket.emit('server_connent',self.props.userInfo)
        })

        socket.on('client_connect',res=>{
            console.log(res.data);
        })

        socket.on('client_get_msg',res=>{
            let { panels } = self.state
            let { nowChatUser } = self.state
            let index = panels.findIndex(panel=>{
                if(res.des == self.props.userInfo.id){
                    return panel.id == res.src
                }
                if(res.src == self.props.userInfo.id){
                    return panel.id == res.des
                }
                if(res.src==undefined||res.des==undefined){
                    return panel.id == undefined
                }

            })
            let panelsCpy = JSON.parse(JSON.stringify(panels))
            if(panelsCpy[index]){
                panelsCpy[index].chatDetails.push(res)

            }else{
                let p = self.createRoom(res.desName,res.avater,res.desNickname,res.des)
                p.chatDetails.push(res)
                panelsCpy.push(p)
            }

            self.setState({
                panels:panelsCpy
            })

            /*滚动条置底*/
            setTimeout(()=>{
                self._scrollRef.scrollToBottom()
            },200)


        })
    }


    /*return chatroom*/
    createRoom(username,avater,nickname, id){
        let self = this
        return {
            name:username,
            id:id,
            chatInfo: {
                avater: avater,
                nickname: nickname,
                lastTime: "",
                lastMsg: ""
            },
            chatDetails: [
                // {des:4,avater:peopleImg,src:5,msg:"你好2！"},
            ]
        }
    }


    /*获取聊天记录数据*/
    getPanelData(){
        let self = this,
            panels = getLocalData();
        /*如果panel为空对象，添加聊天室房间*/
        if(panels.length<=0){
            // panels['chatroom'] = self.createRoom('chatroom',peopleImg,"聊天室")
            panels.push(self.createRoom('chatroom',peopleImg,"聊天室"))
        }

        self.setState({
            panels,
        },()=>{
            self.nowUser("chatroom")
        })


    }

    nowUser(uname){
        let self = this
        let nIndex;
        self.state.panels.forEach((panel,index)=>{
            if(panel.name == uname){
                nIndex = index
                return
            }
        })
        self.setState({
            nowUserName:uname,
            nowChatUserIndex:nIndex
        })
    }

    onChangeKeyName(e){
        let self = this
        let url = getUrl(api.user.searchUser)
        /*防抖*/
        clearTimeout(self.state.keyNameTimer)
        self.setState({
            keyName: e.target.value
        },()=>{
            if(!self.state.keyName){
                self.setState({
                    isnotSearch:true
                })
            }else{
                self.setState({
                    isnotSearch:false
                })
                /*设置防抖*/
                let timer = setTimeout(()=>{
                    get(url,{
                        keyName:self.state.keyName
                    }).then(res => {
                        if(res.code == 200){
                            self.setState({
                                searchUserList:res.data
                            })
                        }
                    })
                },500)
                self.setState({
                    keyNameTimer:timer,
                    searchUserList:[]
                })
            }


        });
    }


    editHandleChange(e){
        let self = this
        this.setState({
            html:e.target.value
        },()=>{

        });
    }

    /*发送消息*/
    handleInputSubmit(e){
        let self = this,
            editDiv = self.contentEditable.current
        if(e.keyCode==13){
            e.preventDefault()
            self.handleSubmit()

        }
    }

    handleBtnSubmit(){
        let self = this
        self.handleSubmit()
    }

    handleSubmit(){
        let self = this
        let data = self.combineMsg(),
            {socket} = this.state

        self.setState({
            html:''
        },()=>{
            // debugger
            /*socket操作*/
            socket.emit('send msg', data)
        })
    }

    /*组装数据*/
    /*发送信息*/
    combineMsg(){
        // {des:4,avater:peopleImg,src:5,msg:"你好2！"},
        let self = this
        let { panels } = self.state
        let { nowChatUserIndex } = self.state
        return {
            'des':self.props.userInfo.id,
            'avater':self.props.userInfo.avater,
            'src':panels[nowChatUserIndex].id,
            'msg':self.state.html,
            'targetName':panels[nowChatUserIndex].name,
            'desName':self.props.userInfo.username,
            'desNickname':self.props.userInfo.nickname
        }

    }

    getFocusToEdit(){
        let self = this
        // console.log(self.contentEditDiv);
        self.contentEditDiv.handleFocus()
    }

    panelsHasUser(uname){
        let self = this
        let index = self.state.panels.findIndex(panel=>{
            return panel.name == uname
        })

        return index

    }

    handleSearchListClick(user,index){
        let self = this
        /*清空搜索信息*/
        self.setState({
            keyName: "",
            isnotSearch:true
        })

        /*用户移至聊天菜单*/
        let panels = JSON.parse(JSON.stringify(self.state.panels))
        if(self.panelsHasUser(user.username)!==-1){
            /*聊天框内已有用户*/
            let pIndex = self.panelsHasUser(user.username)//获取panels该用户的index
            panels.unshift(panels.splice(pIndex,1)[0])//移至开头
        }else{
            /*聊天框内没有用户*/
            panels.splice(0,0,self.createRoom(user.username, user.avater, user.nickname,user.id))

        }



        self.setState({
            panels,
        },()=>{
            self.nowUser(user.username)
        })
    }

    handlePanelsListClick(panel, index){
        let self = this

        self.nowUser(panel.name)
        //当前聊天的用户
        // self.setState({
        //     nowChatUserIndex:index
        // })

    }

    render(){
        const { keyName } = this.state
        const { panels } = this.state
        const { isnotSearch } = this.state
        const { searchUserList } = this.state
        const { nowUserName } = this.state
        const { nowChatUserIndex } = this.state
        let self = this


        const content = (nickname,uname,avater) => {
            return (
                <div className="pop-info clearfix">
                    <div className='pop-info-n'>
                        <p className="pop-info-nickname">{nickname}</p>
                        <p className="pop-info-name">用户名:{uname}</p>
                    </div>
                    <div className="pop-info-avater">
                        <img src={avater} alt=""/>
                    </div>

                </div>
            )
        }

        return (
            <div className="chat-main">
                {/*聊天组成员*/}
                <div className="panel">
                    <div className="panel-header clearfix">
                        <div className="panel-avater">
                            <img src={this.props.userInfo.avater} alt=""/>
                        </div>
                        <div className="panel-uname">
                            {this.props.userInfo.nickname}
                        </div>
                        <div className="panel-opt">
                            <Icon type="align-right" />
                        </div>
                    </div>
                    <div className="panel-search">
                        {/*<div className="search-input">*/}
                        {/*<Icon type="search" className="search-icon"/>*/}
                        {/*<input type="text" className="search-text"/>*/}
                        <Input
                            className="search-input"
                            placeholder="搜索成员"
                            prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            value={keyName}
                            onChange={(e)=>this.onChangeKeyName(e)}
                        />
                        {/*</div>*/}
                    </div>
                    <div className="panel-people">
                        <div className="panel-people-nav">
                            <Row>
                                <Col span={8} className="people-nav">
                                    <Icon type="wechat"/>
                                </Col>
                            </Row>
                        </div>
                        {/*判断是否在搜索状态*/}
                        {isnotSearch?<div className="panel-area">
                            {panels.map((panel,index)=>(
                                <div onClick={()=>this.handlePanelsListClick(panel,index)} className={nowUserName == panel.name?'person active':'person'} key={index}>
                                    <div className="panel-avater">
                                        <img src={panel.chatInfo.avater} alt=""/>
                                    </div>
                                    <div className="person-content clearfix">
                                        <div className={'clearfix person-info'}>
                                            <div className="person-name">
                                                {panel.chatInfo.nickname}
                                            </div>
                                            <div className="person-time">
                                                {panel.chatInfo.lastTime}
                                            </div>
                                        </div>
                                        <div className="person-msg">
                                            {panel.chatInfo.lastMsg}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>:<div className="panel-area">
                            {searchUserList.map((user,index)=>(
                                <div onClick={()=>this.handleSearchListClick(user,index)} className={'person search-people'} key={index}>
                                    <div className="panel-avater">
                                        <img src={user.avater} alt=""/>
                                    </div>
                                    <div className="person-content clearfix">
                                        <div className={'clearfix person-info'}>
                                            <div className="person-name">
                                                {user.nickname}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>}


                    </div>
                </div>
                {/*聊天区域*/}
                <div className="chatarea">
                    {/*头部*/}
                    <div className="chatarea-hd">
                        <div className="chatarea-title">
                            <a href="javascript:;">{nowUserName}</a>
                        </div>
                    </div>
                    {/*收件区域*/}
                    <div className="chatarea-main">
                        <Scrollbars
                            ref={(ref)=>{this._scrollRef = ref}}
                        >
                            {(panels[nowChatUserIndex]&&panels[nowChatUserIndex].chatDetails)?panels[nowChatUserIndex].chatDetails.map((record,index)=>{
                                if(record.des != self.props.userInfo.id){
                                    return (
                                        <div key={index} className="clearfix msg">
                                            <div className="send-msg-box msg-box clearfix">
                                                <Popover placement="bottomRight" content={content(record.desNickname,record.desName,record.avater)} trigger="click">
                                                    <div className="panel-avater">
                                                        <img src={record.avater} alt=""/>
                                                    </div>
                                                </Popover>
                                                {/*</Tooltip>*/}
                                                <div className="right-msg panel-msg">
                                                    {record.msg}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }else{
                                    return(
                                        <div key={index} className="clearfix msg">
                                            <div className="rec-msg-box msg-box clearfix">
                                                <Popover placement="bottomRight" content={content(record.desNickname,record.desName,record.avater)} trigger="click">
                                                    <div className="panel-avater">
                                                        <img src={record.avater} alt=""/>
                                                    </div>
                                                </Popover>
                                                {/*</Tooltip>*/}
                                                <div className="left-msg panel-msg">
                                                    {record.msg}
                                                </div>
                                            </div>
                                        </div>

                                    )
                                }
                            }):""}
                        </Scrollbars>

                        {/*靠rec 和 send标识收发消息*/}

                        {/*<div className="rec-msg-box msg-box clearfix"></div>*/}
                    </div>
                    {/*发送区域*/}
                    <div className="chatarea-fd">
                        <div className="fd-legend"></div>

                        <div className="fd-edit" onClick={()=>this.getFocusToEdit()}>
                            <PerfectScrollbar>
                                {/*<div className="edit-area"*/}
                                {/*contentEditable="true"*/}
                                {/*dangerouslySetInnerHTML={{__html:this.state.html}}*/}
                                {/*ref={this.contentEditable}*/}
                                {/*onInput={(e)=>this.editHandleChange(e)}*/}
                                {/*onKeyDown={(e)=>this.handleInputSubmit(e)}*/}
                                {/*>*/}
                                {/*</div>*/}
                                <ContentEditDiv
                                    ref={(ref)=>{ this.contentEditDiv = ref }}
                                    html={this.state.html}
                                    onChange={(e)=>this.editHandleChange(e)}
                                    submit={()=>{this.handleSubmit()}}
                                >

                                </ContentEditDiv>
                            </PerfectScrollbar>
                        </div>

                        <div className="fd-submit clearfix">
                            <Button type="danger" onClick={()=>this.handleBtnSubmit()} className="btn-send">发送</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}




export default withRouter(ChatRoom)