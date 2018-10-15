import json

traffic = json.load(open('bigrip.json'))

someitem = traffic.itervalues().next()
columns = list(someitem.keys())
print (columns)
