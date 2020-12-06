import {useHistory} from 'react-router-dom';

export default function Link(props) {
	let history = useHistory();
	return (
		<span
			className="Link"
			onClick={e => {
				if (typeof props.onClick === "function") props.onClick(e);
				history.push(props.to);
			}}
		>{props.children}</span>
	);
}