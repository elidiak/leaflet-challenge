// URL for the USGS Earthquake GeoJSON data
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
 
// Create the base map layer
const baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
 
// Initialize the map
let map = L.map("map", {
    center: [37.09, -95.71], // Center of the US
    zoom: 3,
    layers: [baseLayer],
});
 
// Function to determine color based on earthquake depth
function getColor(depth) {
    if (depth >= -10 && depth < 10) return 'green';
    else if (depth >= 10 && depth < 30) return 'orange';
    else if (depth >= 30 && depth < 50) return 'purple';
    else if (depth >= 50 && depth < 70) return 'yellow';
    else if (depth >= 70 && depth < 90) return 'lightblue';
    else return 'red'; // for depth >= 90
}
 
// Fetch the earthquake data and create features
d3.json(url).then(function(data) {
    createLegend();
    createFeatures(data.features);
});
 
// Function to create the legend
function createLegend() {
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        let limits = [-10, 10, 30, 50, 70, 90];
        let colors = ["green", "orange", "purple", "yellow", "lightblue", "red"];
        let labels = [];
 
        // Add legend title
        let legendInfo = "<h3>Depth</h3>";
        div.innerHTML = legendInfo;
 
        // Add color squares and labels
        limits.forEach((limit, index) => {
            labels.push(
                '<i style="background:' + colors[index] + '"></i> ' +
                limit + (limits[index + 1] ? '&ndash;' + limits[index + 1] + '<br>' : '+')
            );
        });
 
        div.innerHTML += "<div>" + labels.join("") + "</div>";
        return div;
    };
    legend.addTo(map);
}
 
// Function to create earthquake features on the map
function createFeatures(earthquakeData) {
    earthquakeData.forEach(feature => {
        let [lon, lat, depth] = feature.geometry.coordinates;
        let magnitude = feature.properties.mag;
 
        L.circle([lat, lon], {
            fillOpacity: 0.5,
            color: getColor(depth),
            fillColor: getColor(depth),
            radius: magnitude * 20000 // Adjust size based on magnitude
        }).bindPopup(`
            <h3>${feature.properties.place}</h3>
            <hr>
            <p>Magnitude: ${magnitude}</p>
            <p>Depth: ${depth}</p>
            <p>Coordinates: [${lat}, ${lon}]</p>
        `).addTo(map);
    });
}