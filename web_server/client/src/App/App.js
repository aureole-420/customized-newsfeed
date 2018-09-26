import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min.js'; // 支持materialize的动态效果


import './App.css';
import React from 'react';
import logo from './logo.png';
import NewsPanel from '../NewsPanel/NewsPanel';


// 这次就不用bootstrap了，改用materialize css

class App extends React.Component { // component是父类
    render() { 
        return (
        <div> 
            {/* <img className = 'logo' src = {logo} alt = 'logo'/>  // class是js的关键字，所以用className避免冲突 */}
            <img className = 'logo' src = {logo} alt = 'logo'/>  
            <div className = 'container'>
                <NewsPanel />
            </div>
        </div>
        );
    }
}

export default App;