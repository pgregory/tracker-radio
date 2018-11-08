from flask import Flask, render_template, request, jsonify, abort
from flask_cors import CORS
from google.appengine.api import users
from google.appengine.ext import ndb
import google.auth.transport.requests
import google.oauth2.id_token
import requests_toolbelt.adapters.appengine

from random import *

from models.artist import Artist, ArtistSchema
from models.track import Track, TrackSchema

# Use the App Engine Requests adapter. This makes sure that Requests uses
# URLFetch.
requests_toolbelt.adapters.appengine.monkeypatch()
HTTP_REQUEST = google.auth.transport.requests.Request()

app = Flask(__name__,
        static_folder = "./static")
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/form')
def form():
    return render_template('form.html')

@app.route('/submitted', methods=['POST'])
def submitted_form():
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

@app.route('/api/user')
def get_current_user():
    id_token = request.headers['Authorization'].split(' ').pop()
    claims = google.oauth2.id_token.verify_firebase_token(
        id_token, HTTP_REQUEST) 
    print(claims)
    response = {
            'user': users.get_current_user()
            }
    return jsonify(response)

import requests

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    if app.debug:
        return requests.get('http://localhost:8081/{}'.format(path)).text
    return render_template("index.html")

@app.route('/api/artists', methods=['GET'])
def get_artists():
    letter = request.args.get('letter', 'A')
    schema = ArtistSchema(many=True)
    if letter == '0-9':
        artists = Artist.query().filter(Artist.name < 'A').order(Artist.name).fetch()
    else:
        artists = Artist.query().filter(Artist.name >= letter).filter(Artist.name <= letter + u'\ufffd').order(Artist.name).fetch()
    return schema.dumps(artists)

@app.route('/api/artists', methods=['POST'])
def post_artists():
    if not request.json:
        abort(400)
    schema = ArtistSchema(many=True)
    result = schema.load(request.json)
    for artist in result.data:
        artist.put()
    return jsonify({'success': True}), 201

@app.route('/api/artists/<int:artist_id>', methods=['GET'])
def get_artist(artist_id):
    schema = ArtistSchema()
    artist = Artist.get_by_id(artist_id)
    if not artist:
        abort(404)
    return schema.dumps(artist)

@app.route('/api/artists/<int:artist_id>/tracks', methods=['GET'])
def get_artist_tracks(artist_id):
    schema = TrackSchema(many=True)
    artist = Artist.get_by_id(artist_id)
    if not artist:
        abort(404)
    tracks = artist.tracks
    return schema.dumps(tracks)

@app.route('/api/tracks', methods=['GET'])
def get_tracks():
    schema = TrackSchema(many=True)
    tracks = Track.query().order(Track.title).fetch(5)
    return schema.dumps(tracks)

@app.route('/api/tracks', methods=['POST'])
def post_tracks():
    if not request.json:
        abort(400)
    schema = TrackSchema(many=True)
    result = schema.load(request.json)
    for track in result.data:
        track.put()
    return jsonify({'success': True}), 201
