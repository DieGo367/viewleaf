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
		logInOut = <Link to="/" onClick={logout}><button>Logout</button></Link>;
	}
	else {
		logInOut = <Link to="/login"><button>Login</button></Link>;
	}
	return (<span>
		<h1>Trail Viewer</h1>
		<p>{logInOut}</p>
		<p><Link to="/trails"><button>Search Trails</button></Link></p>
		<p><Link to="/plans"><button>Make Plans</button></Link></p>
	</span>);
}