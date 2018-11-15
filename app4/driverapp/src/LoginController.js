import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class LoginController extends Component {
    render() {
        return (
            <div className="container">
                <h1 style = {{paddingLeft: '110px'}}>Dang Nhap</h1>
                <form className="form-horizontal" style = {{paddingTop: '20px'}}>
                    <div className="container">
                        <div className="form-group" >
                            <label className="control-label col-sm-1" for="email">Email:</label>
                            <div className="col-sm-3">
                                <input type="email" className="form-control" id="email" placeholder="Enter email" name="email"></input>
                            </div>
                        </div>
                        <div className="form-group "  >
                            <label class="control-label  col-sm-1" for="pwd">Password:</label>
                            <div class="col-sm-3">
                                <input type="password" class="form-control" id="pwd" placeholder="Enter password" name="pwd"></input>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-sm-offset-1 col-sm-1">
                                <button type="submit" class="btn btn-default">Submit</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default LoginController;
