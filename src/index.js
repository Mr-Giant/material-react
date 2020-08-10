/*!
=========================================================
* Material Dashboard React - v1.9.0
=========================================================
* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)
* Coded by Creative Tim
=========================================================
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import {  BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from 'react-redux';

import configureStore, { commonNamespace, rootSaga, sagaMiddleware } from 'store/indexStore';
import { namespace as themeNamespace } from 'store/modules/theme/reducer';
import * as serviceWorker from './serviceWorker';

// 页面
import Admin from "layouts/Admin.js";
import RTL from "layouts/RTL.js";
import Login from 'views/login/Login.js';
import NotFound from 'views/NotFound.jsx';

import "assets/css/material-dashboard-react.css?v=1.9.0";

const hist = createBrowserHistory();

const store = configureStore({
  [commonNamespace]: {
    storeTips: 'Common global store',
  },
  // 这里还可以单独添加替换指定的state
  [themeNamespace]: {
    storeTips: 'Theme global store instead of inner',
  },
})

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path='/' render={() => (<Redirect to='/admin' />)} />
        <Route path="/admin" component={Admin} />
        <Route path="/rtl" component={RTL} />
        <Route exact path='/login' component={Login} />
        <Route exact component={NotFound} /> 
      </Switch>
    </Router>
  </Provider>,
  document.getElementById("root")
);

sagaMiddleware.run(rootSaga);
serviceWorker.unregister();