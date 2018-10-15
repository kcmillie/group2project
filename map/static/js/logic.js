// from data.js
var tableData = DATA;
// console.log(tableData)

function buildBeerList(data) {
  // Use d3 to select the panel with id of `#sample-metadata`
  var beerlist = d3.select('#beerlist');

  // Use `.html("") to clear any existing data
  beerlist.html("");
  // console.log(data)
  beerlist.selectAll('button')
    .data(Object.entries(data))
    .enter()
    .append("button")
    .attr("class", "beer_item")
    .html(entry => {
        return entry[1]['name'];
      })
    .on("click", entry => {
      // console.log(entry)
      var beerdetail = d3.select('#beerdetail');
      beerdetail.html("");
      beerdetail.selectAll('div')
      .data(['name', 'abv', 'ibu', 'calories', 'score', '# of ratings'])
      .enter()
      .append('div')
      .html(blah => {
        return blah + ' : ' + entry[1][blah];
      });
    });
}


function getBeers(brewery) {
  filteredData = tableData.filter(d => d.brewery === brewery);
  // console.log(brewery);
  // console.log(filteredData[0]['name']);
  buildBeerList(filteredData);
}

function createMap(beerStations) {
  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap
  };

  // Create an overlayMaps object to hold the layers
  var overlayMaps = {
    "Breweries": beerStations
  };

  // Create the map object with options
  var map = L.map("map-id", {
    center: [39.0997, -94.5786],
    zoom: 12,
    layers: [lightmap, beerStations]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}
beerMarkers = []


function onClick(e) {
   var popup = e.target.getPopup();
   var content = popup.getContent();
   getBeers(content);
}

// For each station, create a marker and bind a popup with the station's name
var strangedays = L.marker([39.110027, -94.57997499999999]).bindPopup("Strange Days").on('click', onClick);
var boulevard = L.marker([39.082248, -94.596602]).bindPopup("Boulevard").on('click', onClick);
var bigrip = L.marker([39.125946, -94.578436]).bindPopup("The Big Rip").on('click', onClick);

// Add the marker to the bikeMarkers array
beerMarkers.push(strangedays);
beerMarkers.push(boulevard);
beerMarkers.push(bigrip);

// Create a layer group made from the bike markers array, pass it into the createMap function
createMap(L.layerGroup(beerMarkers));

