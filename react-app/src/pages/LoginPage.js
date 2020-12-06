import React from 'react';
import Cookies from 'js-cookie';
import {post} from '../util.js';

export default class LoginPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: ''
		};
	}

	componentDidMount() {
		
	}

	checkLogin = () => {
		post("/login", {
			username: this.state.username,
			password: this.state.password
		}).then(data => {
			if (data.success) {
				Cookies.set("username", data.u_name);
				Cookies.set("password", data.u_password);
				Cookies.set("userid", data.u_userid);
			}
			else alert("Incorrect login!");
		});
	}

	render() {
		return (<span>
			<h1>Login</h1>
			<input type="text"
				value={this.state.username}
				onChange={e => this.setState({username: e.target.value})}
			/>
			<input type="password"
				value={this.state.password}
				onChange={e => this.setState({password: e.target.value})}
			/>
			<button onClick={this.checkLogin}>Login</button>
		</span>);
	}
}