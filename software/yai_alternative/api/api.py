from flask import Flask
from flask_cors import CORS, cross_origin

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'

cors = CORS(app, resources={r"/foo": {"origins": "*"}})


@app.route('/hello')
@cross_origin(origin='localhost:5000', headers=['Content- Type'])
def hello_world():
    return ('HEY! HELLO WORLD!')
