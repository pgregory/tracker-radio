import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from marshmallow import Schema, fields, post_load
from .account import Account
from .track import Track, TrackSchema

from tracker_radio import db

playlistrefs = db.Table('playlistrefs', 
        db.Column('track_id', db.Integer, db.ForeignKey('track.id'), primary_key=True),
        db.Column('playlist_id', db.Integer, db.ForeignKey('playlist.id'), primary_key=True),
        db.Column('order', db.Integer))

class Playlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())
    title = db.Column(db.String(128), nullable=True, unique=False)
    tracks = db.relationship('Track', secondary=playlistrefs, lazy='subquery',
            backref=db.backref('playlists', lazy=True))
    owner_id = db.Column(db.Integer, db.ForeignKey('accounts.account_id'))
    public = db.Column(db.Boolean)

class PlaylistSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.String()
    tracks = fields.Nested(TrackSchema, many=True, only=('id', 'title', 'artist'))
    created_at = fields.DateTime()
    updated_at = fields.DateTime()

    @post_load
    def make_playlist(self, data):
        if 'owner' in data:
            account = Account.query.filter_by(id = data['owner']).first()
            if account:
                data['owner_id'] = account.id
                del data['owner']

        print(data)
        playlist = Playlist(**data)
        return playlist

