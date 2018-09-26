import LoginForm from './LoginForm';
import React from 'react';

import Auth from '../Auth/Auth';

// 把UI和logic分开，UI放在loginForm里面，方便维护
class LoginPage extends React.Component {
    constructor() {
        super();

        this.state = {
            errors: {},
            user: {
                email: '',
                password: ''
            }
        };
    }

    // 对form内容做一个简单的校验，并且对后端发送数据
    processForm(event) {
        event.preventDefault(); //不需要默认浏览器行为：自动post自动get

        //submit在填表之后，所以在submit之前，因为onChange已经更新state了
        // state里面一定是最新的。
        const email = this.state.user.email;
        const password = this.state.user.password;

        console.log('email: ', email);
        console.log('password: ', password);

        //  post login data
        const url = 'http://' + window.location.hostname + ":3000/auth/login";
        const request = new Request (
            url,
            {
                method: 'POST', 
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.state.user.email,
                    password: this.state.user.password
                })
            }
        );

         // 用fetch 发request，用then处理promise
         fetch(request).then(response => {
             if (response.status === 200) {
                 this.setState({errors : {}}) // 登陆成功后需要清空error

                 response.json().then(json => {
                    console.log(json);
                    Auth.authenticateUser(json.token, email); // 存下来
                    window.location.replace('/'); // 跳转到主页面
                }); 
             } else { // 获取数据失败的话也只能把错误信息显示出来。
                 console.log('Login failed');
                 response.json().then(json => {
                    const errors = json.errors ? json.errors : {};
                    errors.summary = json.message;
                    this.setState({errors});
                 });
             }
         }); 
    }

    // 用户先填表，触发onChange, 所以先更新state
    // target.name 就是onChange绑定的两个<input name=“。。。”>的name，一个是email一个是password
    changeUser(event) {
        // https://developer.mozilla.org/en-US/docs/Web/API/Event/target#Syntax
        const field = event.target.name; // Mozilla event.target可以得到表格变化的所有值，所以可以一次得到了email 和 password
        const user = this.state.user;
        user[field] = event.target.value;

        this.setState({user}); // 更改要用setState
    }


    // LoginForm违背了react从parent到child单向数据流的规定 ---- email password 都是从child到parent
    // 这里处理方法是react简易的，用parent的外派函数，event listenerm onChange, 既能access children，又能被parent access到
    render() {
        return (
           <LoginForm
            onSubmit = {(e) => this.processForm(e)}
            onChange = {(e) => this.changeUser(e)}
            errors = {this.state.errors} /> 
        )
    }
}

export default LoginPage;