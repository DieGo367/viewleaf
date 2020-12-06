import Link from '../components/Link';
import Cookies from 'js-cookie';

export default function LandingPage() {
	function logout() {
		Cookies.remove("username");
		Cookies.remove("password");
		Cookies.remove("userid");
	}
	let logInOut;
	if (Cookies.get("userid") != null) {
		logInOut = <Link to="/" onClick={logout}>Logout</Link>;
	}
	else {
		logInOut = <Link to="/login">Login</Link>;
	}
	return (<span>
		<h1>Trail Viewer</h1>
		<p>{logInOut}</p>
		<p><Link to="/trails">Trails</Link></p>
	</span>);
}