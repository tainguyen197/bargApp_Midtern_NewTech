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

  }

  loadNewLocation(ts, ts_temp) {
    fetch('http://localhost:3000/categories/lp?ts=' + ts)
      .then(results => {
        console.log(results.status);
        if (results.status === 200) {
          ts_temp = 1;
          return results.json();
        }
      }).catch(function (err) {
        console.log(err);
      }).then(data => {
        if (ts_temp === 1) {
          console.log(data);
          ts = data.return_ts;
          ts_temp = 0;
        }
        this.loadNewLocation(ts);
      })

  }

  // Try HTML5 geolocation.
  fetchPlaces(mapProps, map) {
    //const { google } = mapProps;
    //const service = new google.maps.places.PlacesService(map);
    console.log("onReady");
    var ts = 0;
    var ts_temp = 0;
    this.loadNewLocation(ts, ts_temp);

    // fetch('https://maps.googleapis.com/maps/api/geocode/json?address=khoa+hoc+tu+nhien&key=AIzaSyAoBGukMgWP82wOqAaDqkXeslb9V4jXH28')
    //   .then(results => {
    //     return results.json();
    //   }).then(data => {
    //     //lấy location(lag,lng)  dựa trên address
    //     //console.log(data.results[0].geometry.location);
    //   })
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
