from tracker_radio import app, db, auth, login_manager
from flask import render_template, request, jsonify, abort
from flask_login import LoginManager, UserMixin, login_user, logout_user
from random import *

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


@auth.production_loader
def production_sign_in(token):
    account = Account.query.filter_by(firebase_user_id=token['sub']).one_or_none()
    if account is None:
        account = Account(firebase_user_id=token['sub'])
        db.session.add(account)
    account.email = token['email']
    account.email_verified = token['email_verified']
    account.name = token.get('name')
    account.photo_url = token.get('picture')
    db.session.flush()
    login_user(account)
    db.session.commit()

@auth.development_loader
def development_sign_in(email):
    login_user(Account.query.filter_by(email=email).one())


@auth.unloader
def sign_out():
    logout_user()


@login_manager.user_loader
def load_user(account_id):
    return Account.query.get(account_id)


@login_manager.unauthorized_handler
def authentication_required():
    return auth.url_for('widget', mode='select', next=request.url)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/form')
def form():
    return render_template('form.html')

@app.route('/submitted', methods=['POST'])
def submitted_form():
    from tracker_radio.models.track import Track, TrackSchema
    from tracker_radio.models.artist import Artist, ArtistSchema
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
    tracks = Track.query().order(Track.title).fetch(5)
    return schema.dumps(tracks)

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
        return jsonify(result.errors), 400

