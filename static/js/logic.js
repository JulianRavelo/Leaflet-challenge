// Creating the map object
let myMap = L.map("map", {
  center: [39.0, 34.0],
  zoom: 2
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Use this link to get the GeoJSON data.
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

d3.json(link).then(function(response) {
  let markersLayer = new L.LayerGroup();
  myMap.on('zoomend', function (e) {
    markersLayer.clearLayers();
    let zoom = e.target.getZoom();
    
    console.log(zoom);
    features = response.features;
    console.log(features[0].geometry.coordinates[2]);

    // Loop through the earthquakes feature, and create one marker for each event object.
    for (let i = 0; i < features.length; i++) {

      // Conditionals for color per depth 
      let color = "";
      if (features[i].geometry.coordinates[2] <= 1) {
        color = "blue";
      }
      else if (features[i].geometry.coordinates[2] > 1 && features[i].geometry.coordinates[2] <= 10) {
        color = "green";
      }
      else if (features[i].geometry.coordinates[2] > 10 && features[i].geometry.coordinates[2] <= 50) {
        color = "yellow";
      }
      else if (features[i].geometry.coordinates[2] > 50 && features[i].geometry.coordinates[2] <= 100) {
        color = "orange";
      }
      else {
        color = "red";
      }
  
      // Add circles to the map.
      let circle = L.circle([features[i].geometry.coordinates[1],  features[i].geometry.coordinates[0]], {
        fillOpacity: 0.75,
        color: "black",
        fillColor: color,
        // Adjust the radius.
        radius: (features[i].properties.mag * 100000)/zoom
      }).bindPopup(`<h1>${features[i].properties.place}</h1> 
                    <hr> <h3>Magnitude: ${features[i].properties.mag}</h3>
                    <h3>Depth: ${features[i].geometry.coordinates[2]}</h3>`)
        .addTo(markersLayer);
  
    };

  });

  function initialMap () {
    features = response.features;


    // Loop through the earthquakes feature, and create one marker for each event object.
    for (let i = 0; i < features.length; i++) {
  
      // Conditionals for color per depth 
      let color = "";
      if (features[i].geometry.coordinates[2] <= 1) {
        color = "blue";
      }
      else if (features[i].geometry.coordinates[2] > 1 && features[i].geometry.coordinates[2] <= 10) {
        color = "green";
      }
      else if (features[i].geometry.coordinates[2] > 10 && features[i].geometry.coordinates[2] <= 50) {
        color = "yellow";
      }
      else if (features[i].geometry.coordinates[2] > 50 && features[i].geometry.coordinates[2] <= 100) {
        color = "orange";
      }
      else {
        color = "red";
      }
    
      // Add circles to the map.
      let circle = L.circle([features[i].geometry.coordinates[1],  features[i].geometry.coordinates[0]], {
        fillOpacity: 0.75,
        color: "black",
        fillColor: color,
        // Adjust the radius.
        radius: (features[i].properties.mag * 100000)
      }).bindPopup(`<h1>${features[i].properties.place}</h1> 
                    <hr> <h3>Magnitude: ${features[i].properties.mag}</h3>
                    <h3>Depth: ${features[i].geometry.coordinates[2]}</h3>`)
        .addTo(markersLayer);
    
    };

    // Create a legend control
    let legendControl = L.control({ position: 'bottomright' });

    legendControl.onAdd = function (map) {
      let div = L.DomUtil.create('div', 'legend');
      div.innerHTML = '<h4>Legend</h4>' +
        '<div class="legend-item"><div class="square" style="background-color: blue;"></div> Depth <= 1</div>' +
        '<div class="legend-item"><div class="square" style="background-color: green;"></div>1 < Depth <= 10</div>' +
        '<div class="legend-item"><div class="square" style="background-color: yellow;"></div>10 < Depth <= 50</div>' +
        '<div class="legend-item"><div class="square" style="background-color: orange;"></div>50 < Depth <= 100</div>' +
        '<div class="legend-item"><div class="square" style="background-color: red;"></div>Depth > 100</div>';
      return div;
    };

    legendControl.addTo(myMap);

  };  
  initialMap();
  markersLayer.addTo(myMap);
});