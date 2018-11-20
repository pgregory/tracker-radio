from setuptools import setup, find_packages

setup(
        name='tracker_radio',
        packages=find_packages(),
        include_package_data=True,
        install_requires=[
            'Flask',
            'Flask-Cors',
            'Flask-sqlalchemy',
            'Flask-Login',
            'marshmallow',
            'requests',
            'firebase-admin'
            ]
        )
