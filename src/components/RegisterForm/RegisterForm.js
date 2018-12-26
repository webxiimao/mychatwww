import React,{Component} from "react"
import {
    Form, Icon, Input, Button, Checkbox, message, Alert
} from 'antd';
import {withRouter} from "react-router-dom"
import RegisterFormScss from "./RegisterForm.scss"
import {post,get,getUrl} from "server/http";
import api from "server/api"
import cookie from "utils/cookie"
import Config from "config/config"



class RegisterForm extends Component {
    constructor(props){
        super(props)
        this.state = {
            registererr:false,//是否显示错误信息
            errmsg:""
        }
    }

    /*提交*/
    handleSubmit(e){
        let self = this
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let url = getUrl(api.user.register)
                let form = this.props.form.getFieldsValue()
                post(url,form).then(res=>{
                    if(res.code==200){
                        message.success("用户注册成功", 1 ,()=>{
                            /*用户注册成功，跳转login页面*/
                            self.props.history.push('/login')
                        })

                    }else{
                        message.info(res.msg, 1)
                        self.setState({
                            registererr:true,
                            errmsg:res.msg
                        })
                    }
                },error=>{

                })

            }
        });
    }

    /*验证两次输入的密码*/
    compareToFirstPassword(rule, value, callback){
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次密码不一致');
        } else {
            callback();
        }
    }

    /*返回登录*/
    gotoLogin(){

    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const {registererr} = this.state
        return (
            <Form onSubmit={(e)=>this.handleSubmit(e)} className="register-form">
                {registererr?<Alert message={this.state.errmsg} type="error" className="err-msg" />:""}
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
                    {getFieldDecorator('passwordCheck', {
                        rules: [{ required: true, message: '请再次输入密码!' }, {
                            validator: (rule, value, callback)=>this.compareToFirstPassword(rule, value, callback),
                        }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="确认密码" />
                    )}
                </Form.Item>
                <Form.Item>
                    <Button block type="primary" htmlType="submit" className="register-submit">
                        注册
                    </Button>
                    已有账号？ <a href="javascript:;" onClick={()=>this.gotoLogin()}>马上去登陆!</a>
                </Form.Item>
            </Form>
        );
    }
}


const WrappedRegistrationForm = Form.create()(RegisterForm);

export default withRouter(WrappedRegistrationForm)