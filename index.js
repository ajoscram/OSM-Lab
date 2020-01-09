markerOptions = {
    riseOnHover: true
}

async function getPoints(){
    const response = await fetch("points.json");
    const json = await response.json();
    return json;
}

function main(){
    const map = L.map('map').setView([9.7095171, -84.2432125], 8);
    const atribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tiles = L.tileLayer(tileUrl, { atribution });
    tiles.addTo(map);

    getPoints().then(json => {
        const points = json.points;
        const route = [];
        for(i = 0; i < points.length; i++){
            let waypoint = {latLng:L.latLng(points[i].latitude, points[i].longitude), name:points[i].location};
            route.push(waypoint);
        }
        L.Routing.control({waypoints:route}).addTo(map);
    });
}