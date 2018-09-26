import './LoginForm.css';
// import 'materialize-css/dist/css/materialize.min.css';
import React from 'react';
import {Link} from 'react-router-dom';

// 偏向UI显示，没有逻辑，逻辑都放在LoginPage里面
// 这里可以写成 const LoginForm = (props) => {...}
// 显式地写出props这个对象{} 包含了onSubmit, onChange...., 更加直观，是比标准的props更好的practice
const LoginForm = ({ // 加了()表示返回一个objec！
    onSubmit, // 这个函数是在 parent - login page里定义的。
    onChange,
    errors,
})  => (// 也可以用大括号 {return (HTML)} // HTML 很多行代码其实还是一行
    
    // html container
    // 
    // 
    <div className = "container">
        <div className = "card-panel login-panel">
            <form className="col s12" action="/" onSubmit = {onSubmit}>
                
                <h4 className="center-align">Login</h4>

                {errors.summary && <div className="row"><p className="error-message">{errors.summary}</p></div>}
                
                <div className="row">
                    <div className="input-field col s12">
                        <input className="validate" id="email" type="email" name="email" onChange={onChange}/>
                        <label htmlFor='email'>Email</label>
                    </div>
                </div>

                {errors.email && <div className="row"><p className="error-message">{errors.email}</p></div>}

                <div className="row">
                    <div className="input-field col s12">
                        <input className="validate" id="password" type="password" name="password" onChange={onChange}/>
                        <label htmlFor='password'>Password</label>
                    </div>
                </div>

                {errors.password && <div className="row"><p className="error-message">{errors.password}</p></div>}
        <div className="row right-align">
          <input type="submit" className="waves-effect waves-light btn indigo lighten-1" value='Log in'/>
        </div>
        <div className="row">
          <p className="right-align"> New to Tap News?  <Link to="/signup">Sign Up</Link></p>
        </div>

            </form>
        </div>
    </div>
);

// errors obj里面有三种值： summary, email, password
export default LoginForm;