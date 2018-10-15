from selenium import webdriver
from selenium.webdriver.common.keys import Keys


def getHTML(brewName):
    driver = webdriver.Chrome()
    url = 'https://www.ratebeer.com/search?q=' + brewName
    driver.get(url)
    html = driver.page_source
    assert "RateBeer Search" in driver.title
    assert "No results" not in driver.page_source
    driver.close()
    return html
