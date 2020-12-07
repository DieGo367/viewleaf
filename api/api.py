import sqlite3
from datetime import datetime
from flask import Flask
from flask import request

app = Flask(__name__)

def dict_factory(cursor, row):
	d = {}
	for i, col in enumerate(cursor.description):
		d[col[0]] = row[i]
	return d

def connect(obj=False):
	conn = sqlite3.connect("../data/data.sqlite")
	if obj:
		conn.row_factory = dict_factory
	return conn, conn.cursor()

@app.route('/search', methods=["POST"])
def search_trail():
	data = request.get_json()
	conn, c = connect(True)

	words = data["q"].split(" ")
	conditions = ''.join(["AND (t_name LIKE ? OR t_park LIKE ?) " for word in words])
	variables = []
	for word in words:
		variables.append(f"%{word}%")
		variables.append(f"%{word}%")
	
	if data["state"] != '':
		conditions += "AND t_state = ? "
		variables.append(data["state"])

	if data["city"] != '':
		conditions += "AND t_city = ? "
		variables.append(data["city"])
	
	ordering = "ORDER BY t_trailid "
	if data["sort"] in ["t_length", "t_elevation_gain", "t_popularity"]:
		ordering = "ORDER BY " + data["sort"] + " "
	if data["isDescending"]:
		ordering += "DESC "

	c.execute(
		"SELECT * FROM Trail "
		"WHERE t_trailid IS NOT NULL "
		f"{conditions}"
		f"{ordering}"
		"LIMIT 10; ",
		tuple(variables)
	)
	results = {"results": c.fetchall()}
	conn.close()
	return results

@app.route('/getStates')
def get_states():
	conn, c = connect()
	c.execute(
		"SELECT t_state, t_city FROM Trail "
		"GROUP BY t_city ORDER BY t_state, t_city;"
	)
	states = {}
	for row in c.fetchall():
		state, city = row
		if state not in states.keys():
			states[state] = []
		if city not in states[state]:
			states[state].append(city)
	conn.close()
	return states

@app.route('/getTrail/<int:id>')
def get_trail(id):
	conn, c = connect(True)
	c.execute(
		"SELECT * FROM Trail WHERE t_trailid = ?;",
		(id,)
	)
	trail = c.fetchall()[0]
	conn.close()
	if trail:
		return trail
	else:
		return "Not found", 404

@app.route('/login', methods=["POST"])
def login():
	data = request.get_json()
	conn, c = connect(True)
	
	c.execute(
		"SELECT * FROM User "
		"WHERE u_name = ? "
		"AND u_password = ?;",
		(data["username"], data["password"])
	)
	user = c.fetchone()
	conn.close()
	if user:
		user["success"] = True
		return user
	else:
		return {"success": False}, 404

@app.route('/signup', methods=["POST"])
def signup():
	data = request.get_json()
	if data["username"] and data["password"] and data["username"] != '' and data["password"] != '':
		conn, c = connect()
		c.execute("SELECT max(u_userid) FROM User;")
		max_uid = c.fetchone()[0]
		if max_uid:
			uid = max_uid + 1
		else:
			uid = 1

		c.execute(
			"INSERT INTO User(u_userid, u_name, u_password) "
			"VALUES (?, ?, ?);",
			(uid, data["username"], data["password"])
		)
		conn.commit()
		conn.close()
		return {
			"success": True,
			"u_name": data["username"],
			"u_password": data["password"],
			"u_userid": uid
		}
	else:
		return {"success": False}, 404

def get_user(id, password):
	conn, c = connect(True)
	c.execute(
		"SELECT * FROM User "
		"WHERE u_userid = ? "
		"AND u_password = ?;",
		(id, password)
	)
	user = c.fetchone()
	conn.close()
	return user

