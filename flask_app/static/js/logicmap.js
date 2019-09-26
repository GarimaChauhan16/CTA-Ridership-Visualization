function wholeMap (year) {
  //create a function to return the color for earthquake magnitude https://leafletjs.com/examples/choropleth/
  function getColor(ridership) {
      return ridership > 5000000 ? '#FF0000' :
             ridership > 3000000 ? '#FF7B00' :
             ridership > 2000000 ? '#FFC100' :
             ridership > 1000000 ? '#FFF600' :
             ridership > 800000  ? '#E5FF00' :
             ridership > 600000  ? '#90d92b' :
             ridership > 400000  ? '#138a27' :
             ridership > 200000   ? '#6960a6' :
             ridership > 0   ? '#261596' :
                      '#8f8e9c';
  }

  // Create the createMap function
  function createMap(ridershipLayer) {
    // console.log(ridershipLayer);
    //remove all html and replace to reinitialize the map each time
    document.getElementById('map-cont').innerHTML = "<div id='map' style='width: 200px; height: 600px; min-height: 100%; min-width: %100; display: block;'></div>";
        // Create the tile layer that will be the background of our map
        var outdoorsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: attribution,
        maxZoom: 18,
        id: "mapbox.outdoors",
        accessToken: API_KEY
        });

        var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: attribution,
        id: "mapbox.satellite",
        accessToken: API_KEY
        });
    
        var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: attribution,
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY,
        noWrap: true
        });          
        
        var lLine = omnivore.geojson('static/data/CTA_RailLines.geojson');
        console.log(lLine);

        // Create a baseMaps object to hold the satellite layer
        // Create a baseMaps object to hold the satellite layer
        var baseMaps={
            "Outdoor Map": outdoorsmap,
            "Light Map": light,
            "Satellite Map": satellitemap
        };
      
        // Create an overlayMaps object to hold the earthquake layer
      var overlayMap = {
        'Lines' : lLine,
        'Ridership' : ridershipLayer
      };
      
        // Create the map object with options
        var map = L.map("map", {
          center: [41.85, -87.65],
          zoom: 10,
          layer: [light, overlayMap]
        });
      
        // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
        L.control.layers(baseMaps, overlayMap, {collapsed: false}).addTo(map);
      
        //create legend https://leafletjs.com/examples/choropleth/
      var legend = L.control({position: 'bottomright'});

      legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
          M = 100000
          ridership = [0, 2, 4, 6, 8, 10, 20, 30, 50],
          colors =[],
      labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < ridership.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor((ridership[i] + 1) * M) + '"></i> ' +
        + + ridership[i]/10 + "M" + (ridership[i + 1]/10 ? ' &ndash; ' + ridership[i + 1]/10 + "M" + '<br>' : '+');
    }

    return div;
      };

      legend.addTo(map);
      //map.setMaxBounds(  [[-90,-180],   [90,180]]  )
  }
      


  // Create the createCircles function
  function createCircles(response) {
      // Pull the "earthquakes" property off of response.data
      //let features = response.features;
      //console.log(features);
      // Initialize an array to hold circles
      let centers = [];
      // Loop through the earthquake array
      response.forEach(station => {
        // For each earthquake, create a circle and bind a popup with the earthquake's magnitude 
        let location = [station.lat, station.lon];
        //console.log(location); 
        let ridership = station.ridership.toFixed(0);
        let name = station.stations;
        //if(ridership > 0){
        //console.log(mag);
        let center = L.circle(location, {
          fillOpacity: .75,
          color: getColor(ridership),
          fillColor: getColor(ridership),
          //Adjust radius
          radius: ridership/10000})
          //}).addTo(myMap);
          .bindPopup(`<h1> ${name} </h1> <hr> <h3>Total Ridership: ${ridership}</h3>`);
        // Add the center to the centers array
        centers.push(center);
        //};
      });
      //console.log(centers);
      
      // // Create a layer group made from the centers array, pass it into the createMap function
      let ridershipLayer = L.layerGroup(centers);
      createMap(ridershipLayer);
  }
    // Perform an API call to the earthquake API to get earthquake information. Call createCircles when complete
    var url = `/years/${year}`;
    d3.json(url, createCircles);

}
  //create a list of years to populate select options
function init (){
  var selector2 = d3.select("#selDatasetYear");
  d3.json("/years", function(error, years) {
    if (error) return console.warn(error);
    console.log(years)
    years.forEach((year) => {
      selector2
          .append("option")
          .text(year)
          .property("value", year);
    });
    const firstYear = years[0];
    wholeMap(firstYear);
  });
 
}

function yearChanged(newYear) {
  // Fetch new data each time a new state is selected
  wholeMap(newYear);
}

init()