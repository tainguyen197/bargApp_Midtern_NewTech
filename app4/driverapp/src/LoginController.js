import React, { Component } from 'react';
import logo from './logo.svg';
import './Login.css';

class LoginController extends Component {

    constructor(props) {
        super(props);
        this.onClickLogin = this.onClickLogin.bind(this);
        this.state = {
            isShow: true
        };

    }

    onClickLogin(){
        this.setState({
            isShow: false
        });

        this.props.sendData(this.state.isShow);
    }

    render() {
        var a = 1;
        return (
            <div className="container">
                <form className="form-horizontal" style = {{paddingTop: '100px'}}>
                    <div className="container">
                        <div className="form-group" >
                            <label className="control-label col-sm-4" for="email">Email:</label>
                            <div className="col-sm-3">
                                <input type="email" className="form-control" id="email" placeholder="Enter email" name="email"></input>
                            </div>
                        </div>
                        <div className="form-group "  >
                            <label class="control-label  col-sm-4" for="pwd">Password:</label>
                            <div class="col-sm-3">
                                <input type="password" class="form-control" id="pwd" placeholder="Enter password" name="pwd"></input>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-sm-offset-4 col-sm-1"style = {{paddingTop: '30px'}}>
                                <button onClick = {this.onClickLogin} type="submit" class="btn btn-default">Đăng nhập</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default LoginController;
