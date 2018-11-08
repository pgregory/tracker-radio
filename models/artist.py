from google.appengine.ext import ndb
from marshmallow import Schema, fields, post_load

class Artist(ndb.Model):
    created_at = ndb.DateTimeProperty(auto_now_add=True)
    updated_at = ndb.DateTimeProperty(auto_now=True)
    name = ndb.StringProperty(indexed=True)

    @property
    def tracks(self):
        from .track import Track
        return Track.query().filter(Track.artist == self.key)

    def add_track(self, track):
        track.artist = self.key
        track.put()

    def add_coop(self, track):
        track.coop.append(self.key)
        track.put()

class ArtistSchema(Schema):
    id = fields.Function(lambda artist: artist.key.id())
    name = fields.String()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()

    @post_load
    def make_artist(self, data):
        return Artist(**data)
