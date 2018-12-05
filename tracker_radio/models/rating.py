import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from marshmallow import Schema, fields, post_load
from .account import Account

from tracker_radio import db

class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())
    user_id = db.Column(db.Integer, db.ForeignKey('accounts.account_id'))
    track_id = db.Column(db.Integer, db.ForeignKey('track.id'))
    rating = db.Column(db.Integer, nullable=False)


    # Define relationship to account
    user = db.relationship("Account",
                           backref=db.backref("ratings",
                                              order_by=id))
    # Define relationship to track
    track = db.relationship("Track",
                            backref=db.backref("ratings",
                                               order_by=id))
