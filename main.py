from flask import Flask, render_template, request, jsonify, abort
from flask_cors import CORS
#import google.auth.transport.requests
#import google.oauth2.id_token
#import requests_toolbelt.adapters.appengine
from flask_sqlalchemy import SQLAlchemy

from random import *


# Use the App Engine Requests adapter. This makes sure that Requests uses
# URLFetch.
#requests_toolbelt.adapters.appengine.monkeypatch()
#HTTP_REQUEST = google.auth.transport.requests.Request()

app = Flask(__name__, static_folder = "./static")
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

if app.debug:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://indigobeetle:tr4ck3r-r4d10@indigobeetle.mysql.pythonanywhere-services.com/indigobeetle$trackerradio'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/form')
def form():
    return render_template('form.html')

@app.route('/submitted', methods=['POST'])
def submitted_form():
    from models.track import Track, TrackSchema
    from models.artist import Artist, ArtistSchema
    name = request.form['name']

    artist = Artist(name=name)
    artist.put()
    return render_template(
            'submitted_form.html',
            name=name)

@app.route('/api/random')
def random_number():
    response = {
            'randomNumber': randint(1, 100)
            }
    return jsonify(response)

#@app.route('/api/user')
#def get_current_user():
#    id_token = request.headers['Authorization'].split(' ').pop()
#    claims = google.oauth2.id_token.verify_firebase_token(
#        id_token, HTTP_REQUEST) 
#    print(claims)
#    response = {
#            'user': users.get_current_user()
#            }
#    return jsonify(response)

import requests

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    if app.debug:
        return requests.get('http://localhost:8081/{}'.format(path)).text
    return render_template("index.html")

@app.route('/api/artists', methods=['GET'])
def get_artists():
    from models.track import Track, TrackSchema
    from models.artist import Artist, ArtistSchema
    letter = request.args.get('letter', 'A')
    schema = ArtistSchema(many=True)
    if letter == '0-9':
        artists = Artist.query.filter(Artist.name.startswith('A')).order_by(Artist.name).all()
    else:
        artists = Artist.query.filter(Artist.name.startswith(letter)).order_by(Artist.name).all()
    return schema.dumps(artists)

@app.route('/api/artists', methods=['POST'])
def post_artists():
    from models.track import Track, TrackSchema
    from models.artist import Artist, ArtistSchema
    if not request.json:
        abort(400)
    schema = ArtistSchema(many=True)
    result = schema.load(request.json)
    for artist in result.data:
        existing = Artist.query.filter_by(name = artist.name).first()
        if existing:
            existing.populate(**artist.to_dict())
            db.session.commit()
        else:
            db.session.add(artist)
            db.session.commit()
    return jsonify({'success': True}), 201

@app.route('/api/artists/<int:artist_id>', methods=['GET'])
def get_artist(artist_id):
    from models.track import Track, TrackSchema
    from models.artist import Artist, ArtistSchema
    schema = ArtistSchema()
    artist = Artist.get_by_id(artist_id)
    if not artist:
        abort(404)
    return schema.dumps(artist)

@app.route('/api/artists/<int:artist_id>/tracks', methods=['GET'])
def get_artist_tracks(artist_id):
    from models.track import Track, TrackSchema
    from models.artist import Artist, ArtistSchema
    schema = TrackSchema(many=True)
    artist = Artist.query.filter_by(id=artist_id).first()
    if not artist:
        abort(404)
    tracks = artist.tracks
    return schema.dumps(tracks)

@app.route('/api/tracks', methods=['GET'])
def get_tracks():
    from models.track import Track, TrackSchema
    schema = TrackSchema(many=True)
    tracks = Track.query().order(Track.title).fetch(5)
    return schema.dumps(tracks)

@app.route('/api/tracks', methods=['POST'])
def post_tracks():
    from models.track import Track, TrackSchema
    if not request.json:
        abort(400)
    schema = TrackSchema(many=True)
    result = schema.load(request.json)
    if not result.errors:
        for track in result.data:
            existing = Track.query.filter_by(location = track.location).first()
            if existing:
                existing.populate(**track.to_dict())
                db.session.commit()
            else:
                db.session.add(track)
                db.session.commit()
        return jsonify({'success': True}), 201
    else:
        return jsonify(result.errors), 400
