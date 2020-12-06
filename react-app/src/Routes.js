import {Switch, Route} from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import TrailSearchPage from './pages/TrailSearchPage';

export default function Routes() {
	return (
		<Switch>
			<Route exact path="/" component={LandingPage} />
			<Route exact path="/trails" component={TrailSearchPage} />
		</Switch>
	);
}