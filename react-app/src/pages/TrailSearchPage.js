import React from 'react';
import TrailSearchResult from '../components/TrailSearchResult';
import Selector from '../components/Selector';
import {get, post} from '../util.js';

export default class TrailSearchPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchField: '',
			city: '',
			state: '',
			sort: '',
			isDescending: false,

			results: [],
			statesData: {}
		};
	}

	componentDidMount() {
		get("/getStates").then(data => {
			this.setState({statesData: data});
		});
	}

	search = () => {
		post("/search", {
			q: this.state.searchField,
			state: this.state.state,
			city: this.state.city,
			sort: this.state.sort,
			isDescending: this.state.isDescending
		}).then(data => {
			this.setState({results: data.results});
		});
	}

	stateOptions() {
		let stateOptions = {"-state-": ''};
		let states = Object.keys(this.state.statesData);
		for (let i = 0; i < states.length; i++) {
			stateOptions[states[i]] = states[i];
		}
		return stateOptions;
	}
	cityOptions() {
		let options = {"-city-": ''};
		let stateData = this.state.statesData[this.state.state];
		for (let i = 0; i < stateData.length; i++) {
			options[stateData[i]] = stateData[i];
		};
		return options;
	}
	
	renderResults() {
		return this.state.results.map((result, i) => {
			return <TrailSearchResult key={i} data={result} />
		});
	}

	render() {
		return (<span>
			<h1>Search Trails</h1>
			<p>
				Trail name / park
				<input type="text"
					value={this.state.searchField}
					onChange={(e) => this.setState({searchField: e.target.value})}
				/>
			</p>
			<p>
				<Selector
					label="State"
					options={this.stateOptions()}
					value={this.state.state}
					onChange={e => this.setState({state: e.target.value, city: ''})}
				/>
			</p>
			{this.state.state !== '' ? (<p>
					<Selector
						label="City"
						options={this.cityOptions()}
						value={this.state.city}
						onChange={e => this.setState({city: e.target.value})}
					/>
				</p>) : null
			}
			<Selector
				label="Sort by"
				options={{
					"None": '',
					"Length": "t_length",
					"Elevation Gain": "t_elevation_gain",
					"Popularity": "t_popularity"
				}}
				value={this.state.sort}
				onChange={e => this.setState({sort: e.target.value})}
			/>
			<p>
				{this.state.isDescending? "Descending" : "Ascending"}
				<input type="checkbox"
					value={this.state.isDescending}
					onChange={e => this.setState({isDescending: e.target.checked})}
				/>
			</p>

			<button onClick={this.search}>Search</button>
			{this.renderResults()}
		</span>);
	}
}