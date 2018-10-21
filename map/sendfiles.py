import requests
import json
import glob

url = "http://127.0.0.1:5000/beers"

# directory = "/Users/ckruder/Desktop/CodingBootcamp/group2project/beerdata2/"

files = glob.glob("*.js")


def checkblank(floatorint, value):
    if (value == "") or (value =="-"):
        return None
    else:
        if(floatorint == "float"):
            return float(value)
        else:
            return int(value)


for x in range(len(files)):
    filelocation = files[x]

    with open(filelocation) as f:
        data = json.load(f)

    for y in range(len(data)):
        params = {'beerName': data[y]['name'], "brewery": files[x][:-3],
            "style": data[y]['style'],
            "rating": checkblank("float",
            data[y]['rating']),
            "score": checkblank("float",data[y]['ratescore']),
            'total_rating': checkblank("int", data[y]['total_ratings'])}

        r = requests.post(url, data=params)
