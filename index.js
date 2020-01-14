const start = L.icon({
    iconUrl: 'assets/start.svg',
    iconSize: [35, 35],
    iconAnchor: [17.5, 17.5],
    popupAnchor: [0, -17.5]
});

const finish = L.icon({
    iconUrl: 'assets/finish.svg',
    iconSize: [35, 35],
    iconAnchor: [17.5, 17.5],
    popupAnchor: [0, -17.5]
});

const burger = L.icon({
    iconUrl: 'assets/burger.svg',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
});

async function getPoints(){
    const response = await fetch("points.json");
    const json = await response.json();
    return json;
}

function main(){
    const map = L.map('map');
    const attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> | Map icons by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a>';
    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tiles = L.tileLayer(tileUrl, { attribution });
    tiles.addTo(map);

    getPoints().then(json => {
        //extract every point from the JSON
        const points = json.points;
        const route = [];
        for(let i = 0; i < points.length; i++){
            let waypoint = {latLng:L.latLng(points[i].latitude, points[i].longitude), name:"<b>"+points[i].location+"</b>"};
            //sneakily attach the region to the waypoint
            waypoint.region = points[i].region;
            route.push(waypoint);
        }
        //Creating marker clusters
        //currently hard-coded, but should be implemented dynamically on a real app
        const sanJoseCluster = L.markerClusterGroup();
        const cartagoCluster = L.markerClusterGroup();
        //options for the routing control
        //the route is passed via the waypoints property
        L.Routing.control({ 
            addWaypoints: false,
            draggableWaypoints: false,
            waypoints: route,
            //this property is a function that defines how the markers are rendered
            createMarker: 
                (i, waypoint, n) => {
                    let icon = null;
                    if(i == 0)
                        icon = start;
                    else if(i == n-1)
                        icon = finish;
                    else
                        icon = burger;
                    
                    marker = L.marker(waypoint.latLng, {icon}).bindPopup(waypoint.name);

                    //adding marker to corresponding cluster
                    if(waypoint.region == "San José")
                        sanJoseCluster.addLayer(marker);
                    else if(waypoint.region == "Cartago")
                        cartagoCluster.addLayer(marker);

                    return marker;
                }
        }).addTo(map);
        //adding the cluster layers to the map
        map.addLayer(sanJoseCluster);
        map.addLayer(cartagoCluster);
    });
}