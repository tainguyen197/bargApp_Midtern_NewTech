import React, { Component } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import { Button, Modal } from "react-bootstrap";
import './App.css';
import LoginComponent from './LoginController';
import SockJS from 'sockjs-client'
import { userInfo } from 'os';

class App extends Component {
  constructor(props) {
    super(props);
    const me = this;
    this.updateStatusCustomer = this.updateStatusCustomer.bind(this);
    this.updateStatuMovingCustomer = this.updateStatuMovingCustomer.bind(this);
    this.updateStatusDriver = this.updateStatusDriver.bind(this);
    this.onReadyMap = this.onReadyMap.bind(this);
    this.onMarkerDragEnd = this.onMarkerDragEnd.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.getLoginComponent = this.getLoginComponent.bind(this);
    this.dataLogin = this.dataLogin.bind(this);
    this.CancelReq = this.CancelReq.bind(this);
    this.hideShowPickup = this.hideShowPickup.bind(this);

    this.hideShowEndTrip = this.hideShowEndTrip.bind(this);

    this.mapClicked = this.mapClicked.bind(this);
    this.setStateChange = this.setStateChange.bind(this);
    this.switchStandy = this.switchStandy.bind(this);
    this.test = this.test.bind(this);
    this.updateSkipStatus = this.updateSkipStatus.bind(this);
    this.state = {
      userLocation: { lat: 32, lng: 32 },
      loading: true,
      show: false,
      time: 10,
      map: null,
      isSkip: true,
      driverInfo: null,
      customerInfo: null,
      showModalLogin: true,
      showMap: false,
      showCantPickup: false,
      showEndTrip: false,
      status: 0,
      State: null,
      showChangeState: false,
      sock: null,
      messenger: {
        address: null,
        data: null
      }
    };//0: ready , 1: have customer
    this.showWays = this.showWays.bind(this);

    // Create a connection to http://localhost:9999/echo
    this.state.sock = new SockJS('http://localhost:9999/echo');

    // Open the connection
    this.state.sock.onopen = function () {
      console.log('open');

    };

    // On connection close
    this.state.sock.onclose = function () {

    };

    this.state.sock.onmessage = function (e) {
      // Get the content
      var data = JSON.parse(e.data);
      console.log(data);
      //Hiện thông báo khách hàng đầu tiên
      me.loadNewCustomer(data);
      // this.setState({ show: true });//Show thông báo có khách
      // this.setInterval();//Đếm ngược từ 10 -> 1
      // var sdt = data.categories[0].SDT;
      // console.log(sdt);
      // this.setState({ data: data.categories[0] });
      // var json = { SDT: sdt };
    };

  }

  setStateChange() {
    this.setState({
      showChangeState: false
    });
  }

  mapClicked(event) {
    this.setState({ showChangeState: true });
  }

  handleHide() {
    this.setState({ show: false });
  }


  hideShowPickup() {
    this.setState({ showCantPickup: false });
  }

  hideShowEndTrip() {
    this.setState({ showEndTrip: false });
  }

  CancelReq() {
    this.setState({
      show: false
    });
  }
  dataLogin(data) {
    this.setState({
      showModalLogin: false
    });
    this.setState({
      showMap: true
    });
    this.setState({
      driverInfo: data
    });
    this.setState({
      State: 'STANDBY'
    });

    console.log(this.state.showChangeState);
    // Send it now
    var sockdata = {
      driverInfo: this.state.driverInfo,
      location: this.state.userLocation
    }
    this.state.sock.send(JSON.stringify(sockdata));
    this.updateStatusDriver('ready');// chuyển về trạng thái ready
  }
  // Try HTML5 geolocation.
  onReadyMap(mapProps, map) {
    var ts = 0;
    var flag = 0;
    var _this = this;
    this.setState({ map: map });
    this.state.map.addListener('rightclick', function (e) {
      //this.test();
    });


  }

  test() {
    console.log('AAAAAA');
    this.setState({ showChangeState: true });

  }
  getLoginComponent() {
    if (!this.state.showModalLogin) {
      return <LoginComponent />;
    }
    return null;
  }

  loadNewCustomer(data) {
    console.log('this.loadNewCustomer');
    if (!data) {
      return;
    }
    this.setState({
      messenger: {
        data: 'Bạn muốn nhận chuyến đi này? Tự động hủy trong 10 giây',
        address: data.categories[0].DiaChi
      }
    });
    this.setState({ customerInfo: data });
    this.setState({ showCantPickup: false });
    this.setState({ show: true });//Show thông báo có khách
    this.setInterval();//Đếm ngược từ 10 -> 1 
    var sdt = data.categories[0].SDT;
    console.log(sdt);
    this.setState({ data: data.categories[0] });
    var json = { SDT: sdt };
  }

