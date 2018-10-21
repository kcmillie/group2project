from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
from selenium import webdriver
import time
from pprint import pprint
import json
import pandas as pd
# from selenium.webdriver.common.keys import Keys


# get HTML info for brewery search
def getHTML(brewName, loopval):
    driver = webdriver.Chrome()
    url = 'https://www.ratebeer.com/search?q=' + brewName + '&category=brewers'
    driver.get(url)
    print(url)
    # for x in range(loopval):
    #     driver.execute_script("window.scrollTo(0, document.\
    #         body.scrollHeight);")
    time.sleep(5)
    html = driver.page_source
    # assert "RateBeer Search" in driver.title
    # assert "No results" not in driver.page_source
    driver.close()
    # print(html)
    return html


# get HTML info of from table of beers for each brewery
def getBreweryHTML(link):
    driver = webdriver.Chrome()
    base = "https://www.ratebeer.com"
    url = base + link
    driver.get(url)
    print(url)
    # for x in range(loopval):
    #     driver.execute_script("window.scrollTo(0, document.body.
    # scrollHeight);")
    time.sleep(5)
    html = driver.page_source
    # assert "RateBeer Search" in driver.title
    # assert "No results" not in driver.page_source
    driver.close()
    # print(html)
    return html


# get 2nd half beer link to go to list of beers
def get2ndHalfLink(brewery):
    foo = getHTML(brewery, 1)
    soup = BeautifulSoup(foo, 'html.parser')
    link = soup.find('a', attrs={'data-css-11bioy6': True, 'href':True}).get('href')
    return link


def getBeers(brewery):
    foo = getBreweryHTML(brewery)
    soup = BeautifulSoup(foo, 'html.parser')
    table = soup.find_all("tr", attrs={"valign": "middle"})
    return(table)


def getFinal(Table):
    variables = ['name','style', 'rating', 'date', 'rate',
                 'ratescore', 'style%', 'total_ratings']
    fulllist = []
    for x in Table:
        try:
            beer = {}
            z = 0
            for y in x:
                if(z == 0):
                    other = y.find("a").text
                    newthing = y.find("span").text
                    abv = y.next_sibling.text
                    beer[variables[0]] = other
                    beer[variables[1]] = newthing
                    beer[variables[2]] = abv
                    z = 2
                else:
                    beer[variables[z]] = y.text
                    z = z + 1
        #     print(beer)
            fulllist.append(beer)
        except AttributeError:
            print("skipped beer")
    return fulllist


beerlist = ['Boulevard', 'The Big Rip', 'Brewery Emperial', 'Calibration',
'Cinder Block', 'Double Shift', 'Kansas City Bier', 'Martin City',
'Strange Days', 'Torn Label', 'Casual Animal', 'Stockyards', 'Crane',
'Border Brewing', 'BKS', 'Green Room', "McCoy's", 'East Forty',
'Colony', 'Rock and Run', 'Fringe Beerworks', 'Smoke Brewing',
'New Axiom']

for x in range(len(beerlist)):
    # print(beerlist[x])
    SecondHalf = get2ndHalfLink(beerlist[x])
    table = getBeers(SecondHalf)
    blahlist = getFinal(table)
    print(blahlist)
    filename = beerlist[x] + '.js'
    with open(filename, 'w') as outfile:
        json.dump(blahlist, outfile)
