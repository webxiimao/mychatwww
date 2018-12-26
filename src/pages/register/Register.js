import React ,{Component} from "react"
import {Button, Switch} from "antd"
import RegisterScss from "./Register.scss"

import RegisterForm from 'components/RegisterForm/RegisterForm.js'


class Register extends Component{
    render(){
        return (
            <div className="RegisterForm">
                {/*<Button type="primary" icon="download" size='large'>Download</Button>*/}
                <RegisterForm></RegisterForm>
            </div>
        )
    }
}


export default Register