"""empty message

Revision ID: 580cea723ef7
Revises: 02064f159999
Create Date: 2019-01-06 20:19:38.662563

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '580cea723ef7'
down_revision = '02064f159999'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('problem',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('email', sa.Text(), nullable=True),
    sa.Column('content', sa.Text(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['accounts.account_id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('problem')
    # ### end Alembic commands ###