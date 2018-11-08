from google.appengine.ext import ndb
from marshmallow import Schema, fields, post_load
from .artist import Artist, ArtistSchema

class Track(ndb.Model):
    created_at = ndb.DateTimeProperty(auto_now_add=True)
    updated_at = ndb.DateTimeProperty(auto_now=True)
    title = ndb.StringProperty(indexed=True)
    location = ndb.StringProperty(indexed=True)
    artist = ndb.KeyProperty(kind="Artist")
    coop = ndb.KeyProperty(kind="Artist", repeated=True)

class TrackSchema(Schema):
    id = fields.Function(lambda track: track.key.id())
    title = fields.String()
    location = fields.String()
    artist = fields.Method("get_artist")
    coop = fields.Method("get_coops")
    created_at = fields.DateTime()
    updated_at = fields.DateTime()

    def get_artist(self, obj):
        schema = ArtistSchema()
        return schema.dump(obj.artist.get())

    def get_coops(self, obj):
        result = []
        for coop in obj.coop:
            result.append(coop.id())
        return result

    @post_load
    def make_track(self, data):
        if 'artist' in data:
            artist = Artist.query(Artist.name == data['artist']).get()
            if artist:
                data['artist'] = artist.key
        if 'coop' in data:
            coops = []
            for coop_name in data['coop']:
                coop = Artist.query(Artist.name == coop_name).get()
                if coop:
                    coops.append(coop.key)
            data['coop'] = coops
        return Track(**data)
