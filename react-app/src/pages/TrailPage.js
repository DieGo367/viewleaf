import React from 'react';
import TrailResult from '../components/TrailResult';
import {call} from '../util.js';

export default class TrailPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchField: '',
			results: []
		}
	}

	search = () => {
		call("/search", {q: this.state.searchField}).then(data => {
			this.setState({results: data.results});
		});
	}

	render() {
		let results = this.state.results.map(result => {
			return <TrailResult data={result} />
		});
		return (<span>
			<input type="text"
				onChange={(e) => this.setState({searchField: e.target.value})}
				value={this.state.searchField}
			/>
			<button onClick={this.search}>Search</button>
			{results}
		</span>);
	}
}