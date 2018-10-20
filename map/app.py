import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get('DATABASE_URL','') or "sqlite:///db/beerdb4.db"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
beerdB = Base.classes.beers5
breweries = Base.classes.breweries


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/breweries")
def brewery():
    """returns brewery list"""

    test = db.session.query(breweries).statement
    df = pd.read_sql_query(test, db.session.bind)

    # Return a list of the column names (sample names)
    return df.to_json(orient="records")


@app.route("/beers")
def beers():
    """returns beer list"""

    beers = db.session.query(beerdB).statement
    df = pd.read_sql_query(beers, db.session.bind)

    # Return a list of the column names (sample names)
    return df.to_json(orient="records")


if __name__ == "__main__":
    app.run()