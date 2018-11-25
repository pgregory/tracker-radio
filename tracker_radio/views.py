from functools import wraps

from tracker_radio import app, db, login_manager, default_app
from flask import render_template, request, jsonify, abort
from flask_login import LoginManager, UserMixin, login_user, logout_user
import sqlalchemy
from sqlalchemy import func
from random import *
from firebase_admin import _utils, _token_gen

class Account(UserMixin, db.Model):

    __tablename__ = 'accounts'

    account_id = db.Column(db.Integer, primary_key=True)
    firebase_user_id = db.Column(db.Text, unique=True)
    email = db.Column(db.Text, unique=True, nullable=False)
    email_verified = db.Column(db.Boolean, default=False, nullable=False)
    name = db.Column(db.Text)
    photo_url = db.Column(db.Text)

    def get_id(self):
        return self.account_id

@login_manager.user_loader
def load_user(account_id):
    return Account.query.get(account_id)


@login_manager.unauthorized_handler
def authentication_required():
    return auth.url_for('widget', mode='select', next=request.url)

def token_required(f):  
    @wraps(f)
    def _verify(*args, **kwargs):
        auth_headers = request.headers.get('Authorization', '').split()

        invalid_msg = {
            'message': 'Invalid token. Registeration and / or authentication required',
            'authenticated': False
        }
        expired_msg = {
            'message': 'Expired token. Reauthentication required.',
            'authenticated': False
        }

        if len(auth_headers) != 2:
            return jsonify(invalid_msg), 401

        try:
            token = auth_headers[1]
            token_verifier = _token_gen.TokenVerifier(default_app)
            verified_claims = token_verifier.verify_id_token(token)
            user = Account.query.filter_by(firebase_user_id=verified_claims['uid']).first()
            if not user:
                raise RuntimeError('User not found')
            return f(user, *args, **kwargs)
        #except jwt.ExpiredSignatureError:
        #    return jsonify(expired_msg), 401 # 401 is Unauthorized HTTP status code
        except ValueError as e:
            print(e)
            return jsonify(invalid_msg), 401

    return _verify


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/random')
def random_number():
    response = {
            'randomNumber': randint(1, 100)
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
    from tracker_radio.models.track import Track, TrackSchema
    from tracker_radio.models.artist import Artist, ArtistSchema
    letter = request.args.get('letter', 'A')
    schema = ArtistSchema(many=True)
    if letter == 'All':
        artists = Artist.query.order_by(Artist.name).all()
    elif letter == '0-9':
        #artists = Artist.query.filter(func.substr(Artist.name, 1, 1) == 'A').order_by(Artist.name).all()
        artists = Artist.query.filter(sqlalchemy.not_(
            func.substr(Artist.name, 1, 1).in_([
                'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
                'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 
                'W', 'X', 'Y', 'Z'
            ]))).order_by(Artist.name).all()
        print(artists)
    else:
        artists = Artist.query.filter(Artist.name.like('{}%'.format(letter))).order_by(Artist.name).all()
    return schema.dumps(artists)

@app.route('/api/artists', methods=['POST'])
def post_artists():
    from tracker_radio.models.track import Track, TrackSchema
    from tracker_radio.models.artist import Artist, ArtistSchema
    if not request.json:
        abort(400)
    schema = ArtistSchema(many=True)
    result = schema.load(request.json)
    for artist in result.data:
        existing = Artist.query.filter_by(name = artist.name)
        # TODO: Need to work out a strategy for updating.
        if existing.count() == 0:
            db.session.add(artist)
            db.session.commit()
    return jsonify({'success': True}), 201

@app.route('/api/artists/<int:artist_id>', methods=['GET'])
def get_artist(artist_id):
    from tracker_radio.models.track import Track, TrackSchema
    from tracker_radio.models.artist import Artist, ArtistSchema
    schema = ArtistSchema()
    artist = Artist.get_by_id(artist_id)
    if not artist:
        abort(404)
    return schema.dumps(artist)

@app.route('/api/artists/<int:artist_id>/tracks', methods=['GET'])
def get_artist_tracks(artist_id):
    from tracker_radio.models.track import Track, TrackSchema
    from tracker_radio.models.artist import Artist, ArtistSchema
    schema = TrackSchema(many=True)
    artist = Artist.query.filter_by(id=artist_id).first()
    if not artist:
        abort(404)
    tracks = artist.tracks
    return schema.dumps(tracks)

@app.route('/api/tracks', methods=['GET'])
def get_tracks():
    from tracker_radio.models.track import Track, TrackSchema
    schema = TrackSchema(many=True)
    tracks = Track.query.order_by(Track.title).fetch(5)
    return schema.dumps(tracks)

@app.route('/api/tracks/<int:track_id>', methods=['GET'])
def get_track(track_id):
    from tracker_radio.models.track import Track, TrackSchema
    schema = TrackSchema()
    track = Track.query.filter_by(id=track_id).first()
    if track:
        return schema.dumps(track)
    else:
        return jsonify({'success': False, 'msg': 'Not found'}), 404

@app.route('/api/tracks', methods=['POST'])
def post_tracks():
    from tracker_radio.models.track import Track, TrackSchema
    if not request.json:
        abort(400)
    schema = TrackSchema(many=True)
    result = schema.load(request.json)
    if not result.errors:
        for track in result.data:
            existing = Track.query.filter_by(location = track.location)
            # TODO: Need to work out a strategy for updating.
            if existing.count() == 0:
                db.session.add(track)
                db.session.commit()
        return jsonify({'success': True}), 201
    else:
        print(result.errors)
        return jsonify(result.errors), 400

@app.route('/api/tracks/<int:track_id>/rate', methods=['POST'])
@token_required
def rate_track(user, track_id):
    from tracker_radio.models.rating import Rating
    data = request.json
    rating = Rating.query.filter_by(track_id=track_id, user_id=user.account_id).first()
    if rating:
        rating.rating = data['rating']
    else:
        rating = Rating(track_id=track_id, user_id=user.account_id, rating=data['rating'])
    db.session.add(rating)
    db.session.commit()
    return jsonify({'success': True}), 201

@app.route('/api/signin', methods=['POST'])
def signin():
    auth_headers = request.headers.get('Authorization', '').split()

    invalid_msg = {
        'message': 'Invalid token. Registeration and / or authentication required',
        'authenticated': False
    }
    created_msg = {
        'message': 'User account created.',
        'authenticated': True
    }
    signed_in_msg = {
        'message': 'User signed in.',
        'authenticated': True
    }

    if len(auth_headers) != 2:
        return jsonify(invalid_msg), 401

    try:
        token = auth_headers[1]
        token_verifier = _token_gen.TokenVerifier(default_app)
        verified_claims = token_verifier.verify_id_token(token)
        user = Account.query.filter_by(firebase_user_id=verified_claims['uid']).first()
        if not user:
            user = Account(firebase_user_id=verified_claims['uid'], 
                    email = verified_claims['email'],
                    email_verified = verified_claims['email_verified'],
                    name = verified_claims['name'],
                    photo_url = verified_claims['picture']
                    )
            db.session.add(user)
            db.session.commit()
            return jsonify(created_msg), 201
    except ValueError as e:
        return jsonify(invalid_msg), 401

    return jsonify(signed_in_msg), 200
    
