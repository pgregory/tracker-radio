from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
import sqlalchemy

from flask_firebase.flask_firebase import FirebaseAuth
from flask_login import LoginManager

app = Flask(__name__, static_folder = "./static")
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

if app.debug:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://indigobeetle:tr4ck3r-r4d10@indigobeetle.mysql.pythonanywhere-services.com/indigobeetle$trackerradio'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_POOL_RECYCLE'] = 280
db = SQLAlchemy(app)
app.secret_key = 'super secret key'
app.config['FIREBASE_API_KEY'] = 'AIzaSyBpiuyGfSBMAUKFOKEce-oEWDAvvf5sGTE'
app.config['FIREBASE_PROJECT_ID'] = 'trackerradio'
app.config['FIREBASE_AUTH_SIGN_IN_OPTIONS'] = 'email,google'
auth = FirebaseAuth(app)
login_manager = LoginManager(app)

app.register_blueprint(auth.blueprint, url_prefix='/auth')

import tracker_radio.views
