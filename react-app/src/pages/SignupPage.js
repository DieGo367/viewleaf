import React from 'react';
import Cookies from 'js-cookie';
import {post} from '../util.js';

export default class SignupPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: ''
		};
	}

	checkLogin = () => {
		post("/signup", {
			username: this.state.username,
			password: this.state.password
		}).then(data => {
			if (data.success) {
				Cookies.set("username", data.u_name);
				Cookies.set("password", data.u_password);
				Cookies.set("userid", data.u_userid);
				alert("User created successfully!");
				this.props.history.push("/");
			}
			else alert("Failed to create User");
		});
	}

	render() {
		return (<span>
			<h1>Signup</h1>
			<input type="text"
				value={this.state.username}
				onChange={e => this.setState({username: e.target.value})}
			/>
			<input type="password"
				value={this.state.password}
				onChange={e => this.setState({password: e.target.value})}
			/>
			<button onClick={this.checkLogin}>Submit</button>
		</span>);
	}
}