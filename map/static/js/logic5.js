function p2f(x) {
  return parseFloat(x.slice(0, -1));
};

function stripScore(x) {
  return parseFloat(x.slice(0, -2));
};

function whatrow(array, value, thing) {
  var row = 0;
  for (var i = 0; i < array.length; i++){
    if(array[i][thing] == value){
      row = i;
    }
  }
  return row;
};

function boozybeerdata(keys, beer){
  // d3.json('/beers').then((beer) => {
    var Now2016 = false;
    var B20102015 = false;
    var Before2010 = false;
    var BeerCount = [];
    var BeerCategories = ['no info', 'Weak', 'Regular', 'Boozy', 'Very Boozy'];
    for (var i = 0; i<BeerCategories.length; i++){
      var RowCount = {};
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
    };

    function whattype(abv) {
        if (abv === null){
          return 'no info';
        } else if(abv < 5.0){
          return 'Weak';
        } else if(abv < 7.0){
          return 'Regular';
        } else if(abv < 9.0){
          return "Boozy";
        } else {
          return "Very Boozy";
        }
    };

    function addcount(CountArray, Beer, Year) {
        var category = whattype(Beer.abv);
        var rownum = whatrow(CountArray, category,'abv');
        CountArray[rownum][Year]++;
        };

    // console.log(beer[1]);
    for (var i = 0; i < beer.length; i++) {
      if((beer[i].year_founded > 2015) && (Now2016 == true)) {
          addcount(BeerCount, beer[i], 'Founded_2016_now');
      } else if ((beer[i].year_founded < 2016) && (beer[i].year_founded > 2009) && (B20102015 == true)) {
          addcount(BeerCount, beer[i], 'Founded_2010_to_2015');
      } else if ((beer[i].year_founded < 2010) && (Before2010 == true)) {
          addcount(BeerCount, beer[i], 'Before_2010');
      }
    };

    return BeerCount;

  // });
};


function ratingsbeerdata(keys, beer){
  // d3.json('/beers').then((beer) => {
    var Now2016 = false;
    var B20102015 = false;
    var Before2010 = false;
    var BeerCount = [];
    var BeerCategories = ['no info', 'ok', 'good', 'great'];
    for (var i = 0; i<BeerCategories.length; i++){
      var RowCount = {};
      RowCount['score'] = BeerCategories[i];
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
    };

    function rateMe(score) {
        if (score === null){
          return 'no info';
        } else if(score < 3.0){
          return 'ok';
        } else if(score < 4.0){
          return 'good';
        } else {
          return "great";
        }
    }

    function addcount(CountArray, Beer, Year) {
        var category = rateMe(Beer.score);
        var rownum = whatrow(CountArray, category,'score');
        CountArray[rownum][Year]++;
    };

    for (var i = 0; i < beer.length; i++) {
      if((beer[i].year_founded > 2015) && (Now2016 == true)) {
          addcount(BeerCount, beer[i], 'Founded_2016_now');
      } else if ((beer[i].year_founded < 2016) && (beer[i].year_founded > 2009) && (B20102015 == true)) {
          addcount(BeerCount, beer[i], 'Founded_2010_to_2015');
      } else if ((beer[i].year_founded < 2010) && (Before2010 == true)) {
          addcount(BeerCount, beer[i], 'Before_2010');
      }
    };

    return BeerCount;

  // });
};

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr(".bandwidth()dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  })
}

function BoozyStackedPlot(chartname, beerdata, keys, plot, maxchart){
  var svgWidth = 700,
        svgHeight = 280;

  //#boozyplot
  // var parentDiv = document.getElementById(chartname);
  // var svg = d3.select(parentDiv).append("svg");
  // var svgWidth = parentDiv.clientWidth;
  // var svgHeight = parentDiv.clientHeight;

  var svg = d3.select(chartname)
            .html("")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);
  var margin = {top: 10, right: 20, bottom: 30, left: 40};
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;
  var g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // set x scale
  var x = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.5)
        .align(0.1);

  // set y scale
  var y = d3.scaleLinear()
        .rangeRound([height, 0]);

  // create the chart
  x.domain(beerdata.map(function(d) { return d[plot]; }));
  y.domain([0, (maxchart)]).nice();
  var z = d3.scaleOrdinal().range(["#630C0C", "#AF0808", "#95A50D"]);

  // var keys = ['Founded_2016_now', 'Founded_2010_to_2015','Before_2010'];

  var rectangles = g.append("g")
      .selectAll("g")
      .data(d3.stack().keys(keys)(beerdata))
      .enter().append("g")
        .attr("fill", function(d) { return z(d.key); })
      .selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data[plot]); })
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

  var charttitle = 'test'
  if (chartname == '#boozyplot'){
    charttitle = "How Boozy is the Beer?"
  } else {
    charttitle = "How Good is the Beer?"
  }

  svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 25)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text(charttitle);

  function keyTest(obj, value){
      var key = null;
      for (var prop in obj){
        if (obj.hasOwnProperty(prop)){
          if (obj[prop] === value){
            key = prop;
          };
        };
      };
      return key;
  };

  var toolTip = d3.tip()
      .attr("class", "tooltip")
      .html(function(d) {
        // console.log(keyTest(d.data, d[1]-d[0]))
        return (`Quantity: ${d[1]-d[0]}`);
      });

  g.call(toolTip);

  rectangles.on("mouseover", function(data) {
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

function compare(a,b) {
  if (a.score < b.score)
    return 1;
  if (a.score > b.score)
    return -1;
  return 0;
}

function littleplot(chart, olddata, ratingorabv){
  olddata.sort(compare);
  var data = olddata.slice(0, 10);
  console.log(data)

  var svgWidth = 700;
  var svgHeight = 280;

  var margin = {
    top: 50,
    right: 40,
    bottom: 80,
    left: 100
  };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  var svg = chart.append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // set the ranges
  var y = d3.scaleBand()
          .range([height, 0])
          .padding(0.1);

  var x = d3.scaleLinear()
          .range([0, width]);

  // Scale the range of the data in the domains
  // x.domain(data.map(function(d) { return d['name']; }));
  x.domain([0, 4.0])
  // y.domain([0, d3.max(data, function(d) { return d[ratingorabv]; })]);
  y.domain(data.map(function(d) { return d['name']; }));
  // console.log(data)
  // append the rectangles for the bar chart
  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "littlebar")
      .attr("width", function(d) {return x(d[ratingorabv]); } )
      .attr("y", function(d) { return y(d['name']); })
      .attr("height", y.bandwidth());
      // .attr("x", function(d) { return x(d['name']); })
      // .attr("width", x.bandwidth())
      // .attr("y", function(d) { return y(d[ratingorabv]); })
      // .attr("height", function(d) { return height - y(d[ratingorabv]); });

  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y))
      .selectAll(".tick text");
        // .call(wrap, y.bandwidth());

  svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", -25)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Top 10 Beers and Rating");
}

