import React from 'react';
import Cookies from 'js-cookie';
import Link from '../components/Link';
import {post} from '../util.js';

export default class PlansPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			plans: []
		};
	}

	componentDidMount() {
		if (Cookies.get("userid") === undefined) {
			this.props.history.push("/");
			alert("You must be logged in")
		}
		else this.loadPlans();
	}

	loadPlans() {
		post("/getPlans", {
			uid: Cookies.get("userid"),
			password: Cookies.get("password")
		}).then(data => {
			if (data.success) this.setState({plans: data.plans})
		});
	}

	newPlan = () => {
		let name = prompt("Enter the nane of your new Trail Plan:");
		if (name !== null && name !== '') {
			post("/newPlan", {
				uid: Cookies.get("userid"),
				password: Cookies.get("password"),
				planName: name
			}).then(data => {
				if (data.success) this.loadPlans();
				else alert("Unable to make plan");
			});
		}
	}

	renderPlans() {
		let plans = this.state.plans.map((plan, i) => {
			return (<div key={i} style={{
				border: "5px solid black",
				margin: "25px"
			}}>
				<Link to={"/plan/"+plan.p_planid}>
					<p>{plan.p_name}</p>
					<p># Trails: {plan.count}</p>
				</Link>
			</div>);
		});
		return (<div>
			{plans}
		</div>);
	}

	render() {
		return (<span>
			<h1>Your Trail Plans</h1>
			<button onClick={this.newPlan}>Make New Plan</button>
			{this.renderPlans()}
		</span>);
	}
}