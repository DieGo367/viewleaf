import React from 'react';
import Cookies from 'js-cookie';
import Comment from '../components/Comment';
import {get, post} from '../util.js';

export default class TrailViewPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			trailid: this.props.match.params.id,
			trail: {},
			commentText: '',
			comments: []
		};
	}

	componentDidMount() {
		get("/getTrail/"+this.state.trailid).then(data => {
			this.setState({trail: data});
		});
		this.loadComments();
	}

	loadComments() {
		let userString = "";
		let userid = Cookies.get("userid");
		if (userid !== undefined) userString = "?userid="+userid;
		get("/getTrailComments/"+this.state.trailid+userString).then(data => {
			this.setState({comments: data.comments});
		});
	}

	postComment = () => {
		if (this.state.commentText !== '') {
			post("/postcomment", {
				uid: Cookies.get("userid"),
				password: Cookies.get("password"),
				tid: this.state.trailid,
				text: this.state.commentText
			}).then(data => {
				if (data.success) {
					this.setState({commentText: ''});
					this.loadComments();
				}
				else alert("Failed to post comment");
			});
		}
	}

	postReply(comment, message) {
		if (message !== '') {
			post("/postcomment", {
				uid: Cookies.get("userid"),
				password: Cookies.get("password"),
				tid: this.state.trailid,
				text: message,
				replyTo: comment.c_commentid
			}).then(data => {
				if (data.success) this.loadComments();
				else alert("Failed to post reply");
			})
		}
	}

	vote(comment, direction) {
		post("/commentvote", {
			uid: Cookies.get("userid"),
			password: Cookies.get("password"),
			cid: comment.c_commentid,
			direction: direction
		}).then(() => this.loadComments());
	}

	renderMakeComment() {
		let userid = Cookies.get("userid");
		if (userid != null) {
			let username = Cookies.get("username");
			return (<span>
				Write a comment (as {username})
				<input type="text"
					value={this.state.commentText}
					onChange={e => this.setState({commentText: e.target.value})}
				/>
				<button onClick={this.postComment}>Post</button>
			</span>);
		}
		else return <p>You must login to post a comment</p>;
	}

	renderComments() {
		return this.state.comments.map((comment, i) => {
			return (<Comment key={i}
				data={comment}
				canInteract={Cookies.get("userid") !== undefined}
				onReply={(comment, message) => this.postReply(comment, message)}
				onVote={(comment, direction) => this.vote(comment, direction)}
			/>);
		});
	}

	render() {
		return (<span>
			<h1>{this.state.trail.t_name}</h1>
			<h2>{this.state.trail.t_park}</h2>
			<h3>{this.state.trail.t_city}, {this.state.trail.t_state}</h3>
			<p>Length: {this.state.trail.t_length}</p>
			<p>Elevation Gain: {this.state.trail.t_elevation_gain}</p>
			<p>Popularity: {this.state.trail.t_popularity}</p>
			<h2>Comments</h2>
			{this.renderMakeComment()}
			{this.renderComments()}
		</span>);
	}
}