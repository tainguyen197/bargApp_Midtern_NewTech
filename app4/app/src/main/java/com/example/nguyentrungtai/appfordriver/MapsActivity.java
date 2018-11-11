package com.example.nguyentrungtai.appfordriver;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.location.Location;
import android.os.AsyncTask;
import android.support.annotation.NonNull;
import android.support.design.widget.FloatingActionButton;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.FragmentActivity;
import android.os.Bundle;
import android.support.v4.content.ContextCompat;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.akexorcist.googledirection.DirectionCallback;
import com.akexorcist.googledirection.GoogleDirection;
import com.akexorcist.googledirection.constant.AvoidType;
import com.akexorcist.googledirection.model.Direction;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.places.GeoDataClient;
import com.google.android.gms.location.places.Place;
import com.google.android.gms.location.places.PlaceDetectionClient;
import com.google.android.gms.location.places.PlaceFilter;
import com.google.android.gms.location.places.PlaceLikelihood;
import com.google.android.gms.location.places.PlaceLikelihoodBufferResponse;
import com.google.android.gms.location.places.Places;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.Polyline;
import com.google.android.gms.maps.model.PolylineOptions;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class MapsActivity extends FragmentActivity implements OnMapReadyCallback {

    private GoogleMap mMap;
    private ArrayList<LatLng> listStep;
    private PolylineOptions polyline;
    private boolean mLocationPermissionGranted;
    public static final int PERMISSIONS_REQUEST_ACCESS_FINE_LOCATION = 1;
    private FusedLocationProviderClient mFusedLocationProviderClient;
    private Location mLastKnownLocation;
    private static final int DEFAULT_ZOOM = 15;
    private GeoDataClient mGeoDataClient;
    private PlaceDetectionClient mPlaceDetectionClient;
    private final LatLng mDefaultLocation = new LatLng(-33.8523341, 151.2106085);
    private static final String TAG = MapsActivity.class.getSimpleName();
    private static final int M_MAX_ENTRIES = 5;
    private String[] mLikelyPlaceNames;
    private String[] mLikelyPlaceAddresses;
    private String[] mLikelyPlaceAttributions;
    private LatLng[] mLikelyPlaceLatLngs;
    private  Button btnPlace;
    // Keys for storing activity state.
    private static final String KEY_CAMERA_POSITION = "camera_position";
    private static final String KEY_LOCATION = "location";
    FloatingActionButton floatLocation;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_maps);
        // Obtain the SupportMapFragment and get notified when the map is ready to be used.

        listStep = new ArrayList<LatLng>();
        polyline = new PolylineOptions();



        // Add a default marker, because the user hasn't selected a place.

//        MarkerOptions option = new MarkerOptions();
//        option.position(KHTN);
//        option.title("Äáº¡i Há»c Khoa Há»c Tá»± NhiÃªn TP.HCM").snippet("Sá»‘ 227 Nguyá»…n VÄƒn Cá»«, Quáº­n 5");
//        //option.icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_RED));
//        option.alpha(0.8f);
//        option.rotation(0);
//        Marker maker = mMap.addMarker(option);
//        maker.showInfoWindow();
//

