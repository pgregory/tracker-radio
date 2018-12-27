from functools import wraps

from tracker_radio import app, db, login_manager, default_app
from flask import render_template, request, jsonify, abort, redirect
from flask_login import LoginManager, login_user, logout_user
import sqlalchemy
from sqlalchemy import func
from random import *
from firebase_admin import _utils, _token_gen

from tracker_radio.models import (Track, TrackSchema, Artist, 
        ArtistSchema, Rating, Account, Favourite, Feedback,
        Playlist, PlaylistSchema)

auto_playlists = {
    'favourites': {
        'title': 'Favourites',
        'id': 'favourites',
        'ref': -1
    }
}

@login_manager.user_loader
def load_user(account_id):
    return Account.query.get(account_id)

@login_manager.unauthorized_handler
def authentication_required():
    return auth.url_for('widget', mode='select', next=request.url)

class AuthenticationError(Exception):
    CODE_INVALID = 0
    CODE_EXPIRED = 1

    def __init__(self, code, message):
        self.code = code
        self.message = message

def get_user_from_token(request):
    auth_headers = request.headers.get('Authorization', '').split()

    if len(auth_headers) != 2:
        raise AuthenticationError(AuthenticationError.CODE_INVALID, 
                'Invalid Authorization header')

    try:
        token = auth_headers[1]
        token_verifier = _token_gen.TokenVerifier(default_app)
        verified_claims = token_verifier.verify_id_token(token)
        user = Account.query.filter_by(firebase_user_id=verified_claims['uid']).first()
        if not user:
            raise AuthenticationError(AuthenticationError.CODE_INVALID, 
                    'User not found')
        return user
    except ValueError as e:
        raise AuthenticationError(AuthenticationError.CODE_INVALID, str(e))


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

        try:
            user = get_user_from_token(request)
            return f(user, *args, **kwargs)
        except AuthenticationError as e:
            if e.code == AuthenticationError.CODE_INVALID:
                return jsonify(invalid_msg), 401

    return _verify


@app.route('/')
def index():
    return redirect('/artists')

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
    schema = ArtistSchema()
    artist = Artist.query.filter_by(id=artist_id).first()
    if not artist:
        abort(404)
    return schema.dumps(artist)

@app.route('/api/artists/<int:artist_id>/tracks', methods=['GET'])
def get_artist_tracks(artist_id):
    schema = TrackSchema(many=True)
    artist = Artist.query.filter_by(id=artist_id).first()
    if not artist:
        abort(404)
    tracks = artist.tracks
    return schema.dumps(tracks)

@app.route('/api/tracks', methods=['GET'])
def get_tracks():
    schema = TrackSchema(many=True)
    tracks = Track.query.order_by(Track.title).fetch(5)
    return schema.dumps(tracks)

@app.route('/api/tracks/<int:track_id>', methods=['GET'])
def get_track(track_id):
    schema = TrackSchema()
    track = Track.query.filter_by(id=track_id).first()
    if track:
        return schema.dumps(track)
    else:
        return jsonify({'success': False, 'msg': 'Not found'}), 404

@app.route('/api/tracks', methods=['POST'])
def post_tracks():
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
    data = request.json
    # TODO: Need to confirm existence of track.
    rating = Rating.query.filter_by(track_id=track_id, user_id=user.account_id).first()
    if rating:
        rating.rating = data['rating']
    else:
        rating = Rating(track_id=track_id, user_id=user.account_id, rating=data['rating'])
    db.session.add(rating)
    db.session.commit()
    return jsonify({'success': True}), 201

@app.route('/api/tracks/<int:track_id>/favourite', methods=['POST'])
@token_required
def favourite_track(user, track_id):
    data = request.json
    favourite = Favourite.query.filter_by(track_id=track_id, user_id=user.account_id).first()
    if not favourite:
        favourite = Favourite(track_id=track_id, user_id=user.account_id)
        db.session.add(favourite)
        db.session.commit()
    return jsonify({'success': True}), 201

@app.route('/api/tracks/<int:track_id>/favourite', methods=['GET'])
@token_required
def get_track_is_favourite(user, track_id):
    favourite = Favourite.query.filter_by(track_id=track_id, user_id=user.account_id).count()
    if favourite:
        return jsonify({'favourite': True}), 200
    else:
        return jsonify({'favourite': False}), 200

@app.route('/api/playlists', methods=['POST'])
@token_required
def post_playlist(user):
    if not request.json:
        abort(400)
    schema = PlaylistSchema()
    playlist = schema.load(request.json)
    if not playlist.errors:
        existing = Playlist.query.filter_by(owner_id=user.account_id, title=playlist.data.title)
        # TODO: Need to work out a strategy for updating.
        if existing.count() == 0:
            playlist.data.owner_id = user.account_id
            db.session.add(playlist.data)
            db.session.commit()
        return jsonify({'success': True}), 201
    else:
        print(playlist.errors)
        return jsonify(playlist.errors), 400

