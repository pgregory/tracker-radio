from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
import sqlalchemy

from flask_login import LoginManager

import firebase_admin
from firebase_admin import credentials

app = Flask(__name__, static_folder = "./static")
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

if app.debug:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db/test.db'
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://indigobeetle:tr4ck3r-r4d10@indigobeetle.mysql.pythonanywhere-services.com/indigobeetle$trackerradio'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_POOL_RECYCLE'] = 280
db = SQLAlchemy(app)
app.secret_key = 'super secret key'
login_manager = LoginManager(app)

default_app = None

if (not len(firebase_admin._apps)):
    cred = credentials.Certificate('./trackerradio-firebase-adminsdk-1mpyw-4a60ca93be.json')
    default_app = firebase_admin.initialize_app(cred)

import tracker_radio.views
