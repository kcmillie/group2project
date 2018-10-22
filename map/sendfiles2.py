import requests
import json
import glob

url = "http://127.0.0.1:5000/beertweets"

# directory = "/Users/ckruder/Desktop/CodingBootcamp/group2project/beerdata2/"

files = glob.glob("*.js")

for x in range(len(files)):
    filelocation = files[x]

    with open(filelocation) as f:
        data = json.load(f)

    for y in range(len(data)):
        params = {'tweet': data[y]['tweet'],
            "brewery": data[y]['brewery'],
            }

        r = requests.post(url, data=params)