//        MarkerOptions option2 = new MarkerOptions();
//        option2.position(PhoDiBoNguyenHue);
//        option2.title("Phá»‘ Äi Bá»™ Nguyá»…n Huá»‡").snippet("Quáº­n 1 , TP.HCM");
//        //option2.icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_RED));
//        option2.alpha(0.8f);
//        option2.rotation(0);
//        Marker maker2 = mMap.addMarker(option2);


        final AsyncTask<Void, Void, Void> showLocationRealtime = new AsyncTask<Void, Void, Void>() {

            @Override
            protected Void doInBackground(Void... params) {

                // 227 Nguyá»…n VÄƒn Cá»« : 10.762643, 106.682079
                // Phá»‘ Ä‘i bá»™ Nguyá»…n Huá»‡ : 10.774467, 106.703274

                String request = makeURL("10.762643","106.682079","10.774467","106.703274");
                request = "https://maps.googleapis.com/maps/api/directions/json?origin=place_id:ChIJh3821B0vdTERL1kjqcodgF4&destination=place_id:ChIJrcz65EYvdTERhiIP_40M1Yw&key=AIzaSyAoBGukMgWP82wOqAaDqkXeslb9V4jXH28";
                GetDirectionsTask task = new GetDirectionsTask(request);
                ArrayList<LatLng> list = task.testDirection();
                for (LatLng latLng : list) {
                    listStep.add(latLng);
                }
                return null;
            }
            @Override
            protected void onPostExecute(Void result) {
                // TODO Auto-generated method stub
                super.onPostExecute(result);
                polyline.addAll(listStep);
                Polyline line = mMap.addPolyline(polyline);
                line.setColor(Color.BLUE);
                line.setWidth(5);
            }
        };

        final AsyncTask<Void, Void, Void> task = new AsyncTask<Void, Void, Void>() {

            @Override
            protected Void doInBackground(Void... params) {

                // 227 Nguyá»…n VÄƒn Cá»« : 10.762643, 106.682079
                // Phá»‘ Ä‘i bá»™ Nguyá»…n Huá»‡ : 10.774467, 106.703274

                String request = makeURL("10.762643","106.682079","10.774467","106.703274");
                request = "https://maps.googleapis.com/maps/api/directions/json?origin=place_id:ChIJh3821B0vdTERL1kjqcodgF4&destination=place_id:ChIJrcz65EYvdTERhiIP_40M1Yw&key=AIzaSyAoBGukMgWP82wOqAaDqkXeslb9V4jXH28";
                GetDirectionsTask task = new GetDirectionsTask(request);
                ArrayList<LatLng> list = task.testDirection();
                for (LatLng latLng : list) {
                    listStep.add(latLng);
                }
                return null;
            }
            @Override
            protected void onPostExecute(Void result) {
                // TODO Auto-generated method stub
                super.onPostExecute(result);
                polyline.addAll(listStep);
                Polyline line = mMap.addPolyline(polyline);
                line.setColor(Color.BLUE);
                line.setWidth(5);
            }
        };
        floatLocation = findViewById(R.id.floatingActionButton);
        // Construct a GeoDataClient.
        mGeoDataClient = Places.getGeoDataClient(this, null);
        // Construct a PlaceDetectionClient.
        mPlaceDetectionClient = Places.getPlaceDetectionClient(this, null);
        // Construct a FusedLocationProviderClient.
        mFusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(this);
        floatLocation.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                task.execute();
            }
        });
//        btnPlace = findViewById(R.id.btnPlace);
//
//        btnPlace.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                showCurrentPlace();
//            }
//        });

        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);


        //Toast.makeText(this, "onCreate", Toast.LENGTH_SHORT).show();
    }

    public String makeURL (String sourcelat, String sourcelng, String destlat, String destlng ){
        StringBuilder urlString = new StringBuilder();
        urlString.append("https://maps.googleapis.com/maps/api/directions/json");
        urlString.append("?origin=");// from
        urlString.append(sourcelat);
        urlString.append(",");
        urlString.append(sourcelng);
        urlString.append("&destination=");// to
        urlString.append(",");
        urlString.append(destlat);
        urlString.append(destlng);
        urlString.append("&key="+getResources().getString(R.string.google_maps_key));
        Log.i("AAAAAAAAAAAAAAAAAAAAAAA",urlString.toString());
        return urlString.toString();
    }

    /**
     * Saves the state of the map when the activity is paused.
     */
    @Override
    protected void onSaveInstanceState(Bundle outState) {
        if (mMap != null) {
            outState.putParcelable(KEY_CAMERA_POSITION, mMap.getCameraPosition());
            outState.putParcelable(KEY_LOCATION, mLastKnownLocation);
            super.onSaveInstanceState(outState);
        }
    }

