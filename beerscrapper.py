from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
from selenium import webdriver
import time
from pprint import pprint
import json
# from selenium.webdriver.common.keys import Keys


def getHTML(brewName, loopval):
    driver = webdriver.Chrome()
    url = 'https://www.ratebeer.com/search?q=' + brewName
    driver.get(url)
    for x in range(loopval):
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(5)
    html = driver.page_source
    assert "RateBeer Search" in driver.title
    assert "No results" not in driver.page_source
    driver.close()
    return html


def getBeerHTML(beerID):
    driver = webdriver.Chrome()
    url = "https://www.ratebeer.com/beer/" + str(beerID) + "/"
    driver.get(url)
    time.sleep(5)
    html = driver.page_source
    #assert "RateBeer Search" in driver.title
    assert "No results" not in driver.page_source
    driver.close()
    return html


def getBeerDetails(beerID):
    details = []
    stuff = getBeerHTML(beerID)
    soup = BeautifulSoup(stuff, 'html.parser')
    details.append(soup.find('span', attrs={'data-css-139rlzb': True}).string)
    for x in soup.find_all('span', attrs={'data-css-1hknuix': True})[0:3]:
        details.append(x.get_text())
    # abv = soup.find('span', attrs={'data-css-1hknuix': True}).string]
    # print(abv)
    return tuple(details)


def getBeers(brewery):
    beers = []
    foo = getHTML(brewery, 1)
    soup = BeautifulSoup(foo, 'html.parser')
    # print(soup.prettify())
    # print('title: ' + soup.title.string)
    for w in soup.find_all('a', attrs={'data-css-11bioy6': True}):
        beerName = w.find('span', attrs={'data-css-9iiyn6': True}).string
        # use get_text to get ratings because there are nested span tags in html
        beerID = w.get('id')
        score, abv, ibu, calories = getBeerDetails(beerID)
        rateCount = w.find('span', attrs={'data-css-11wh90w': True}).get_text()
        beerRating = w.find('div', attrs={'data-css-1fpitig': True}).string
        beer = {}
        beer['name'] = beerName
        beer['rating'] = beerRating
        beer['RateBeer ID'] = beerID
        beer['score'] = score
        beer['abv'] = abv
        beer['ibu'] = ibu
        beer['calories'] = calories
        beer['# of ratings'] = rateCount
        beers.append(beer)
    return beers
        # for q in w.find_all('span', attrs={'data-css-9iiyn6': True}):

        #print(q.prettify())
        # print(w.prettify())
        # print(w.attrs)
        # print(" ")

#print(w.find_all('a'))


breweries = ['East Forty']
beer_data = {}
for x in breweries:
    a = getBeers(x)
    beer_data[x] = a

with open('eastforty.json', 'w') as outfile:
    json.dump(beer_data, outfile)



# json file keeps all beer
# import json file to analyze data
# this program will get everything in strings
# EXTRA
# get beer ID from main scraping
# use beer ID, can get extra info regarding beer

pprint(beer_data)