  updateStatusCustomer() {
    console.log("uopdateStatusCustomer");
    console.log(this.state.customerInfo.categories[0]);
    fetch('http://localhost:3000/customer/updateStatus', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(this.state.customerInfo.categories[0]),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "null"
      },
    })
      .catch(function (err) {
        console.log(err);
      })
  }

  updateStatuMovingCustomer() {
    console.log("updateStatuMovingCustomer");
    console.log(this.state.customerInfo.categories[0]);
    fetch('http://localhost:3000/customer/updateMovingStatus', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(this.state.customerInfo.categories[0]),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "null"
      },
    })
      .catch(function (err) {
        console.log(err);
      })
  }
  switchStandy() {
    console.log(this.state.State);
    if (this.state.State === 'READY') {
      this.setState({ State: 'STANDBY' });
      this.updateStatusDriver('ready');
      console.log('busy -> ready');
    }
    else {
      this.setState({ State: 'READY' });
      this.updateStatusDriver('busy');
      console.log('ready -> bussy');


    }
    this.setStateChange();
  }

  updateStatusDriver(state) {
    console.log("updateStatusDriver");
    var data = this.state.driverInfo;
    data[0].TrangThai = state;

    this.setState({
      driverInfo: data
    });

    // Send it now
    var sockdata = {
      driverInfo: this.state.driverInfo,
      location: this.state.userLocation
    }

    this.state.sock.send(JSON.stringify(sockdata));

    var updateStatusData = this.state.driverInfo[0];
    updateStatusData.TrangThai = state;
    console.log(updateStatusData);
    fetch('http://localhost:3000/driver/updateStatus', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(updateStatusData),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "null"
      },
    })
      .catch(function (err) {
        console.log(err);
      })
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



    var _this = this;
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
        if (distance > 1000) {
          this.setState({ showEndTrip: true });
          this.updateStatusCustomer();
        }
        else if (_this.state.status === 1) {
          this.setState({
            userLocation: {
              lag: newLat,
              lng: newLng
            }
          });
          setTimeout(this.showWays, 2000);
        }
      })
      .catch(err => console.log(err));

  }

  showWays() {
    // //Tắt thông báo
    this.setState({ show: false });
    this.setState({ status: 1 });

    var host = 'http://localhost:3000/customer/getCusInfo?';
    var SDT = this.state.data.SDT;
    var req = host + 'SDT=' + SDT;
    console.log(req);
    fetch(req)
      .then(result => {
        return result.json();
      }).then(data => {
        if (data.cusInfo[0].TrangThai === 'Moving') {
          this.setState({
            showCantPickup: true
          });
        }
        else {
          // //Update trạng thái => busy
          this.setState({
            isSkip: false
          })
          this.updateStatusDriver('busy');
          this.updateStatuMovingCustomer();
          //Lấy vị trí thông qua địa chỉ 
          var template = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
          var key = '&key=AIzaSyAoBGukMgWP82wOqAaDqkXeslb9V4jXH28'
          var req = template + this.state.data.DiaChi + key;
          console.log(req);
          fetch(req)
            .then(results => {
              return results.json();
            }).then(data => {
              //lấy location(lag,lng)  dựa trên address
              var location = data.results[0].geometry.location;
              console.log(location);
              var origin = new window.google.maps.LatLng(this.state.userLocation.lat, this.state.userLocation.lng);
              var destination = new window.google.maps.LatLng(location.lat, location.lng);
              var DirectionsService = new window.google.maps.DirectionsService;
              var directionsDisplay = new window.google.maps.DirectionsRenderer({
                draggable: true
              })
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

            })
        }
      }).catch(err => {
        //swindow.alert(err);
      })




  }

  updateSkipStatus() {
    //KIểm tra trạng thái là Done?
    var host = 'http://localhost:3000/customer/getCusInfo?';
    var SDT = this.state.data.SDT;
    var req = host + 'SDT=' + SDT;
    console.log(req);
    fetch(req)
      .then(result => {
        return result.json();
      }).then(data => {
        if (data.cusInfo[0].TrangThai === 'Done') {
          return;
        }
        console.log("AAAAAAAAAAAA");
        fetch('http://localhost:3000/customer/updateSkipStatus', {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify(this.state.customerInfo.categories[0]),
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "null"
          },
        })
          .catch(function (err) {
            console.log(err);
          })
      })
  }

  currentTime(interval, val) {
    if (val <= 0) {
      //updateSkipStatus
      var host = 'http://localhost:3000/customer/getCusInfo?';
      var SDT = this.state.data.SDT;
      var req = host + 'SDT=' + SDT;
      console.log(req);
      fetch(req)
        .then(result => {
          return result.json();
        }).then(data => {
          if (data.cusInfo[0].TrangThai === 'Wait') {
            this.updateSkipStatus();
          }
        })

      clearInterval(interval);
      this.setState({ show: false });
      this.setState({
        time: 9
      })
      return;
    }
    this.setState({
      messenger: {
        data: 'Bạn muốn nhận chuyến đi này? Tự động hủy trong ' + this.state.time + ' giây',
        address: this.state.messenger.address
      }
    });
    this.setState({
      time: val
    })
  }



  setInterval() {
    var val = 9;
    var interval = setInterval(() => this.currentTime(interval, val--), 1000);
  }

  componentWillMount() {
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
          zoom={2}
        >

          {this.state.showModalLogin && <LoginComponent sendData={this.dataLogin} />}
        </Map>

        {this.state.showMap &&
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
              draggable={true}
              onDragend={this.onMarkerDragEnd}
            ></Marker>
          </Map>}


        <Modal
          show={this.state.show}
          onHide={this.handleHide}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">
              {this.state.messenger.address}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.messenger.data}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.CancelReq}>Từ chối</Button>
            <Button onClick={this.showWays}>Bắt đầu chuyến đi</Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={this.state.showCantPickup}
          onHide={this.hideShowPickup}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">
              Thông báo
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Đã có tài xế khác nhận chuyến đi này!
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideShowPickup}>Xác nhận</Button>
          </Modal.Footer>
        </Modal>


        <Modal
          show={this.state.showEndTrip}
          onHide={this.hideShowEndTrip}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">
              Thông báo
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Chuyến đi của bạn đã kết thúc
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideShowEndTrip}>Xác nhận</Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={this.state.showChangeState}
          onHide={this.handleHide}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title">
              Thông báo
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Bạn muốn chuyển sang chế độ {this.state.State} không?
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.setStateChange}>Không</Button>
            <Button onClick={this.switchStandy}>Có</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyAoBGukMgWP82wOqAaDqkXeslb9V4jXH28")
})(App)
