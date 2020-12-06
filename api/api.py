from flask import Flask
from flask import request

app = Flask(__name__)

@app.route('/hw')
def hello():
	return "Hello World!"