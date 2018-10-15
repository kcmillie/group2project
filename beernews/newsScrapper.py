from splinter import Browser
from bs4 import BeautifulSoup
from datetime import datetime


# Initialize browser
def init_browser():
    # @NOTE: Replace the path with your actual path to the chromedriver
    executable_path = {"executable_path": "/usr/local/bin/chromedriver"}
    return Browser("chrome", **executable_path, headless=False)


# scrape fullpint news
def scrape_fullpint():
    # Initialize browser
    browser = init_browser()
    # Visit link
    url = "https://thefullpint.com/beer-news/"
    browser.visit(url)
    # Scrape page into soup
    html = browser.html
    soup = BeautifulSoup(html, "html.parser")
    # Find title
    news_headline = soup.find("h2", class_="post-title entry-title").text
    # Get link
    news_link = soup.find("h2", class_="post-title entry-title").\
        find("a")
    # Store in dictionary
    news = {
        "headline": news_headline,
        "link": news_link
    }
    # Return results
    return news


def scrape_brewbound():
    # Initialize browser
    browser = init_browser()
    # Visit link
    url = "https://www.brewbound.com/news"
    browser.visit(url)
    # Scrape page into soup
    html = browser.html
    soup = BeautifulSoup(html, "html.parser")
    # Find title
    news_headline = soup.find("h3").text
    # Get link
    news_link = soup.find("h3").find("a")
    # Store in dictionary
    news = {
        "headline": news_headline,
        "link": news_link
    }
    # Return results
    return news


def scrape_craftbeer():
    # Initialize browser
    browser = init_browser()
    # Visit link
    url = "https://www.craftbeer.com/category/news"
    browser.visit(url)
    # Scrape page into soup
    html = browser.html
    soup = BeautifulSoup(html, "html.parser")
    # Find title
    news_headline = soup.find("h2", class_="entry-title").find("a").text
    # Get link
    news_link = soup.find("h2", class_="entry-title").find("a")
    # Store in dictionary
    news = {
        "headline": news_headline,
        "link": news_link
    }
    # Return results
    return news