//    private void showCurrentPlace() {
//        if (mMap == null) {
//            Toast.makeText(this, "mapp = null", Toast.LENGTH_SHORT).show();
//
//            return;
//
//        }
//        Toast.makeText(this, "showCurrentPlace", Toast.LENGTH_SHORT).show();
//
//        if (mLocationPermissionGranted) {
//            // Get the likely places - that is, the businesses and other points of interest that
//            // are the best match for the device's current location.
//            List<String> placeType = new ArrayList();
//            placeType.add(Integer.toString(Place.TYPE_BUS_STATION));
//            PlaceFilter filter = new PlaceFilter(false, placeType);
//
//            @SuppressWarnings("MissingPermission") final
//            Task<PlaceLikelihoodBufferResponse> placeResult =
//                    mPlaceDetectionClient.getCurrentPlace(filter);
//            placeResult.addOnCompleteListener
//                    (new OnCompleteListener<PlaceLikelihoodBufferResponse>() {
//                        @Override
//                        public void onComplete(@NonNull Task<PlaceLikelihoodBufferResponse> task) {
//                            if (task.isSuccessful() && task.getResult() != null) {
//                                PlaceLikelihoodBufferResponse likelyPlaces = task.getResult();
//
//                                // Set the count, handling cases where less than 5 entries are returned.
//                                int count;
//                                if (likelyPlaces.getCount() < M_MAX_ENTRIES) {
//                                    count = likelyPlaces.getCount();
//
//                                } else {
//                                    count = M_MAX_ENTRIES;
//                                }
//
//                                int i = 0;
//                                mLikelyPlaceNames = new String[count];
//                                mLikelyPlaceAddresses = new String[count];
//                                mLikelyPlaceAttributions = new String[count];
//                                mLikelyPlaceLatLngs = new LatLng[count];
//
//                                for (PlaceLikelihood placeLikelihood : likelyPlaces) {
//                                    // Build a list of likely places to show the user.
//                                    mLikelyPlaceNames[i] = (String) placeLikelihood.getPlace().getName();
//                                    mLikelyPlaceAddresses[i] = (String) placeLikelihood.getPlace()
//                                            .getAddress();
//                                    mLikelyPlaceAttributions[i] = (String) placeLikelihood.getPlace()
//                                            .getAttributions();
//                                    mLikelyPlaceLatLngs[i] = placeLikelihood.getPlace().getLatLng();
//
//                                    i++;
//                                    if (i > (count - 1)) {
//                                        break;
//                                    }
//                                }
//
//                                // Release the place likelihood buffer, to avoid memory leaks.
//                                likelyPlaces.release();
//
//                                // Show a dialog offering the user the list of likely places, and add a
//                                // marker at the selected place.
//                                openPlacesDialog();
//
//                            } else {
//                                Log.e(TAG, "Exception: %s", task.getException());
//                            }
//                        }
//                    });
//        } else {
//            Toast.makeText(this, "The user did not grant location permission", Toast.LENGTH_SHORT).show();
//
//            // The user has not granted permission.
//            Log.i(TAG, "The user did not grant location permission.");
//
//            // Add a default marker, because the user hasn't selected a place.
//            mMap.addMarker(new MarkerOptions()
//                    .title(getString(R.string.default_info_title))
//                    .position(mDefaultLocation)
//                    .snippet(getString(R.string.default_info_snippet)));
//
//            // Prompt the user for permission.
//            getLocationPermission();
//        }
//    }

    private void openPlacesDialog() {
        // Ask the user to choose the place where they are now.
        Log.i(TAG, "openPlacesDialog");

        DialogInterface.OnClickListener listener = new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                // The "which" argument contains the position of the selected item.
                LatLng markerLatLng = mLikelyPlaceLatLngs[which];
                String markerSnippet = mLikelyPlaceAddresses[which];
                if (mLikelyPlaceAttributions[which] != null) {
                    markerSnippet = markerSnippet + "\n" + mLikelyPlaceAttributions[which];
                }

                // Add a marker for the selected place, with an info window
                // showing information about that place.
                mMap.addMarker(new MarkerOptions()
                        .title(mLikelyPlaceNames[which])
                        .position(markerLatLng));

                // Position the map's camera at the location of the marker.
                mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(markerLatLng,
                        DEFAULT_ZOOM));
            }
        };

        // Display the dialog.
        AlertDialog dialog = new AlertDialog.Builder(this)
                .setTitle(R.string.pick_place)
                .setItems(mLikelyPlaceNames, listener)
                .show();
    }

    /**
     * Manipulates the map once available.
     * This callback is triggered when the map is ready to be used.
     * This is where we can add markers or lines, add listeners or move the camera. In this case,
     * we just add a marker near Sydney, Australia.
     * If Google Play services is not installed on the device, the user will be prompted to install
     * it inside the SupportMapFragment. This method will only be triggered once the user has
     * installed Google Play services and returned to the app.
     */
    @Override
    public void onRequestPermissionsResult(int requestCode,
                                           @NonNull String permissions[],
                                           @NonNull int[] grantResults) {
        //Toast.makeText(this, "onRequestPermissionsResult", Toast.LENGTH_SHORT).show();
        mLocationPermissionGranted = false;
        switch (requestCode) {
            case PERMISSIONS_REQUEST_ACCESS_FINE_LOCATION: {
                // If request is cancelled, the result arrays are empty.
                if (grantResults.length > 0
                        && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    mLocationPermissionGranted = true;
                }
            }
        }
        updateLocationUI();
    }

    private void getLocationPermission() {
        //Toast.makeText(this, "getLocationPermission", Toast.LENGTH_SHORT).show();
        /*
         * Request location permission, so that we can get the location of the
         * device. The result of the permission request is handled by a callback,
         * onRequestPermissionsResult.
         */
        if (ContextCompat.checkSelfPermission(this.getApplicationContext(),
                android.Manifest.permission.ACCESS_FINE_LOCATION)
                == PackageManager.PERMISSION_GRANTED) {
            mLocationPermissionGranted = true;
        } else {
            ActivityCompat.requestPermissions(this,
                    new String[]{android.Manifest.permission.ACCESS_FINE_LOCATION},
                    PERMISSIONS_REQUEST_ACCESS_FINE_LOCATION);
        }
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
        //Toast.makeText(this, "onMapReady", Toast.LENGTH_SHORT).show();

        mMap = googleMap;

        // Prompt the user for permission.
        getLocationPermission();

        // Turn on the My Location layer and the related control on the map.
        updateLocationUI();

        // Get the current location of the device and set the position of the map.
        getDeviceLocation();

        LatLng KHTN = new LatLng(10.762643, 106.682079);
        LatLng PhoDiBoNguyenHue = new LatLng(10.774467, 106.703274);


        // Add a default marker, because the user hasn't selected a place.
        mMap.addMarker(new MarkerOptions()
                .title("Khoa Hoc Tu Nhien")
                .position(KHTN)
                .snippet(getString(R.string.default_info_snippet)));

        mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(KHTN,17));

        mMap.addMarker(new MarkerOptions()
                .title("Phố đi bộ")
                .position(PhoDiBoNguyenHue)
                .snippet(getString(R.string.default_info_snippet)));

    }

    public void getDirection(){
        GoogleDirection.withServerKey("AIzaSyAoBGukMgWP82wOqAaDqkXeslb9V4jXH28")
                .from(new LatLng(mLastKnownLocation.getLatitude(), mLastKnownLocation.getLongitude()))
                .to(new LatLng(12.986397,108.9086252))
                .avoid(AvoidType.FERRIES)
                .avoid(AvoidType.HIGHWAYS)
                .execute(new DirectionCallback() {
                    @Override
                    public void onDirectionSuccess(Direction direction, String rawBody) {
                        if(direction.isOK()) {
                            Toast.makeText(MapsActivity.this, "OK", Toast.LENGTH_SHORT).show();
                        } else {

                            Toast.makeText(MapsActivity.this, direction.getStatus(), Toast.LENGTH_SHORT).show();
                        }
                    }

                    @Override
                    public void onDirectionFailure(Throwable t) {
                        Toast.makeText(MapsActivity.this, "Fail", Toast.LENGTH_SHORT).show();
                    }
                });
    }

    private void updateLocationUI() {
        //Toast.makeText(this, "updateLocationUI", Toast.LENGTH_SHORT).show();

        if (mMap == null) {
            return;
        }
        try {
            if (mLocationPermissionGranted) {
                mMap.setMyLocationEnabled(true);
                mMap.getUiSettings().setMyLocationButtonEnabled(true);
            } else {
                mMap.setMyLocationEnabled(false);
                mMap.getUiSettings().setMyLocationButtonEnabled(false);
                mLastKnownLocation = null;
                getLocationPermission();
            }
        } catch (SecurityException e)  {
            Log.e("Exception: %s", e.getMessage());
        }
    }

    private void getDeviceLocation() {
        //Toast.makeText(this, "getDeviceLocation", Toast.LENGTH_SHORT).show();

        /*
         * Get the best and most recent location of the device, which may be null in rare
         * cases when a location is not available.
         */
        try {
            if (mLocationPermissionGranted) {
                Task locationResult = mFusedLocationProviderClient.getLastLocation();
                locationResult.addOnCompleteListener(this, new OnCompleteListener() {
                    @Override
                    public void onComplete(@NonNull Task task) {
                        if (task.isSuccessful()){
                            // Set the map's camera position to the current location of the device.
                            mLastKnownLocation = (Location) task.getResult();
                            mMap.addMarker(new MarkerOptions()
                                    .title("test")
                                    .position(new LatLng(mLastKnownLocation.getLatitude(),mLastKnownLocation.getLongitude())));
                            mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(
                                    new LatLng(mLastKnownLocation.getLatitude(),
                                            mLastKnownLocation.getLongitude()), DEFAULT_ZOOM));

                        } else {

                            Log.d(TAG, "Current location is null. Using defaults.");
                            Log.e(TAG, "Exception: %s", task.getException());
                            mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(mDefaultLocation, DEFAULT_ZOOM));
                            mMap.getUiSettings().setMyLocationButtonEnabled(false);
                        }
                    }
                });
            }
        } catch(SecurityException e)  {
            Log.e("Exception: %s", e.getMessage());

        }
    }
}
