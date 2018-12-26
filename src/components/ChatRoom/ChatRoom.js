import React,{Component} from "react"
import {withRouter} from "react-router-dom"
import { Icon, Input, Row, Col, Button, Tooltip } from "antd"
import ChatRoomScss from "./ChatRoom.scss"
import {post,get,getUrl} from "server/http";
import api from "server/api"
import cookie from "utils/cookie"
import Config from "config/config"

import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css';



import peopleImg from "../../images/650.jpg"


class ChatRoom extends Component{
    constructor(props){
        super(props)
        this.contentEditable = React.createRef();
        this.state = {
            keyName:"",
            keyNameTimer:null,//防抖计时器
            isnotSearch:true,
            /*定义返回格式*/
            html:"",
            panels: {
                'chatroom': {
                    chatInfo: {
                        avater: peopleImg,
                        nickname: "聊天室",
                        lastTime: "17:29",
                        lastMsg: "hello,world"
                    },
                    chatDetails: []
                }
            },
            searchUserList:[

            ]
        }
    }

    componentDidMount(){
        /*reload localstorage*/


        /*socket register*/
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
        this.setState({html: e.target.value});
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

        self.setState({
            html:""
        },()=>{
            /*接口操作*/
        })
    }

    getFocusToEdit(){
        let self = this
        // console.log(self.contentEditable.current);
        self.contentEditable.current.focus()
    }

    handleSearchListClick(index){
        let self = this
        self.setState({
            keyName: "",
            isnotSearch:true
        })

    }

    render(){
        const { keyName } = this.state
        const { panels } = this.state
        const { isnotSearch } = this.state
        const { searchUserList } = this.state

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
                            {Object.keys(panels).map((panel,index)=>(
                                <div className={"person active"} key={index}>
                                    <div className="panel-avater">
                                        <img src={panels[panel].chatInfo.avater} alt=""/>
                                    </div>
                                    <div className="person-content clearfix">
                                        <div className={'clearfix person-info'}>
                                            <div className="person-name">
                                                {panels[panel].chatInfo.nickname}
                                            </div>
                                            <div className="person-time">
                                                {panels[panel].chatInfo.lastTime}
                                            </div>
                                        </div>
                                        <div className="person-msg">
                                            {panels[panel].chatInfo.lastMsg}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>:<div className="panel-area">
                            {searchUserList.map((user,index)=>(
                                <div onClick={()=>this.handleSearchListClick(index)} className={'person search-people'} key={index}>
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
                            <a href="javascript:;">聊天室</a>
                        </div>
                    </div>
                    {/*收件区域*/}
                    <div className="chatarea-main">
                        <div className="send-msg-box msg-box clearfix">
                            <div className="panel-avater">
                                <img src={this.props.userInfo.avater} alt=""/>
                            </div>
                            {/*</Tooltip>*/}
                            <div className="right-msg panel-msg">
                                你好！你好！
                            </div>
                        </div>
                        {/*靠rec 和 send标识收发消息*/}
                        <div className="rec-msg-box msg-box clearfix">
                            <div className="panel-avater">
                                <img src={this.props.userInfo.avater} alt=""/>
                            </div>
                            {/*</Tooltip>*/}
                            <div className="left-msg panel-msg">
                                你好！
                            </div>
                        </div>
                        <div className="rec-msg-box msg-box clearfix"></div>
                    </div>
                    {/*发送区域*/}
                    <div className="chatarea-fd">
                        <div className="fd-legend"></div>

                        <div className="fd-edit" onClick={()=>this.getFocusToEdit()}>
                            <PerfectScrollbar>
                                <div className="edit-area"
                                     contentEditable="true"
                                     dangerouslySetInnerHTML={{__html:this.state.html}}
                                     ref={this.contentEditable}
                                     onInput={(e)=>this.editHandleChange(e)}
                                     onKeyDown={(e)=>this.handleInputSubmit(e)}
                                >
                                </div>
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