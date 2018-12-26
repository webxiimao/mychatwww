import React ,{Component} from "react"
import {Button, Switch} from "antd"
import LoginScss from "./Login.scss"

import LoginForm from 'components/LoginForm/LoginForm.js'


class Login extends Component{
    render(){
        return (
            <div className="LoginForm">
                {/*<Button type="primary" icon="download" size='large'>Download</Button>*/}
                <LoginForm></LoginForm>
            </div>
        )
    }
}


export default Login