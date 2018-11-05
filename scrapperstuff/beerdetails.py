from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
from selenium import webdriver
import time
from pprint import pprint
import json


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
    print(details)
    # print(abv)
    return