// helper class, 不是component
// 提供了浏览器localStorage(5MB)的封装 
class Auth {
    // https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage
    // localStorage是浏览器提供的
    static authenticateUser(token, email) {
        localStorage.setItem('token', token);
        localStorage.setItem('email', email);
    }

    static isUserAuthenticated() {
        return localStorage.getItem('token') !== null;
    }

    static deauthenticateUser() {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
    }

    static getToken() {
        return localStorage.getItem('token');
    }

    static getEmail() {
        return localStorage.getItem('email');
    }
}

export default Auth;