import {Switch, Route} from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import TrailPage from './pages/TrailPage';

export default function Routes() {
	return (
		<Switch>
			<Route exact path="/" component={LandingPage} />
			<Route exact path="/trails" component={TrailPage} />
		</Switch>
	);
}