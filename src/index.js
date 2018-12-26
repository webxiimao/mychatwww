import React from "react";
import ReactDom from "react-dom";
import indexStype from './index.scss'

import Home from "pages/home/Home"
import getRouter from "./router/router"


if (module.hot) {
    module.hot.accept();
}

ReactDom.render(
    getRouter(),
    document.getElementById("root")
);