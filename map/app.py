import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify, render_template, request
from flask_sqlalchemy import SQLAlchemy

import json

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
beer = Base.classes.beer
brewtweets = Base.classes.beertweet


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


@app.route("/eachbrewery/<name>")
def eachbrewery(name):
    """returns brewery list"""
    print(name)
    data = db.session.query(beer).join("breweries").filter(func.lower(breweries.name)==func.lower(name))

    beerslist = []
    for y in data:
        supper = {}
        supper["name"] = y.name
        supper["style"] = y.style
        supper["abv"] = y.rating
        supper["number_of_ratings"] = y.total_rating
        supper["score"] = y.score
        beerslist.append(supper)

    # Return a list of the column names (sample names)
    return json.dumps(beerslist)


@app.route("/beers2")
def beers2():
    beers = db.session.query(beerdB).statement
    df = pd.read_sql_query(beers, db.session.bind)

    # Return a list of the column names (sample names)
    return df.to_json(orient="records")


@app.route("/eachtweet/<name>")
def eachtweet(name):
    """returns brewery list"""
    print(name)
    data = db.session.query(brewtweets).join("breweries").filter(func.lower(breweries.name)==func.lower(name))

    thing1 = []
    for y in data:
        thisthing = {}
        thisthing["tweet"] = y.tweet
        thing1.append(thisthing)

    # Return a list of the column names (sample names)
    return json.dumps(thing1)



@app.route("/beertweets", methods=['POST', 'GET'])
def beertweets():
    if request.method == "GET":
        tweetlist = []
        lunch = db.session.query(brewtweets).join("breweries")
        for y in lunch:
            thing = {}
            thing["brewery"] = y.breweries.name
            thing["tweet"] = y.tweet
            tweetlist.append(thing)
        stupidlist = json.dumps(tweetlist)
        return stupidlist
    else:
        breweryName = request.form["brewery"]
        tweet = request.form["tweet"]
        breweryid = db.session.query(breweries.breweryid).filter_by(name = breweryName)[0][0]

        newtweet = brewtweets(tweet=tweet, breweryid=breweryid)

        db.session.add(newtweet)
        db.session.commit()
    return("")

@app.route("/beers", methods=['POST', 'GET'])
def beers():
    """returns beer list"""
    beerslist = []
    if request.method == "GET":
        beers = db.session.query(beer).join("breweries")
        for y in beers:
            supper = {}
            supper["abv"] = y.rating
            supper["brewery"] = y.breweries.name
            supper["year_founded"] = y.breweries.year
            supper["name"] = y.name
            supper["number_of_ratings"] = y.total_rating
            supper["score"] = y.score
            beerslist.append(supper)

        myjsonlist = json.dumps(beerslist)
        return myjsonlist
    else:
        breweryName = request.form["brewery"]
        name = request.form["beerName"]
        style = request.form["style"]
        rating = request.form["rating"] if "rating" in request.form else None
        score = request.form["score"] if "score" in request.form else None
        total_rating = request.form["total_rating"] if "total_rating" in request.form else None

        breweryid = db.session.query(breweries.breweryid).filter_by(name = breweryName)[0][0]

        newbeer = beer(name=name, style=style, rating=rating, breweryid=breweryid,
            score=score, total_rating=total_rating)

        db.session.add(newbeer)
        db.session.commit()
    return("")



if __name__ == "__main__":
    app.run()