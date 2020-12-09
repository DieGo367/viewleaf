import React from 'react';
import Cookies from 'js-cookie';
import Link from '../components/Link';
import {post} from '../util.js';

export default class PlanPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			plan: {},
			planid: this.props.match.params.id
		};
	}

	componentDidMount() {
		if (Cookies.get("userid") === undefined) {
			this.props.history.push("/");
			alert("You must be logged in")
		}
		else this.loadPlan();
	}

	loadPlan() {
		post("/getPlanDetail", {
			uid: Cookies.get("userid"),
			password: Cookies.get("password"),
			pid: this.state.planid
		}).then(data => {
			if (data.success) this.setState({plan: data.plan})
		});
	}

	deletePlan = () => {
		if (window.confirm("Delete plan "+this.state.plan.p_name+"?")) {
			post("/deletePlan", {
				uid: Cookies.get("userid"),
				password: Cookies.get("password"),
				pid: this.state.planid
			}).then(data => {
				if (data.success) this.props.history.push("/plans")
				else alert("Failed to delete");
			});
		}
	}

	remove(item) {
		if (window.confirm("Remove " + item.t_name + " from your plan?")) {
			post("/removeFromPlan", {
				uid: Cookies.get("userid"),
				password: Cookies.get("password"),
				pid: this.state.planid,
				tid: item.t_trailid
			}).then(data => {
				if (data.success) this.loadPlan();
				else alert("Failed to delete");
			});
		}
	}

	moveUp(item) {
		post("/moveUpInPlan", {
			uid: Cookies.get("userid"),
			password: Cookies.get("password"),
			pid: this.state.planid,
			tid: item.t_trailid
		}).then(data => {
			if (data.success) this.loadPlan();
			else alert("Failed to move");
		});
	}

	moveDown(item) {
		post("/moveDownInPlan", {
			uid: Cookies.get("userid"),
			password: Cookies.get("password"),
			pid: this.state.planid,
			tid: item.t_trailid
		}).then(data => {
			if (data.success) this.loadPlan();
			else alert("Failed to move");
		});
	}

	renderItems = () => {
		if (this.state.plan.items) {
			return this.state.plan.items.map((item, i) => {
				return (<div key={i} className="box">
					<p>{item.t_name}</p>
					<p>{item.t_park}</p>
					<p>{item.t_city}, {item.t_state}</p>
					<p>Rating: {item.t_popularity}</p>
					<p>Length: {item.t_length}</p>
					<p>Elevation Gain: {item.t_elevation_gain}</p>
					<p><Link to={"/trail/"+item.t_trailid}><button>Visit Page</button></Link></p>
					<p><button onClick={() => {this.remove(item)}}>Remove from Plan</button></p>
					<p><button onClick={() => {this.moveUp(item)}}>Move Up</button></p>
					<p><button onClick={() => {this.moveDown(item)}}>Move Down</button></p>
				</div>);
			})
		}
		else return false;
	}

	render() {
		return (<span>
			<h1>{this.state.plan.p_name}</h1>
			<button onClick={this.deletePlan}>Delete this plan</button>
			<h3>Trails:</h3>
			{this.renderItems()}
		</span>);
	}
}