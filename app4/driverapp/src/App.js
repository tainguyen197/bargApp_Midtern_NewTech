import React, { Component } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import {Button, Modal} from "react-bootstrap";
import axios from 'axios';
import moment from 'moment';
// import logo from './logo.svg';
import './App.css';
// import { promises } from 'fs';
// import Async from 'react-promise'

class App extends Component {
  constructor(props) {
    super(props);
    // this.loadNewLocation = this.loadNewLocation.bind(this);
    this.onReadyMap = this.onReadyMap.bind(this);
    this.createMarkerforNewLocation = this.createMarkerforNewLocation.bind(this);
    // this.placeMarker = this.placeMarker.bind(this);
    // this.updateLocation = this.updateLocation.bind(this);
    this.onMarkerDragEnd = this.onMarkerDragEnd.bind(this);
    this.loadNewCustomer = this.loadNewCustomer.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.state = { userLocation: { lat: 32, lng: 32 }, loading: true, show: false, time:10, map: null, data: null};
    this.showNewReq = this.showNewReq.bind(this);
    this.showWays = this.showWays.bind(this);
  }

  handleHide() {
    this.setState({ show: false });
  }

  showNewReq(){
    console.log("showNewReq");
    //this.setState({show: true});
  }

  // Try HTML5 geolocation.
  onReadyMap(mapProps, map) {
    console.log("onReady");
    var ts = 0;
    var flag = 0;
    this.loadNewCustomer();
    this.setState({map: map});
  }

