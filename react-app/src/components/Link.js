import {useHistory} from 'react-router-dom';

export default function Link(props) {
	let history = useHistory();
	return (
		<span
			class="Link"
			onClick={() => {
				history.push(props.to);
			}}
		>{props.children}</span>
	);
}