function buildMap(year, beer){
  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    id: "mapbox.light",
    maxzoom: 15,
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
    zoom: 10,
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

  function onClick(e) {
      var popup = e.target.getPopup();
      var content = popup.getContent();
      var name = content.split('<')[0];
      var link = '/eachbrewery/' + name;
      var link2 = '/eachtweet/' + name;
      d3.json(link).then((b) => {

        var totalbeers = b.length;

        var box = d3.select('#boozyplot').html("");
        var tablebody = box.append("tbody");
        var tablerow = tablebody.append("tr");
        d3.json(link2).then((c) => {
          var thingtweet = c[0]['tweet'];
          console.log(c)
          var tabletitle = tablerow.append("th")
              .attr("colspan", "2")
              .html(entry => {return `<span id="minibox">${name} <br>
                Total Beers: ${totalbeers}<br>
                Latest Tweet: ${thingtweet}<hr>`;
                });
        });
        var tabledata = tablebody.append("tr").attr("id", "toast");
        var t1 = tabledata.append("td").attr("id", "list");
        var td1 = t1.append("div").attr("id", "beerlist");

        var td2 = tabledata.append("td").attr("id", "cheesecake");

        td1.selectAll('button')
          .data(b)
          .enter()
          .append('button')
          .attr('class', 'beerbutton')
          .html(entry => {
            return `${entry.name}`;
          })
          .on("click", entry => {
              td2.html("")
              .selectAll('span')
              .data(['name', 'style','score', 'abv'])
              .enter()
              .append('span')
              .attr('class', 'beerinfo')
              .html(blah => {
                return `${blah}: ${entry[blah]}`;
              });
          });

        var eachbeerplot = d3.select("#rateplot").html("");
        littleplot(eachbeerplot, b, 'score')
      });
    }

  function offClick(e) {
      BoozyStackedPlot('#boozyplot', boozybeerdata(keys, beer), keys, 'abv', boozemax);
      BoozyStackedPlot('#rateplot', ratingsbeerdata(keys, beer), keys, 'score', ratemax);
    }

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

    newMarker.bindPopup(year[i].name + "<br> Year Opened: " + year[i].year).on('popupopen', onClick).on('popupclose', offClick);
  }

  var keys = ['Founded_2016_now', 'Founded_2010_to_2015','Before_2010'];

  function findmax(beerdata, keys){
    var maxnum = 0;
    for(var i = 0; i<beerdata.length; i++){
      total = 0
      for(var k = 0; k<keys.length; k++){
        total = total + beerdata[i][keys[k]]
        if (total > maxnum){
          maxnum = total;
        };
      };
    };
    return (maxnum * 1.2);
  };
  var boozemax = findmax(boozybeerdata(keys, beer), keys);
  var ratemax = findmax(ratingsbeerdata(keys, beer), keys);

  BoozyStackedPlot('#boozyplot', boozybeerdata(keys, beer), keys, 'abv', boozemax);
  BoozyStackedPlot('#rateplot', ratingsbeerdata(keys, beer), keys, 'score', ratemax);

  map.on("overlayadd", (e) => {
    keys.push(e["name"]);
    BoozyStackedPlot('#boozyplot', boozybeerdata(keys, beer), keys, 'abv', boozemax);
    BoozyStackedPlot('#rateplot', ratingsbeerdata(keys, beer), keys, 'score', ratemax);
  });

  map.on("overlayremove", (e) => {
    var index = keys.indexOf(e["name"]);
    keys.splice(index, 1);
    BoozyStackedPlot('#boozyplot',boozybeerdata(keys, beer), keys, 'abv', boozemax);
    BoozyStackedPlot('#rateplot', ratingsbeerdata(keys, beer), keys, 'score', ratemax);
  });
};
function loadfullmap() {
  d3.json('/breweries').then((year) => {
    d3.json('/beers').then((beer) => {
      buildMap(year, beer);
    });
  });
}
loadfullmap();




