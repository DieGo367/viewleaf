import React from 'react';
import Cookies from 'js-cookie';
import Comment from '../components/Comment';
import Selector from '../components/Selector';
import {get, post} from '../util.js';
import './TrailViewPage.css';

export default class TrailViewPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			trailid: this.props.match.params.id,
			trail: {},
			comments: [],
			photos: [],

			commentText: '',
			photo: null,

			userPlans: {},
			plan: ''
		};
	}

	componentDidMount() {
		get("/getTrail/"+this.state.trailid).then(data => {
			this.setState({trail: data});
		});
		this.loadPhotos(true);
		let userid = Cookies.get("userid");
		if (userid !== undefined) {
			post("/getPlans", {
				uid: userid,
				password: Cookies.get("password")
			}).then(data => {
				if (data.success) {
					let userPlans = {"-plan-": ''};
					data.plans.forEach(plan => {
						userPlans[plan["p_name"]] = plan["p_planid"]
					});
					this.setState({userPlans: userPlans});
				}
			});
		}
	}

	loadPhotos(next) {
		get("/getTrailPhotos/"+this.state.trailid).then(data => {
			this.setState({photos: data.photos});
			if (next) this.loadComments();
		});
	}

	loadComments() {
		let userString = "";
		let userid = Cookies.get("userid");
		if (userid !== undefined) userString = "?userid="+userid;
		get("/getTrailComments/"+this.state.trailid+userString).then(data => {
			let comments = data.comments.map(comment => {
				this.state.photos.forEach(photo => {
					if (comment.c_commentid === photo.ph_commentid) {
						comment.photodata = photo.ph_photodata;
					}
				});
				return comment;
			});
			this.setState({comments: comments});
		});
	}

	postComment = () => {
		if (this.state.commentText !== '') {
			post("/postcomment", {
				uid: Cookies.get("userid"),
				password: Cookies.get("password"),
				tid: this.state.trailid,
				text: this.state.commentText,
				photo: this.state.photo
			}).then(data => {
				if (data.success) {
					if (this.state.photo) this.loadPhotos(true);
					else this.loadComments();
					this.setState({
						commentText: '',
						photo: null
					});
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

	addToPlan = () => {
		if (this.state.plan != '') {
			post("/addToPlan", {
				uid: Cookies.get("userid"),
				password: Cookies.get("password"),
				tid: this.state.trailid,
				pid: this.state.plan
			}).then(data => {
				if (data.success) alert("Added!");
				else alert("Failed to add to plan");
			})
		}
	}

	renderPlanAdder() {
		if (Cookies.get("userid") !== undefined) {
			return (<div>
				<Selector
					value={this.state.plan}
					options={this.state.userPlans}
					onChange={e => this.setState({plan: e.target.value})}
				/>
				<button onClick={this.addToPlan}>Add to Plan</button>
			</div>);
		}
		else return null;
	}

	renderPhotos() {
		let photos = this.state.photos.map((photo, i) => {
			let url = "data:image/*;base64," + btoa(photo.ph_photodata);
			return <img key={i} src={url} alt="photo" className="Photo" />;
		});
		return (<div className="TrailViewPage-Photos">
			{photos}
		</div>)
	}

	loadFile(photo) {
		let reader = new FileReader();
		reader.onload = e => {
			this.setState({photo: e.target.result})
		}
		reader.readAsBinaryString(photo);
	}

	renderMakeComment() {
		let userid = Cookies.get("userid");
		if (userid != null) {
			let username = Cookies.get("username");
			return (<span>
				Write a comment (as {username})
				<p>
					<input type="text"
						value={this.state.commentText}
						onChange={e => this.setState({commentText: e.target.value})}
					/>
				</p>
				<p>
					Add a photo?
					<input type="file"
						accept="image/png, image/jpeg"
						onChange={e => this.loadFile(e.target.files[0])}
					/>
				</p>
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
			{this.renderPlanAdder()}
			<h2>Photos</h2>
			{this.renderPhotos()}
			<h2>Comments</h2>
			{this.renderMakeComment()}
			{this.renderComments()}
		</span>);
	}
}