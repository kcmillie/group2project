import http.client

conn = http.client.HTTPSConnection("beta.ratebeer.com")

payload = "{\"query\":\"query {\\n beer(id: 4934) {\\n id\\n name\\n }\\n}\",\"variables\":\"{}\",\"operationName\":null}"

headers = {
    'cookie': "__cfduid=df4104a36fa5f27448f524b983a715dce1539307351",
    'x-api-key wargs2rbaw1wyy7o6xwq8snem2sr24cd': "",
    'content-type': "application/json"
    }

conn.request("POST", "/v1/api/graphql/", payload, headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))
