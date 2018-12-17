"""empty message

Revision ID: 02064f159999
Revises: e0a2c7fbee16
Create Date: 2018-12-13 19:44:40.549255

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '02064f159999'
down_revision = 'e0a2c7fbee16'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('playlist', sa.Column('public', sa.Boolean(), nullable=True))
    op.add_column('playlistrefs', sa.Column('order', sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('playlistrefs', 'order')
    op.drop_column('playlist', 'public')
    # ### end Alembic commands ###
