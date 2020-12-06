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

@app.route('/search',methods=["POST"])
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