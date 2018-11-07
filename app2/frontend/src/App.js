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

  placeMarker(location) {
    //console.log(this.props.google.maps);
    var marker = new window.google.maps.Marker({
        position: location,
        map: this.props.google.maps
    });

}


  createMarkerforNewLocation(address){
    var template = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
    var key = '&key=AIzaSyAoBGukMgWP82wOqAaDqkXeslb9V4jXH28'
    var req = template + address + key;
     fetch(req)
      .then(results => {
        return results.json();
      }).then(data => {
        //lấy location(lag,lng)  dựa trên address
        var location = data.results[0].geometry.location;
        this.placeMarker(location);
      })
  }

  loadNewLocation(ts, flag) {
    fetch('http://localhost:3000/categories/lp?ts=' + ts)
      .then(results => {
        console.log(results.status);
        if (results.status === 200) {
          flag = 1;
          return results.json();
        }
      }).catch(function (err) {
        console.log(err);
      }).then(data => {
        if (flag === 1) {
          data.categories.forEach(element => {
            this.createMarkerforNewLocation(element.DiaChi);
          });
          ts = data.return_ts;
          flag = 0;
        }
        this.loadNewLocation(ts);
      })
  }

  // Try HTML5 geolocation.
  fetchPlaces(mapProps, map) {
    console.log("onReady");
    var ts = 0;
    var flag = 0;
    this.loadNewLocation(ts, flag);

   
  }

  mapClicked(mapProps, map, clickEvent) {
    console.log("Map Click")
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
          onClick={this.mapClicked}
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
