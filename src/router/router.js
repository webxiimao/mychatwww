import React,{Component} from "react"
import { BrowserRouter as Router, Link,Route,Switch,Redirect } from 'react-router-dom'


import routerScss from "./router.scss"

/*pages*/
import Home from "pages/home/Home"
import Login from "pages/login/Login"
import Register from "pages/register/Register"



export default () => (
    <Router>
        <div>
            <div className="bgbig"></div>
            <Switch>
                <Route exact path="/index" component={Home}></Route>
                <Route path="/login" component={Login}></Route>
                <Route path="/register" component={Register}></Route>
                <Redirect to="/index"></Redirect>
            </Switch>
        </div>
    </Router>
)