import datetime
from sqlalchemy.sql import func
from .account import Account
from tracker_radio import db

class Problem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())
    user_id = db.Column(db.Integer, db.ForeignKey('accounts.account_id'))
    email = db.Column(db.Text, nullable=True)
    content = db.Column(db.Text)

    # Define relationship to account
    user = db.relationship("Account",
                           backref=db.backref("problems",
                                              order_by=id))
