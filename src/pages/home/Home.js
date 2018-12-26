import React ,{Component} from "react"
import {Button, Switch} from "antd"
import { post, get, getUrl} from "server/http";
import api from "server/api"
import {withRouter} from "react-router-dom"
import HomeScss from "./Home.scss"



/*pages*/
import ChatRoom from "components/ChatRoom/ChatRoom"


class Home extends Component{

    constructor(props){
        super(props)
        this.state = {
            userInfo:{}
        }
    }

    componentWillMount(){
        let self = this
        self.getUserInfo()
    }

    /*通过token 获取用户登录信息，如果没有用户信息，跳转到登录页面*/
    getUserInfo(){
        let self = this
        let url = getUrl(api.user.info)
        post(url).then(res=>{
            if(res.code==200){
                /*pass*/
                self.setState({
                    userInfo:res.data
                })

            }else{
                /*没有登录状态跳转到login页面*/
                self.props.history.push('/login')
            }
        },error=>{

        })
    }


    render(){
        return (
            <div className="chat-room">
                <ChatRoom userInfo={this.state.userInfo}></ChatRoom>
            </div>
        )
    }
}


export default withRouter(Home)
