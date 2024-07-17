import React from "react";
import "./maps.css";
import mapboxgl from "mapbox-gl";
import { getCellSites } from "../../../util/network";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
var map;
mapboxgl.accessToken =
  "pk.eyJ1IjoidnNza2FtYWwiLCJhIjoiY2tkcGh6bXRzMjF2aTMwcm9oMnF6dG1pNyJ9.ACZ2VOCng21xRwfj5n2XIw";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: 7.491302,
      lat: 9.072264,
      zoom: 15.5,
      markers: [],
      towerdata: [],
    };
    this.fetchCellTowers = this.fetchCellTowers.bind(this);
  }

  componentDidMount() {
    const { lng, lat, zoom, towerdata } = this.state;
    map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v9",
      center: [lng, lat],
      zoom: zoom,
    });
    this.map = map;
    map.on("dragend", () => {
        if(map.getZoom() >= 15.5){
            this.fetchCellTowers(map.getBounds());
        }
    });
    map.on('zoomend', () => {
        // console.log(`Zoom Level : ${map.getZoom()}`)
        if(map.getZoom() >= 15.5){
            this.fetchCellTowers(map.getBounds());
        }
    })
    this.fetchCellTowers(map.getBounds());

    let towersetter = (latitude, longitude, cellsite) => {
      this.props.selectTower({ latitude, longitude, cellsite });
    };
    window.towersetter = towersetter;
  }

  ts(id) {
    alert(id);
  }

  async fetchCellTowers({ _ne, _sw }) {
    console.log(_ne, _sw);
    let res = await getCellSites(null, _ne.lat, _sw.lat, _ne.lng, _sw.lng);
    for (let id = 0; id < res.length; id++) {
      let marker = new mapboxgl.Marker()
        .setLngLat([res[id].longitude, res[id].latitude])
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<div><h3>Cell Id : ${res[id].cellsite}</h3><button onclick="window.towersetter('${res[id].latitude}', '${res[id].longitude}','${res[id].cellsite}')">Select</button></div>`
          )
        )
        .addTo(map);
      // marker.getElement().addEventListener("click", () => {
      //   this.props.selectTower(res[id]);
      // });
      this.setState({ towerdata: [...this.state.towerdata, res[id]] });
    }
  }

  render() {
    return (
      <div>
        <div id="map"></div>
      </div>
    );
  }
}
export default App;
