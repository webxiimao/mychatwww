import React,{Component} from "react"
import {
    Form, Icon, Input, Button, Checkbox, message, Alert
} from 'antd';
import {withRouter} from "react-router-dom"
import LoginFormScss from "./LoginForm.scss"
import {post,get,getUrl} from "server/http";
import api from "server/api"
import cookie from "utils/cookie"
import Config from "config/config"


class LoginForm extends Component {

    constructor(props){
        super(props)
        this.state = {
            loginerr:false,
        }
    }

    /*用户登录*/
    handleSubmit(e){
        let self = this
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let url = getUrl(api.user.login)
                let form = this.props.form.getFieldsValue()
                post(url,{
                    username:form.username,
                    password:form.password
                }).then(res=>{
                    if(res.code==200){
                        /*用户验证成功，保存token 跳转index页面*/
                        cookie.setCookie(Config.token_name,res.data,7)
                        message.success('登录成功', 1, ()=>{
                            self.props.history.push('/index')
                        })
                    }else{
                        message.info(res.msg, 1)
                        self.setState({
                            loginerr:true
                        })
                    }
                },error=>{

                })

            }
        });
    }

    gotoRegister(){
        this.props.history.push('/register')
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        const {loginerr} = this.state
        return (
            <Form onSubmit={(e)=>this.handleSubmit(e)} className="login-form">
                {loginerr?<Alert message="您输入的用户名或密码错误" type="error" className="err-msg" />:""}
                <Form.Item>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: '请输入用户名!' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入密码!' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
                    )}
                </Form.Item>
                <Form.Item>
                    <Button block type="primary" htmlType="submit" className="login-submit">
                        登录
                    </Button>
                    <Button block onClick={()=>this.gotoRegister()}>注册</Button>
                </Form.Item>
            </Form>
        );
    }
}

const WrappedLoginForm = Form.create()(LoginForm);

export default withRouter(WrappedLoginForm)