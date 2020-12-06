import Link from '../components/Link';

export default function TrailSearchResult(props) {
	return (<div className="TrailSearchResult">
		<Link to={"/trail/" + props.data.t_trailid}>
			<p>{props.data.t_name}</p>
		</Link>
		<p>{props.data.t_park}</p>
		<p>{props.data.t_city}, {props.data.t_state}</p>
		<p>Rating: {props.data.t_popularity}</p>
		<p>Length: {props.data.t_length}</p>
		<p>Elevation Gain: {props.data.t_elevation_gain}</p>
	</div>);
}