import sqlite3
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