import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min.js'; // 支持materialize的动态效果

import React from 'react';
// import ReactDOM from 'react-dom';

import App from '../App/App';
import LoginPage from '../Login/LoginPage';
import SignUpPage from '../SignUp/SignUpPage';
import Auth from '../Auth/Auth';

// Router是整个app， Route是规则
// 把react training的example过一遍
// React Router Link不需要刷新页面，href需要刷新页面
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';


import './Base.css'; // 设置一下导航栏的style

const logout = () => {
    Auth.deauthenticateUser();
    window.location.replace('/login'); // 跳转到login page
};


const Base = () => (
    <Router>
        <div>
            <nav className="nav-bar indigo lighten-1">
            <div className="nav-wrapper">
                <a href="/" className="brand-logo">Tap News</a>
                <ul id = "nav-mobile" className="right">
                    {Auth.isUserAuthenticated() ? 
                    (
                    <div>
                         <li> {Auth.getEmail()}</li>
                         <li><a onClick={logout}>Log out</a></li>
                    </div>)
                    :
                    (<div>
                    <li><Link to="/login">Log in</Link></li>
                    <li><Link to="/signup">Signup</Link></li>
                    </div>)
                    }
                    </ul>
            </div>
            </nav>
        <br/>

        {/* 下面是routing柜子 */}

        <Route exact path="/" render={() => (Auth.isUserAuthenticated() ? 
            (<App />) : (<LoginPage/>))}/>
        <Route exact path="/login" component={LoginPage}/>
        <Route exact path="/signup" component={SignUpPage}/>
        </div>


    </Router>
);

export default Base;

