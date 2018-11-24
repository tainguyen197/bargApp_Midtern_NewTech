import React, { Component } from 'react';
import { Button,Alert } from 'react-bootstrap';
import { isBuffer } from 'util';

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
        var host = 'http://localhost:3000/identifier/login?';
        var username = this.state.username;
        var password = this.state.password;

        var req = host + 'username=' + username + '&password=' + password;
        console.log(req);   
        fetch(req)
            .then(result => {
                return result.json();
            }).then(data => {
                console.log(data);
                if (data.state === 'OK'){
                    this.setState({
                        isShow: false
                    });
                }
                else{
                   
                }
                return data;
            }).then(data => {
                if (!this.state.isShow){
                    this.props.sendData(data.driver);  
                }
            }).catch(err => {
                window.alert('Sai tên đăng nhập hoặc mật khẩu');
            })

    }

    render() {
        var a = 1;
        return (
            <div className="container">

                <form className="form-horizontal" style={{ paddingTop: '100px' }}>
                    <div className="container">
                        <div className="form-group" >
                            <label className="control-label col-sm-4" htmlFor="email">Username:</label>
                            <div className="col-sm-3">
                                <input onChange={this.updateUsernameValue} type="text" className="form-control" id="email" placeholder="Enter email" name="email"></input>
                            </div>
                        </div>
                        <div className="form-group "  >
                            <label className="control-label  col-sm-4" htmlFor="pwd">Password:</label>
                            <div className="col-sm-3">
                                <input onChange={this.updatePassValue} type="password" className="form-control" id="pwd" placeholder="Enter password" name="pwd"></input>
                            </div>
                        </div>
                    </div>
                </form>
                <div className="col-sm-offset-5 col-sm-1" style={{ paddingTop: '30px' }}>
                    <button className="btn btn-default" onClick={this.checkLogin}>Đăng nhập</button>
                   
                </div>
                
            </div>
        );
    }
}

export default LoginController;
