import tweepy
import json
from config import consumer_key, consumer_secret, access_token, access_token_secret

twittername = ['Boulevard_Beer', 'BigRipBeer', 'BreweryEmperial', 'CalibrationBrew',
    'cinderblockbrew', 'Dblshiftbrewing', 'KCBierCo', 'martincitybrew', 'StrangeDaysBeer',
    'TornLabelKC', 'CABrewing', 'StockyardsBeer', 'CraneBrewing',
    'BorderBrewCo', 'BKSArtisanAles', 'GreenRoomKC', 'McCoysKC', 'EastForty',
    'Colony_KC', 'fringebeerworks', 'newaxiombrewco']

beerlist = ['Boulevard', 'The Big Rip', 'Brewery Emperial', 'Calibration',
'Cinder Block', 'Double Shift', 'Kansas City Bier', 'Martin City',
'Strange Days', 'Torn Label', 'Casual Animal', 'Stockyards', 'Crane',
'Border Brewing', 'BKS', 'Green Room', "McCoy's", 'East Forty',
'Colony', 'Fringe Beerworks', 'New Axiom']

# Setup Tweepy API Authentication
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth, parser=tweepy.parsers.JSONParser())

tweets = []
for x in range(len(twittername)):
    beertweet = {}
    beertweet['brewery'] = beerlist[x]
    public_tweets = api.user_timeline(twittername[x])
    beertweet['tweet'] = public_tweets[0]["text"]
    tweets.append(beertweet)

with open('beertweets.js', 'w') as outfile:
        json.dump(tweets, outfile)
