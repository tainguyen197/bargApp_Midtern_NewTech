import React, { Component } from 'react';
import logo from './logo.svg';
import './Login.css';


class LoginController extends Component {
    constructor(props) {
        super(props);
        this.checkLogin = this.checkLogin.bind(this);
        this.updateUsernameValue = this.updateUsernameValue.bind(this);
        this.updatePassValue = this.updatePassValue.bind(this);
        this.state = {
            isShow: true,
            username: '',
            password: ''
        };

    }

    updatePassValue(evt) {
        this.setState({
            password: evt.target.value
        });
    }

    updateUsernameValue(evt) {
        this.setState({
            username: evt.target.value
        });
    }

    checkLogin() {
        var host = 'http://localhost:3000/driver/login?';
        var username = this.state.username;
        var password = this.state.password;

        var req = host + 'username=' + username + '&password=' + password;

        fetch(req)
            .then(result => {
                return result.json();
            }).then(data => {
                console.log('1');
                if (data.state === 'OK'){
                    this.setState({
                        isShow: false
                    });
                }
                else{
                   
                }
                return data;
            }).then(data => {
                if (!this.state.isShow)
                    this.props.sendData(this.state.isShow);
            }).catch(err => {
                window.alert('Tên đăng nhập hoặc mật khẩu không đúng!');
            })

    }

    render() {
        var a = 1;
        return (
            <div className="container">

                <form className="form-horizontal" style={{ paddingTop: '100px' }}>
                    <div className="container">
                        <div className="form-group" >
                            <label className="control-label col-sm-4" for="email">Email:</label>
                            <div className="col-sm-3">
                                <input onChange={this.updateUsernameValue} type="text" className="form-control" id="email" placeholder="Enter email" name="email"></input>
                            </div>
                        </div>
                        <div className="form-group "  >
                            <label class="control-label  col-sm-4" for="pwd">Password:</label>
                            <div class="col-sm-3">
                                <input onChange={this.updatePassValue} type="password" class="form-control" id="pwd" placeholder="Enter password" name="pwd"></input>
                            </div>
                        </div>
                    </div>
                </form>
                <div class="col-sm-offset-5 col-sm-1" style={{ paddingTop: '30px' }}>
                    <button class="btn btn-default" onClick={this.checkLogin}>Đăng nhập</button>
                </div>
            </div>
        );
    }
}

export default LoginController;