@app.route('/postcomment', methods=["POST"])
def post_comment():
	data = request.get_json()
	user = get_user(data["uid"], data["password"])
	if user:
		conn, c = connect()
		c.execute("SELECT max(c_commentid) FROM Comment;")
		max_cid = c.fetchone()[0]
		if max_cid:
			cid = max_cid + 1
		else:
			cid = 1
		if "replyTo" in data.keys():
			reply_id = data["replyTo"]
		else:
			reply_id = None
		c.execute(
			"INSERT INTO Comment(c_commentid, c_userid, c_trailid, c_date, c_message, c_reply_to) "
			"VALUES (?, ?, ?, ?, ?, ?);",
			(cid, data["uid"], data["tid"],
			datetime.now(), data["text"], reply_id)
		)
		conn.commit()
		conn.close()
		return {"success": True}
	else:
		return {"success": False}, 404

def comment_data(c, comment, user):
	# get username of poster
	c.execute("SELECT u_name FROM User WHERE u_userid = ?;", (comment["c_userid"],))
	comment["username"] = c.fetchone()["u_name"]
	# get upvote score
	c.execute(
		"SELECT 0+sum(CASE "
		"	WHEN cv_vote = 'U' THEN 1 "
		"	WHEN cv_vote = 'D' THEN -1 "
		"END) AS score "
		"FROM CommentVote "
		"WHERE cv_commentid = ?;",
		(comment["c_commentid"],)
	)
	count = c.fetchone()
	comment["votes"] = count["score"]
	if comment["votes"] == None:
		comment["votes"] = 0
	# if user, check their upvote state
	if user != None and user != '':
		c.execute(
			"SELECT cv_vote FROM CommentVote "
			"WHERE cv_userid = ? "
			"AND cv_commentid = ?;",
			(user, comment["c_commentid"])
		)
		vote = c.fetchone()
		if vote:
			comment["userVote"] = vote["cv_vote"]
		else:
			comment["userVote"] = ''
	# get replies
	c.execute(
		"SELECT * FROM Comment "
		"WHERE c_trailid = ? AND c_reply_to = ?;",
		(comment["c_trailid"], comment["c_commentid"])
	)
	comment["replies"] = c.fetchall()
	for reply in comment["replies"]:
		comment_data(c, reply, user)

@app.route("/getTrailComments/<int:id>")
def get_trail_comments(id):
	user = request.args.get("userid")
	conn, c = connect(True)
	c.execute(
		"SELECT * FROM Comment "
		"WHERE c_trailid = ? AND c_reply_to IS NULL ORDER BY c_date DESC;",
		(id,)
	)
	comments = c.fetchall()
	for comment in comments:
		comment_data(c, comment, user)
	conn.close()
	return {"comments": comments}

@app.route("/commentvote", methods=["POST"])
def commentvote():
	data = request.get_json()
	user = get_user(data["uid"], data["password"])
	if user:
		conn, c = connect(True)
		c.execute(
			"SELECT cv_vote FROM CommentVote "
			"WHERE cv_userid = ? "
			"AND cv_commentid = ?;",
			(data["uid"], data["cid"])
		)
		vote = c.fetchone()
		if vote:
			previous_vote = vote["cv_vote"]
			if data["direction"] == previous_vote:
				# remove vote
				c.execute(
					"DELETE FROM CommentVote "
					"WHERE cv_userid = ? "
					"AND cv_commentid = ?;",
					(data["uid"], data["cid"])
				)
				conn.commit()
			else:
				# update vote
				c.execute(
					"UPDATE CommentVote "
					"SET cv_vote = ? "
					"WHERE cv_userid = ? "
					"AND cv_commentid = ?;",
					(data["direction"], data["uid"], data["cid"])
				)
		else:
			# create vote
			c.execute(
				"INSERT INTO CommentVote(cv_commentid, cv_userid, cv_vote) "
				"VALUES (?, ?, ?);",
				(data["cid"], data["uid"], data["direction"])
			)
			conn.commit()
		conn.close()
		return {"success": True}
	else:
		return {"success": False}, 404