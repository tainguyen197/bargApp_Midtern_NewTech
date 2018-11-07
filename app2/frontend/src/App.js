import React, { Component } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
// import logo from './logo.svg';
import './App.css';
// import { promises } from 'fs';
// import Async from 'react-promise'

class App extends Component {
  constructor(props) {
    super(props);
    this.loadNewLocation = this.loadNewLocation.bind(this);
    this.fetchPlaces = this.fetchPlaces.bind(this);
    this.createMarkerforNewLocation = this.createMarkerforNewLocation.bind(this);
    this.placeMarker = this.placeMarker.bind(this);
  }

  placeMarker(location,map) {
    console.log("added");
    var marker = new window.google.maps.Marker({
        position: location,
        map: map
    });
    this.setState(marker);

}


  createMarkerforNewLocation(address,map){
    var template = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
    var key = '&key=AIzaSyAoBGukMgWP82wOqAaDqkXeslb9V4jXH28'
    var req = template + address + key;
     fetch(req)
      .then(results => {
        return results.json();
      }).then(data => {
        //lấy location(lag,lng)  dựa trên address
        var location = data.results[0].geometry.location;
        this.placeMarker(location,map);
      })
  }

  loadNewLocation(ts, flag,map) {
    fetch('http://localhost:3000/categories/lp?ts=' + ts)
      .then(results => {
        if (results.status === 200) {
          flag = 1;
          return results.json();
        }
      }).catch(function (err) {
        console.log(err);
      }).then(data => {
        if (flag === 1) {
          flag = 0;
          data.categories.forEach(element => {
            this.createMarkerforNewLocation(element.DiaChi,map);
          });
          ts = data.return_ts;
        }
        this.loadNewLocation(ts,flag,map);
      })
  }

  // Try HTML5 geolocation.
  fetchPlaces(mapProps, map) {
    console.log("onReady");
    var ts = 0;
    var flag = 0;
    this.loadNewLocation(ts, flag,map);
  }

  mapClicked(mapProps, map, clickEvent) {
    console.log("Map Click");
    var marker = new window.google.maps.Marker({
      position:{lat: 10.748133, lng: 106.788456} ,
      map: map
  });
  }

  centerMoved(mapProps, map) {
    console.log("Camera Moved")
  }

  onMouseoverMarker(props, marker, e) {
    console.log("MouseoverMarker")
  }

  onMarkerClick = (evt) => {
  }

  state = { userLocation: { lat: 32, lng: 32 }, loading: true };
  componentDidMount(props) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;

        this.setState({
          userLocation: { lat: latitude, lng: longitude },
          loading: false
        });
      },
      () => {
        this.setState({ loading: false });
      }
    );
  }

  renderMarkers(map,maps){
    console.log("render");
  }

  render() {
    const { loading, userLocation } = this.state;

    if (loading) {
      return null;
    }

    return (
      <div className="App">
        <Map google={this.props.google}
          className={'map'}
          initialCenter={userLocation}
          zoom={15}
          onGoogleApiLoaded={({map, maps}) => this.renderMarkers(map,maps)}
          onClick ={this.mapClicked}
          onReady={this.fetchPlaces}
          onDragend={this.centerMoved}
        >
          <Marker onClick={this.onMarkerClick}
            name={'Current location'}
            onMouseover={this.onMouseoverMarker}
          />
          {/* <InfoWindow
            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
          </InfoWindow> */}
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyAoBGukMgWP82wOqAaDqkXeslb9V4jXH28")

})(App)