@app.route('/api/playlists/<int:playlist_id>/tracks/<int:track_id>', methods=['PUT'])
@token_required
def add_track_to_playlist(user, playlist_id, track_id):
    data = request.json
    playlist = Playlist.query.filter_by(id=playlist_id, owner_id=user.account_id).first()
    if playlist:
        track = Track.query.filter_by(id=track_id).first()
        if track:
            playlist.tracks.append(track)
            db.session.add(playlist)
            db.session.commit()
            return jsonify({'success': True}), 201
    return jsonify({'success': False}), 404

@app.route('/api/playlists/<int:playlist_id>/tracks/<int:track_id>', methods=['DELETE'])
@token_required
def remove_track_from_playlist(user, playlist_id, track_id):
    data = request.json
    playlist = Playlist.query.filter_by(id=playlist_id, owner_id=user.account_id).first()
    if playlist:
        track = Track.query.filter_by(id=track_id).first()
        if track in playlist.tracks:
            playlist.tracks.remove(track)
            db.session.add(playlist)
            db.session.commit()
            return jsonify({'success': True}), 200
    return jsonify({'success': False}), 404

@app.route('/api/playlists', methods=['GET'])
def get_playlists():
    try:
        user = get_user_from_token(request)
    except AuthenticationError:
        user = None

    if user:
        schema = PlaylistSchema(many=True)
        playlists = Playlist.query.filter_by(owner_id=user.account_id).all()
        return schema.dumps(playlists)
    else:
        return jsonify({'success': False}), 400

@app.route('/api/autoplaylists', methods=['GET'])
def get_auto_playlists():
    return jsonify([v for k, v in auto_playlists.items()]), 200

@app.route('/api/playlists/<int:playlist_id>', methods=['GET'])
@token_required
def get_playlist(user, playlist_id):
    pl = Playlist.query.filter_by(owner_id=user.account_id, id=playlist_id).first()
    if pl:
        schema = PlaylistSchema()
        return schema.dumps(pl)
    else:
        return jsonify({'success': False, 'msg': 'Not found'}), 404

@app.route('/api/playlists/<int:playlist_id>/tracks', methods=['GET'])
def get_playlist_tracks(playlist_id):
    try:
        user = get_user_from_token(request)
    except AuthenticationError:
        user = None

    pl = Playlist.query.filter_by(id=playlist_id).first()
    # TODO: Check ownership.
    if pl:
        schema = TrackSchema(many=True)
        return schema.dumps(pl.tracks)
    else:
        return jsonify({'success': False}), 404

@app.route('/api/autoplaylists/<string:playlist_id>', methods=['GET'])
def get_autoplaylist(playlist_id):
    if playlist_id in auto_playlists:
        return jsonify(auto_playlists[playlist_id])
    else:
        return jsonify({'success': False, 'msg': 'Not found'}), 404


@app.route('/api/autoplaylists/<string:playlist_id>/tracks', methods=['GET'])
@token_required
def get_auto_playlist_tracks(user, playlist_id):
    if playlist_id == 'favourites':
        schema = TrackSchema(many=True)
        tracks = Track.query.filter(Track.favourited.any(Account.account_id == user.account_id))
        return schema.dumps(tracks)
    else:
        return jsonify({'success': False}), 404

@app.route('/api/playlists/<int:playlist_id>', methods=['PATCH'])
@token_required
def patch_playlist(user, playlist_id):
    pl = Playlist.query.filter_by(owner_id=user.account_id, id=playlist_id).first()
    if pl:
        schema = PlaylistSchema()
        playlist = schema.load(request.json, partial=True)
        if not playlist.errors:
            pl.title = playlist.data.title
            db.session.add(pl)
            db.session.commit()
            return jsonify({'success': True}), 200
        else:
            return jsonify({'success': False}), 400
    return jsonify({'success': False}), 404

@app.route('/api/playlists/<int:playlist_id>', methods=['DELETE'])
@token_required
def delete_playlist(user, playlist_id):
    pl = Playlist.query.filter_by(owner_id=user.account_id, id=playlist_id).first()
    if pl:
        db.session.delete(pl)
        db.session.commit()
        return jsonify({'success': True}), 200
    return jsonify({'success': False}), 404

@app.route('/api/feedback', methods=['POST'])
def feedback():
    try:
        user = get_user_from_token(request)
    except AuthenticationError:
        user = None

    data = request.json
    feedback = Feedback(content=data['content'])
    if 'email' in data:
        feedback.email = data['email']
    if user:
        feedback.user_id = user.account_id
    db.session.add(feedback)
    db.session.commit()
    return jsonify({'success': True}), 200

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
                    name = verified_claims['name'] if 'name' in verified_claims else '',
                    photo_url = verified_claims['picture'] if 'picture' in verified_claims else ''
                    )
            db.session.add(user)
            db.session.commit()
            return jsonify(created_msg), 201
    except ValueError as e:
        return jsonify(invalid_msg), 401

    return jsonify(signed_in_msg), 200
    
