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
    this.updateLocation = this.updateLocation.bind(this);

  }

  //Hiển thị marker tại location
  placeMarker(location, map,element) {
    var marker = new window.google.maps.Marker({
      position: location,
      map: map,
      animation: window.google.maps.Animation.BOUNCE,
      draggable: true
    });
    //this.setState(marker);
    //Sự kiện có sự kéo thả marker
    marker.addListener('dragend', function () {
      var newLat = marker.getPosition().lat();
      var newLng = marker.getPosition().lng();
      //console.log(JSON.stringify(location));
      //this.updateLocation(lat,lng);
      var template = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
      var key = '&key=AIzaSyAoBGukMgWP82wOqAaDqkXeslb9V4jXH28'
      var newLocation = newLat + ',' + newLng;
      var req = template + newLocation + key;
      //toa độ -> địa chỉ thực
      fetch(req)
        .then(results => {
          return results.json();
        }).then(data => {
          //lấy location(lag,lng)  dựa trên address
          var address = data.results[0].formatted_address;
          //console.log(address);
          var json = {SDT: element.SDT, DiaChi: address};
          console.log(json);
          fetch('http://localhost:3000/categories/update', {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(json),
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Access-Control-Allow-Origin": "null"
          },
          }).then(function (response) {
            console.log(response);
            return response.json();
          }).catch(function (err){
            console.log(err);
          }).
          then(function (data) {
            console.log(data);
          });
        })
    });
  }

  updateLocation(address) {
    console.log(address);


  }

  createMarkerforNewLocation(element, map) {
    var template = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
    var key = '&key=AIzaSyAoBGukMgWP82wOqAaDqkXeslb9V4jXH28'
    var req = template + element.DiaChi + key;
    //console.log(address);
    fetch(req)
      .then(results => {
        return results.json();
      }).then(data => {
        //lấy location(lag,lng)  dựa trên address
        var location = data.results[0].geometry.location;

        this.placeMarker(location, map, element);
      })
  }

  loadNewLocation(ts, flag, map) {
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
            this.createMarkerforNewLocation(element, map);
          });
          ts = data.return_ts;
        }
        this.loadNewLocation(ts, flag, map);
      })
  }

  // Try HTML5 geolocation.
  fetchPlaces(mapProps, map) {
    console.log("onReady");
    var ts = 0;
    var flag = 0;
    this.loadNewLocation(ts, flag, map);
  }

  makerDragend(marker) {
    console.log(marker);
  }

  mapClicked(mapProps, map, clickEvent) {
    console.log("Map Click");
    var marker = new window.google.maps.Marker({
      position: { lat: 10.748133, lng: 106.788456 },
      map: map,

    });
  }

  centerMoved(mapProps, map) {
    console.log("Camera Moved")
  }

  onMouseoverMarker(props, marker, e) {
    console.log("MouseoverMarker")
  }

  onMarkerClick = (evt) => {
    console.log('a');
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

  renderMarkers(map, maps) {
    console.log("render");
  }

  onMarkerDragEnd(coord, index) {
    console.log(coord);
    console.log(index);
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
          zoom={13}
          onGoogleApiLoaded={({ map, maps }) => this.renderMarkers(map, maps)}
          onClick={this.mapClicked}
          onReady={this.fetchPlaces}
          onDragend={this.centerMoved}
        >
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ("YOUR_KEY")

})(App)
