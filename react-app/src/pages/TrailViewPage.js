import React from 'react';
import {get} from '../util.js';

export default class TrailViewPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			trail: {}
		};
	}

	componentDidMount() {
		get("/getTrail/"+this.props.match.params.id).then(data => {
			this.setState({trail: data});
		});
	}

	render() {
		return (<span>
			<h1>{this.state.trail.t_name}</h1>
			<h2>{this.state.trail.t_park}</h2>
			<h3>{this.state.trail.t_city}, {this.state.trail.t_state}</h3>
			<p>Length: {this.state.trail.t_length}</p>
			<p>Elevation Gain: {this.state.trail.t_elevation_gain}</p>
			<p>Popularity: {this.state.trail.t_popularity}</p>

		</span>);
	}
}