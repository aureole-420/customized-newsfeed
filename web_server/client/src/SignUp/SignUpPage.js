import React from 'react';
import SignUpForm from './SignUpForm';
import Auth from '../Auth/Auth';

class SignUpPage extends React.Component {
    constructor(props) {
        super(props);

        // set the initial component state
        this.state = {
            errors: {},
            user: {
                email: '',
                password:'',
                confirm_password:''
            }
        };
    }

    processForm(event) {
        // prevent default action. in this case, action is the form submission event
        event.preventDefault();

        const email = this.state.user.email;
        const password = this.state.user.password;
        const confirm_password = this.state.user.confirm_password;

        console.log('email: ', email);
        console.log('password: ', password);
        console.log('confirm_password: ', confirm_password);

        // todo: post registration data.

        const url = 'http://' + window.location.hostname + ":3000/auth/signup";
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

                 // change the current url to /login
                 window.location.replace('/login'); // '/login' 来自route
             } else { // 获取数据失败的话也只能把错误信息显示出来。
                 console.log('Login failed');
                 response.json().then(json => {
                    const errors = json.errors ? json.errors : {};
                    errors.summary = json.message;
                    console.log(this.state.errors);
                    this.setState({errors});
                 });
             }
         }); 
    }

    changeUser(event) {
        const field = event.target.name;
        const user = this.state.user;
        user[field] = event.target.value;

        this.setState({user});

        const errors = this.state.errors;
        if (this.state.user.password !== this.state.user.confirm_password) {
            errors.password = "Password and Confirm Password don't match.";
        } else {
            errors.password = ''; // 清空错误
        }

        this.setState({errors});

    }

    render() {
        return (
            <SignUpForm
                onSubmit={(e) => this.processForm(e)}
                onChange={(e)=>this.changeUser(e)}
                errors={this.state.errors}
                />
        );
    }
}

export default SignUpPage;

