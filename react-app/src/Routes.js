import {Switch, Route} from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import TrailSearchPage from './pages/TrailSearchPage';
import TrailViewPage from './pages/TrailViewPage';

export default function Routes() {
	return (
		<Switch>
			<Route exact path="/" component={LandingPage} />
			<Route exact path="/trails" component={TrailSearchPage} />
			<Route path="/trail/:id" component={TrailViewPage} />
		</Switch>
	);
}