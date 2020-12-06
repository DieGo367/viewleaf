import Link from '../components/Link';

export default function LandingPage() {
	return (<span>
		<h1>Trail Viewer</h1>
		<p>
			<Link to="/login">Login</Link>
		</p>
		<p>
			<Link to="/trails">Trails</Link>
		</p>
	</span>);
}