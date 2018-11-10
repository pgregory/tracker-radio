import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from marshmallow import Schema, fields, post_load

from appengine.main import db

class Artist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())
    name = db.Column(db.String(120), nullable=False, unique=True)
    tracks = db.relationship(
            'Track',
            backref=db.backref('artist', lazy='select'),
            )

class ArtistSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.String()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()

    @post_load
    def make_artist(self, data):
        return Artist(**data)
