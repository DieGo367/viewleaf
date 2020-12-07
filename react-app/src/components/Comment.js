import React from 'react';

export default class Comment extends React.Component {
	renderReplier() {
		let comment = this.props.data;
		if (this.props.canInteract) {
			return (<button onClick={e => {
				let replyText = prompt("Reply to "+comment.username+"'s comment: ")
				if (replyText !== null && replyText !== '') {
					if (typeof this.props.onReply === "function") this.props.onReply(comment, replyText);
				}
			}}>Reply</button>);
		}
		else return null;
	}
	renderReplies() {
		let comment = this.props.data;
		if (comment.replies && comment.replies.length > 0) {
			let replyComps = comment.replies.map((reply, i) => {
				return (<Comment key={i}
					data={reply}
					canInteract={this.props.canInteract}
					onReply={this.props.onReply}
					onVote={this.props.onVote}
				/>);
			});
			return (<div className="Comment.replies">
				<h4>Replies</h4>
				{replyComps}
			</div>);
		}
	}

	renderPhoto() {
		let comment = this.props.data;
		if (comment.photodata) {
			let url = "data:image/*;base64," + btoa(comment.photodata);
			return (<div style={{
				height: "15vw"
			}}>
				<img src={url} alt={"Photo posted by "+comment.username} className="Photo" />
			</div>);
		}
		else return null;
	}

	vote(comment, direction) {
		if (typeof this.props.onVote === "function") {
			this.props.onVote(comment, direction);
		}
	}
	renderVoting() {
		let comment = this.props.data;
		if (this.props.canInteract) {
			return (<span>
				<button onClick={e => this.vote(comment,"U")}>
					{comment.userVote === 'U'? "Remove Upvote" : "Upvote"}
				</button>
				<button onClick={e => this.vote(comment,"D")}>
					{comment.userVote === 'D'? "Remove Downvote" : "Downvote"}
				</button>
			</span>)	
		}
		else return null;
	}
	render() {
		let comment = this.props.data;
		return (
			<div className="Comment" style={{
				border: "5px solid black",
				margin: "25px"
			}}>
				<h3>{comment.username}</h3>
				<h4>{comment.c_date}</h4>
				<p>{comment.c_message}</p>
				{this.renderPhoto()}
				<p>
					(Votes: {comment.votes})
					{this.renderVoting()}
				</p>
				{this.renderReplier()}
				{this.renderReplies()}
			</div>
		);
	}
}