export default function Selector(props) {
	let options = Object.entries(props.options).map((items, i) => {
		let [name, value] = items;
		return <option key={i} value={value}>{name}</option>;
	});
	let change = props.onChange || (e => { });
	return (<span className="Selector">
		{props.label}
		<select value={props.value} onChange={e => change(e)}>
			{options}
		</select>
	</span>);
}