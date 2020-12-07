import {useHistory} from 'react-router-dom';

export default function Comment(props) {
	let history = useHistory();
	let comment = props.data;
	let replier = null;
	if (props.canReply) {
		replier = <button onClick={e => {
			let replyText = prompt("Reply to "+comment.username+"'s comment: ")
			if (replyText !== null && replyText != '') {
				if (typeof props.onReply === "function") props.onReply(comment, replyText);
			}
		}}>Reply</button>
	}
	let replies = null;
	if (comment.replies && comment.replies.length > 0) {
		let replyComps = comment.replies.map((reply, i) => {
			return <Comment key={i} data={reply} />;
		});
		replies = (<div className="Comment.replies">
			<h4>Replies</h4>
			{replyComps}
		</div>);
	}
	return (
		<div className="Comment">
			<h3>{comment.username}</h3>
			<h4>{comment.c_date}</h4>
			<p>{comment.c_message}</p>
			{replier}
			{replies}
		</div>
	);
}