import {Switch, Route} from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import TrailSearchPage from './pages/TrailSearchPage';
import TrailViewPage from './pages/TrailViewPage';
import PlansPage from './pages/PlansPage';

export default function Routes() {
	return (
		<Switch>
			<Route exact path="/" component={LandingPage} />
			<Route exact path="/login" component={LoginPage} />
			<Route exact path="/signup" component={SignupPage} />
			<Route exact path="/trails" component={TrailSearchPage} />
			<Route path="/trail/:id" component={TrailViewPage} />
			<Route exact path="/plans" component={PlansPage} />
		</Switch>
	);
}