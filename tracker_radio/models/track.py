import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from marshmallow import Schema, fields, post_load
from .artist import Artist, ArtistSchema
from .rating import Rating

from tracker_radio import db

collaborators = db.Table('collaborators', 
        db.Column('track_id', db.Integer, db.ForeignKey('track.id'), primary_key=True),
        db.Column('artist_id', db.Integer, db.ForeignKey('artist.id'), primary_key=True))

class Track(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())
    title = db.Column(db.String(128), nullable=True, unique=False)
    location = db.Column(db.String(128), nullable=False, unique=True)
    artist_id = db.Column(db.Integer, db.ForeignKey('artist.id'))
    collaborators = db.relationship('Artist', secondary=collaborators, lazy='subquery',
            backref=db.backref('collaborations', lazy=True))

class TrackSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.String()
    location = fields.String()
    artist = fields.Nested(ArtistSchema, only=['id', 'name'])
    coop = fields.List(fields.String())
    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    average_rating = fields.Method("get_average_rating")

    def get_average_rating(self, obj):
        rating_scores = [r.rating for r in obj.ratings]
        if len(rating_scores) > 0:
            return float(sum(rating_scores)) / len(rating_scores)
        else:
            return 0.0

    @post_load
    def make_track(self, data):
        if 'artist' in data:
            artist = Artist.query.filter_by(name = data['artist']).first()
            if artist:
                data['artist_id'] = artist.id
                del data['artist']

        if 'coop' in data:
            coops = []
            for coop_name in data['coop']:
                coop = Artist.query.filter_by(name = coop_name).first()
                if coop:
                    coops.append(coop)
            data['collaborators'] = coops
            del data['coop']

        print(data)
        track = Track(**data)
        return track
