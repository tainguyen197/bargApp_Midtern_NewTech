import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import logo from './logo.svg';
import './App.css';
import { promises } from 'fs';
import Async from 'react-promise'

class App extends Component {

  // Try HTML5 geolocation.
  fetchPlaces(mapProps, map) {
    const { google } = mapProps;
    const service = new google.maps.places.PlacesService(map);
    console.log("onReady");
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
  // loadMap(props) {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(function (position) {
  //       console.log(position);
  //       // state.userLocation = {
  //       //   lat: position.coords.latitude,
  //       //   lng: position.coords.longitude
  //       // };
  //       // state.loading = false;
  //       //console.log(coords);
  //     })
  //   }

  // }

  
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

    //return <Map google={google} initialCenter={userLocation} zoom={10} />;
//     const style = {
//       width: '100%',
//       height: '100%'
//     }

//     var coords = { lat: 25.9841419, lng: 108.9059114 };
//     this.loadMap(style, coords);
//     //console.log(coords);


    return (
      <div className="App">
        <Map google={this.props.google}
          //style={style}
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
          //   position={
          //     {
          //       lat: coords.lat,
          //       lng: coords.lng
          //     }
          // }
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
