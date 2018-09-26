import React from 'react';
import ReactDOM from 'react-dom';
// import App from './App/App';
import registerServiceWorker from './registerServiceWorker';

// import LoginPage from './Login/LoginPage';
// import SignUpPage from './SignUp/SignUpPage';
import Base from './Base/Base';


// ReactDOM.render(<App />, document.getElementById('root')); 
// ReactDOM.render(<LoginPage />, document.getElementById('root'));  // 仅仅是测试loginpage
// ReactDOM.render(<SignUpPage />, document.getElementById('root'));  // 仅仅是测试SignUpPage
ReactDOM.render(<Base />, document.getElementById('root'));  // 仅仅是测试SignUpPage
registerServiceWorker();
