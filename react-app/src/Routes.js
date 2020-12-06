import {Switch, Route} from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import TrailSearchPage from './pages/TrailSearchPage';
import TrailViewPage from './pages/TrailViewPage';

export default function Routes() {
	return (
		<Switch>
			<Route exact path="/" component={LandingPage} />
			<Route exact path="/login" component={LoginPage} />
			<Route exact path="/trails" component={TrailSearchPage} />
			<Route path="/trail/:id" component={TrailViewPage} />
		</Switch>
	);
}