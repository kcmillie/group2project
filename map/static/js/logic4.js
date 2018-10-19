function boozybeerdata(keys){
  d3.json('/beers').then((beer) => {
    var Now2016 = false;
    var B20102015 = false;
    var Before2010 = false;

    var BeerCount = [];
    var BeerCategories = ['no info', 'Weak', 'Regular', 'Boozy', 'Very Boozy'];
    for (var i = 0; i<BeerCategories.length; i++){
      var RowCount = {}
      RowCount['abv'] = BeerCategories[i];
      for (var k=0; k<keys.length; k++){
          RowCount[keys[k]] = 0;
          if (keys[k] == 'Founded_2016_now') {
            Now2016 = true;
          }
          if (keys[k] == 'Founded_2010_to_2015') {
            B20102015 = true;
          }
          if (keys[k] == 'Before_2010') {
            Before2010 = true;
          }
      }
      BeerCount.push(RowCount);
    }

    function p2f(x) {
      return parseFloat(x.slice(0, -1));
    }

    function stripScore(x) {
      return parseFloat(x.slice(0, -2));
    }

    function whatrow(array, value) {
        var row = 0;
        for (var i = 0; i < array.length; i++){
          if(array[i].abv == value){
            row = i;
          }
        }
        return row;
    }

    function whattype(abv) {
        if (abv == '-'){
          return 'no info';
        } else if(p2f(abv) < 5.0){
          return 'Weak';
        } else if(p2f(abv) < 7.0){
          return 'Normal';
        } else if(p2f(abv) < 9.0){
          return "Boozy";
        } else {
          return "Very Boozy";
        }
    }

    function addcount(CountArray, Beer, Year) {
        var category = whattype(Beer.abv);
        var rownum = whatrow(CountArray, category);
        CountArray[rownum][Year]++;
    }

    // console.log(beer[1]);
    for (var i = 0; i < beer.length; i++) {
      if((beer[i].yearfounded > 2015) && (Now2016 == true)) {
          addcount(BeerCount, beer[i], 'Founded_2016_now');
      } else if ((beer[i].yearfounded < 2016) && (beer[i].yearfounded > 2009) && (B20102015 == true)) {
          addcount(BeerCount, beer[i], 'Founded_2010_to_2015');
      } else if ((beer[i].yearfounded < 2010) && (Before2010 == true)) {
          addcount(BeerCount, beer[i], 'Before_2010');
      }
    }
    console.log("**boozybeerdata**")
    console.log(BeerCount);
    return BeerCount;
    // elementPos = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);

  });
}


function BoozyStackedPlot(beerdata, keys){
    var svgWidth = 600,
        svgHeight = 500;

    var svg = d3.select("#boozyplot")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);
    var margin = {top: 20, right: 20, bottom: 30, left: 40};
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
    var g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // set x scale
    var x = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.05)
        .align(0.1);

    // set y scale
    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    // load the csv and create the chart
    x.domain(beerdata.map(function(d) { return d.abv; }));
    y.domain([0, 200]).nice();
    var z = d3.scaleOrdinal().range(["#98abc5", "#8a89a6", "#7b6888"]);

    var keys = ['Founded_2016_now', 'Founded_2010_to_2015','Before_2010'];

    var rectangles = g.append("g")
      .selectAll("g")
      .data(d3.stack().keys(keys)(beerdata))
      .enter().append("g")
        .attr("fill", function(d) { return z(d.key); })
      .selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.abv); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width", x.bandwidth());

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
      .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start");

    function keyTest(obj, value){
        var key = null;
        for (var prop in obj){
          if (obj.hasOwnProperty(prop)){
            if (obj[prop] === value){
              key = prop;
            }
          }
        }
        return key;
      };

    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .html(function(d) {
        console.log(keyTest(d.data, d[1]-d[0]))
        return (`Quantity: ${d[1]-d[0]}`);
      });

    g.call(toolTip);

    rectangles.on("click", function(data){
      toolTip.show(data, this);
      })
      .on("mouseout", function(data, index){
        toolTip.hide(data);
      });

    var legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) { return d; });
};

function buildMap(){
  d3.json('/breweries').then((year) => {
    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
      id: "mapbox.light",
      maxzoom: 18,
      accessToken: API_KEY
    });

    // Initialize all of the LayerGroups we'll be using
    var layers = {
      Founded_2016_now: new L.featureGroup(),
      Founded_2010_to_2015: new L.featureGroup(),
      Before_2010: new L.featureGroup()
    };

    // Create the map object with options
    var map = L.map("map-id", {
      center: [39.0997, -94.5786],
      zoom: 11,
      layers:[
      layers.Founded_2016_now,
      layers.Founded_2010_to_2015,
      layers.Before_2010
      ]
    });

    lightmap.addTo(map);

    var overlays = {
      "Founded_2016_now": layers.Founded_2016_now,
      "Founded_2010_to_2015": layers.Founded_2010_to_2015,
      "Before_2010": layers.Before_2010
    }

    L.control.layers(null, overlays).addTo(map);

    var info = L.control({
      position: "bottomright"
    });

    info.onAdd = function(){
      var div = L.DomUtil.create("div", "legend");
      return div
    }
    info.addTo(map);

    var brewCount = {
      Founded_2016_now: 0,
      Founded_2010_to_2015: 0,
      Before_2010: 0
    }

    var brewCode;

    for(var i = 0; i<year.length; i++) {
      brewCode = year[i].year;
      if(brewCode > 2015) {
        brewCode = "Founded_2016_now";
      } else if(brewCode > 2009) {
        // console.log(brewCode)
        brewCode = "Founded_2010_to_2015";
      } else {
        brewCode = "Before_2010";
      }

      brewCount[brewCode]++;

      var newMarker = L.marker([year[i].lat, year[i].long]);

      newMarker.addTo(layers[brewCode]);

      newMarker.bindPopup(year[i].name + "<br> Year Opened: " + year[i].year);
    }

    var keys = ['Founded_2016_now', 'Founded_2010_to_2015','Before_2010'];
    var bdb = boozybeerdata(keys);
    console.log("***after calling boozybeerdata**")
    console.log(bdb)
    console.log('***')
    BoozyStackedPlot(bdb, keys);

    map.on("overlayadd", (e) => {
      keys.push(e["name"]);
    });

    map.on("overlayremove", (e) => {
      var index = keys.indexOf(e["name"]);
      keys.splice(index, 1);
    });

    console.log(brewCount);


  })
};

buildMap();



