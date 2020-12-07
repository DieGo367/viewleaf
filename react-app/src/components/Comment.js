import {useHistory} from 'react-router-dom';

export default function Comment(props) {
	let history = useHistory();
	let comment = props.data;
	let replier = null, voting = null;
	if (props.canInteract) {
		replier = <button onClick={e => {
			let replyText = prompt("Reply to "+comment.username+"'s comment: ")
			if (replyText !== null && replyText !== '') {
				if (typeof props.onReply === "function") props.onReply(comment, replyText);
			}
		}}>Reply</button>;
		function vote(comment, direction) {
			if (typeof props.onVote === "function") {
				props.onVote(comment, direction);
			}
		}
		voting = (<span>
			<button onClick={e => vote(comment,"U")}>
				{comment.userVote === 'U'? "Remove Upvote" : "Upvote"}
			</button>
			<button onClick={e => vote(comment,"D")}>
				{comment.userVote === 'D'? "Remove Downvote" : "Downvote"}
			</button>
		</span>);
	}
	let replies = null;
	if (comment.replies && comment.replies.length > 0) {
		let replyComps = comment.replies.map((reply, i) => {
			return (<Comment key={i}
				data={reply}
				canInteract={props.canInteract}
				onReply={props.onReply}
				onVote={props.onVote}
			/>);
		});
		replies = (<div className="Comment.replies">
			<h4>Replies</h4>
			{replyComps}
		</div>);
	}
	return (
		<div className="Comment" style={{
			border: "5px solid black",
			margin: "25px"
		}}>
			<h3>{comment.username}</h3>
			<h4>{comment.c_date}</h4>
			<p>{comment.c_message}</p>
			<p>
				(Votes: {comment.votes})
				{voting}
			</p>
			{replier}
			{replies}
		</div>
	);
}