  loadNewCustomer() {
    console.log('aaa');
    fetch('http://localhost:3000/categories/customer')
      .then(results => {
        if (results.status === 200) {
          return results.json();
        }
      }).catch(function (err) {
        console.log(err);
      }).then(data => {
        console.log(data);
        if(!data){
          setTimeout(this.loadNewCustomer, 5000);
          return;
        }
        this.setState({ show: true });
        this.setInterval();
        var sdt = data.categories[0].SDT;
        this.setState({data: data.categories[0]});
        console.log(sdt);
        setTimeout(this.loadNewCustomer, 12000);
        var json = {SDT: sdt};
        //Cập nhật trạng thái skip
        fetch('http://localhost:3000/categories/updateReq', {
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
        //this.loadNewCustomer();
      })

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

  renderMarkers(map, maps) {
    console.log("render");
  }

  onMarkerDrag() {
    console.log("HIHI");
  }

  onMarkerDragEnd(coord, index) {
    var newLat = index.getPosition().lat();
    var newLng = index.getPosition().lng();
    var newPos = { lat: newLat, lng: newLng }
    //console.log(JSON.stringify(location));
    console.log(coord.mapCenter);
    console.log(newLat);
    console.log(newLng);


    var template = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&';
    var key = '&key=AIzaSyAoBGukMgWP82wOqAaDqkXeslb9V4jXH28'
    var fromLocation = 'origins=' + coord.mapCenter.lat + ',' + coord.mapCenter.lng;
    var toLocation = '&destinations=' + newLat + ',' + newLng;
    var req = template + fromLocation + toLocation + key;
    console.log(req);
    //toa độ -> khoảng cách
    fetch(req)
      .then(response => {
        return response.json();
      }).then(data => {
        console.log(data.rows[0].elements[0].distance.value);
        var distance = data.rows[0].elements[0].distance.value
        this.showNewReq();
        if (distance > 1000) {
          if (window.confirm('Vị trí không được quá 100m, vui lòng cập nhật lại vị trí!')) this.onCancel();
          //
          //console.log(this.state.lo);
          
        }
      })
      .catch(err => console.log(err));

  }

  createMarkerforNewLocation() {
    var template = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
    var key = '&key=AIzaSyAoBGukMgWP82wOqAaDqkXeslb9V4jXH28'
    var req = template + this.state.data.DiaChi + key;
    console.log(req);
    fetch(req)
      .then(results => {
        return results.data.data;
      }).then(data => {
        //lấy location(lag,lng)  dựa trên address
        var location = data.results[0].geometry.location;
        var marker = new window.google.maps.Marker({
          position: { lat: 10.748133, lng: 106.788456 },
          map: this.state.map,
          animation: window.google.maps.Animation.BOUNCE,
          draggable: true
        });
      })
  }

  showWays(){
    //Lấy vị trí thông qua địa chỉ 
    console.log(this.state.data);
    //this.createMarkerforNewLocation();
    
    var origin = new window.google.maps.LatLng(this.state.userLocation.lat, this.state.userLocation.lng);
    var destination =  new window.google.maps.LatLng(10.748133, 106.788456);
    var DirectionsService = new window.google.maps.DirectionsService;
    var directionsDisplay = new window.google.maps.DirectionsRenderer;
    directionsDisplay.setMap(this.state.map);
    //Hiển thị marker tại location của customer
    DirectionsService.route({
      origin: origin,
      destination: destination,
      travelMode: window.google.maps.TravelMode.DRIVING,
    }, (result, status) => {
      if (status === 'OK') {
        directionsDisplay.setDirections(result);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });

    
  }

  // calculateAndDisplayRoute(directionsService, directionsDisplay) {
  //   directionsService.route({
  //     origin: document.getElementById('start').value,
  //     destination: document.getElementById('end').value,
  //     travelMode: 'DRIVING'
  //   }, function(response, status) {
  //     if (status === 'OK') {
  //       directionsDisplay.setDirections(response);
  //     } else {
  //       window.alert('Directions request failed due to ' + status);
  //     }
  //   });

    //Show đường đi đến location customer
      
  //   //this.setState(marker);
  //   //Sự kiện có sự kéo thả marker
  //   marker.addListener('dragend', function () {
  //     var newLat = marker.getPosition().lat();
  //     var newLng = marker.getPosition().lng();
  //     //console.log(JSON.stringify(location));
  //     //this.updateLocation(lat,lng);
  //     var template = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
  //     var key = '&key=AIzaSyAoBGukMgWP82wOqAaDqkXeslb9V4jXH28'
  //     var newLocation = newLat + ',' + newLng;
  //     var req = template + newLocation + key;
  //     //toa độ -> địa chỉ thực
  //     fetch(req)
  //       .then(results => {
  //         return results.json();
  //       }).then(data => {
  //         //lấy location(lag,lng)  dựa trên address
  //         var address = data.results[0].formatted_address;
  //         //console.log(address);
  //         var json = {SDT: element.SDT, DiaChi: address};
  //         console.log(json);
  //         fetch('http://localhost:3000/categories/update', {
  //           method: 'POST',
  //           mode: 'cors',
  //           body: JSON.stringify(json),
  //           headers: {
  //             "Content-Type": "application/json; charset=utf-8",
  //             "Access-Control-Allow-Origin": "null"
  //         },
  //         }).then(function (response) {
  //           console.log(response);
  //           return response.json();
  //         }).catch(function (err){
  //           console.log(err);
  //         }).
  //         then(function (data) {
  //           console.log(data);
  //         });
  //       })
  //   });
  // }

  //}

  currentTime(interval,val){
    if(val === 0){
      clearInterval(interval);
      this.setState({show: false});
      return;
    }
    this.setState({
      time: val
    })
  }

  setInterval(){
    var val = 10;
    var interval =  setInterval(() => this.currentTime(interval, val--),1000);
  }

  componentWillMount(){
    //this.setInterval();
  }

  //state = { userLocation: { lat: 32, lng: 32 }, loading: true, show: false };
  componentDidMount(props) {
    console.log(props);
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
          zoom={13}
          onGoogleApiLoaded={({ map, maps }) => this.renderMarkers(map, maps)}
          onClick={this.mapClicked}
          onReady={this.onReadyMap}
          onDragend={this.centerMoved}
        >
          <Marker
            onClick={this.onMarkerClick}
            draggable={true}
            onDragend={this.onMarkerDragEnd}
          ></Marker>
        </Map>
        <Modal
          show={this.state.show}
          onHide={this.handleHide}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">
              Contained Modal
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
           Bạn muốn nhận chuyến đi này? Tự động hủy trong {this.state.time} giây
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.showWays}>Bắt đầu chuyến đi</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyAoBGukMgWP82wOqAaDqkXeslb9V4jXH28")
})(App)
