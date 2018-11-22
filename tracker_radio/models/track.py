import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from marshmallow import Schema, fields, post_load
from .artist import Artist, ArtistSchema
from .rating import Rating

from tracker_radio import db

class Track(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())
    title = db.Column(db.String(128), nullable=True, unique=False)
    location = db.Column(db.String(128), nullable=False, unique=True)
    artist_id = db.Column(db.Integer, db.ForeignKey('artist.id'))
    #coop = ndb.KeyProperty(kind="Artist", repeated=True)

class TrackSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.String()
    location = fields.String()
    artist = fields.String()
    #coop = fields.Method("get_coops")
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
        track = Track(**data)
        return track

#        if 'coop' in data:
#            coops = []
#            for coop_name in data['coop']:
#                coop = Artist.query(Artist.name == coop_name).get()
#                if coop:
#                    coops.append(coop.key)
#            data['coop'] = coops
