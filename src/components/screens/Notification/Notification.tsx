import React, {Fragment} from 'react';
import {I18nManager, PermissionsAndroid, Platform, ScrollView, View} from 'react-native';
import {useScrollToTop} from '@react-navigation/native';
import {Icon, Divider, Dialog, Text, Button} from '@src/components/elements';
import ListRowItem from '@src/components/elements/List/ListRowItem';
import useThemeColors from '@src/custom-hooks/useThemeColors';
import {notifications, Notification} from '@src/data/mock-notification';
import styles from './styles';

import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import MapView, {PROVIDER_GOOGLE, Marker, LatLng, MapEvent, Region} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import MapViewDirections from 'react-native-maps-directions';
import Search from './Search';
import {bookRide, setRide} from '@src/utils/CartAPI';
import SuccessOrderModal from '../Checkout/PlaceOrder/SuccessOrderModal';
import Geocoder from 'react-native-geocoding';

const GOOGLE_MAPS_APIKEY = 'AIzaSyDJeAvHy9Sm9xE7QLVh4D3cg5a8AwOE-zc';
const GooglePlacesInput = () => {
  return (
    <GooglePlacesAutocomplete
      placeholder="Search"
      enablePoweredByContainer={false}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
      }}
      query={{
        key: GOOGLE_MAPS_APIKEY,
        language: 'en',
      }}
    />
  );
};

type NotificationScreenProps = {};

const NotificationScreen: React.FC<NotificationScreenProps> = () => {
  const chevronIconName = I18nManager.isRTL ? 'chevron-left' : 'chevron-right';
  const {primary} = useThemeColors();
  const scrollViewRef = React.useRef(null);
  const mapdir = React.useRef(null);
  const mapviewref = React.useRef(null);
  const [TripPrice, setTripPrice] = React.useState({error: '', results: [], loading: false});
  const [isSuccessOrderModalVisible, setIsSuccessOrderModalVisible] = React.useState(false);
  const [modalData, setmodalData] = React.useState({error: '', results: [], loading: false});
  const [currentViewR, setcurrentViewR] = React.useState({
    latitude: 30.0444,
    longitude: 31.2357,
    latitudeDelta: 0.0143,
    longitudeDelta: 0.0134,
  });
  const [state, setstate] = React.useState({
    reagon: {
      latitude: 30.0444,
      longitude: 31.2357,
      latitudeDelta: 0.0143,
      longitudeDelta: 0.0134,
    },
    region: null,
    markerLocation: null,
    destination: null,
    duration: null,
    location: null,
    distance: null,
    const: 0,
  });
  const [modalView, setmodalView] = React.useState(false);
  useScrollToTop(scrollViewRef);
  const {region, destination, reagon, markerLocation} = state;

  // const _initUserLocation = () => {
  //   Geolocation.getCurrentPosition(
  //     (position) => {
  //       const {longitude, latitude} = position.coords;
  //       setCurrentLocation((location) => {
  //         setMarkerLocation({
  //           longitude,
  //           latitude,
  //         });
  //         return {
  //           ...location,
  //           longitude,
  //           latitude,
  //         };
  //       });
  //     },
  //     (error) => {
  //       console.log(error.code, error.message);
  //     },
  //     {timeout: 15000, maximumAge: 10000},
  //   );
  // };
  React.useEffect(() => {
    const requestAndroidLocationPermission = async () => {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        title: 'Food Delivery App Permission',
        message: 'Food Delivery App needs access to your location ' + 'so you see where you are on the map.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // _initUserLocation();
      } else {
        console.log('Camera permission denied');
      }
    };

    if (Platform.OS === 'android') {
      requestAndroidLocationPermission();
    } else {
      // _initUserLocation();
    }
  }, []);
  console.log('mapdir', mapdir.current);

  const handleLocationSelected = (data, {geometry}) => {
    const {
      location: {lat: latitude, lng: longitude},
    } = geometry;
    const destination = {
      latitude,
      longitude,
      title: data.structured_formatting.main_text,
    };
    setstate({...state, destination});
  };

  const handleLocationSelectedSource = (data, {geometry}) => {
    const {
      location: {lat: latitude, lng: longitude},
    } = geometry;
    const region = {
      latitude,
      longitude,
      latitudeDelta: 0.0143,
      longitudeDelta: 0.0134,
      title: data.structured_formatting.main_text,
    };
    setstate({...state, region});
  };

  const _onMarkerDragEd = e => {
    console.log(e.nativeEvent.coordinate);
    const {latitude, longitude} = e.nativeEvent.coordinate;
    const markerLocation = {
      latitude,
      longitude,
    };
    setstate({...state, markerLocation});
  };

  const _setCurretnView = e => {
    setcurrentViewR(e.nativeEvent?.coordinate);
  };

  const _setMarkToDestination = () => {
    if (region) {
      Geocoder.from(markerLocation)
        .then(json => {
          var addressComponent = json.results[0].address_components[0];
          console.log(addressComponent);
          const destination = {
            ...markerLocation,
            title: json.results[0].address_components[0],
          };
          setstate({...state, destination, markerLocation: null});
        })
        .catch(error => console.warn(error));
    } else {
      Geocoder.from(markerLocation)
        .then(json => {
          var addressComponent = json.results[0].address_components[0];
          console.log(addressComponent);
          const region = {
            ...markerLocation,
            latitudeDelta: 0.0143,
            longitudeDelta: 0.0134,
            title: json.results[0].address_components[0],
          };
          setstate({...state, region, markerLocation: null});
        })
        .catch(error => console.warn(error));
    }
  };

  return (
    // <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps={'handled'} ref={scrollViewRef}>
    <View style={{flex: 1}} ref={scrollViewRef}>
      <Search currentLocationLabel={region?.title || ''} dest onLocationSelected={handleLocationSelectedSource} />
      <Search currentLocationLabel={destination?.title || ''} onLocationSelected={handleLocationSelected} />
      <Divider />
      <MapView
        loadingEnabled
        ref={mapviewref}
        cacheEnabled
        loadingIndicatorColor="black"
        loadingBackgroundColor="black"
        provider={PROVIDER_GOOGLE}
        toolbarEnabled
        showsScale
        showsCompass
        userLocationPriority="balanced"
        onLongPress={_onMarkerDragEd}
        onRegionChange={_setCurretnView}
        // showsUserLocation
        showsMyLocationButton
        initialRegion={{
          ...reagon,
          latitudeDelta: Math.abs(reagon.latitude - reagon.latitude) + 0.0922,
          longitudeDelta: Math.abs(reagon.longitude - reagon.longitude) + 0.0421,
        }}
        style={{
          width: '100%',
          height: '100%',
          zIndex: -100,
        }}
        // customMapStyle={darkModeStyle}
        zoomControlEnabled
        // onRegionChangeComplete={_onRegionChangeComplete}
        // region={currentLocation}
        // onPress={_onMapViewPressed}
      >
        {destination && (
          <Fragment>
            <MapViewDirections
              ref={mapdir}
              origin={region}
              destination={destination}
              apikey={GOOGLE_MAPS_APIKEY}
              onReady={result => {
                setstate({
                  ...state,
                  duration: Math.floor(result.duration),
                  distance: result.distance,
                });
                mapviewref.current.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: 50,
                    left: 50,
                    top: 50,
                    bottom: 350,
                  },
                });
              }}
            />
            <Marker coordinate={destination} />
            <Marker coordinate={region} />
            {/* <Marker coordinate={destination} anchor={{x: 0, y: 0}} image={markerImage}>
              <LocationBox>
                <LocationText>{destination.title}</LocationText>
              </LocationBox>
            </Marker> */}
            {/* 
            <Marker coordinate={region} anchor={{ x: 0, y: 0 }}>
              <LocationBox>
                <LocationTimeBox>
                  <LocationTimeText>{duration}</LocationTimeText>
                  <LocationTimeTextSmall>MIN</LocationTimeTextSmall>
                </LocationTimeBox>
                <LocationText>{location}</LocationText>
              </LocationBox>
            </Marker> */}
          </Fragment>
        )}
        {state.markerLocation && <Marker draggable coordinate={state.markerLocation} onDragEnd={_onMarkerDragEd} />}
      </MapView>
      {state.markerLocation && !!!destination && (
        <View
          style={{
            position: 'absolute',
            bottom: 20,
            width: 200,
            alignSelf: 'center',
            padding: 0,
            alignContent: 'center',
          }}>
          <Button isLoading={TripPrice.loading} onPress={() => _setMarkToDestination()}>
            <Text isWhite>تحديد النقطة الحالية</Text>
          </Button>
        </View>
      )}
      {destination && (
        <View
          style={{
            position: 'absolute',
            bottom: 20,
            width: 200,
            alignSelf: 'center',
            padding: 0,
            alignContent: 'center',
          }}>
          <Button
            isLoading={TripPrice.loading}
            onPress={() => {
              const data = {
                origin: `${state.region.latitude},${state.region.longitude}`,
                destination: `${state.destination.latitude},${state.destination.longitude}`,
                originName: `${state.region.title}`,
                destinationName: `${state.destination.title}`,
                distance_in_kilo: `${state.destination}`,
                duration_text: `${state.duration}+min`,
              };
              setRide(data, setTripPrice).then(r => {
                console.log(r);
                setstate({...state, const: r.cost});
                setmodalView(true);
              });
            }}>
            <Text isWhite> حجز الرحلة </Text>
          </Button>
        </View>
      )}
      <Dialog style={{bottom: 0}} onBackdropPress={() => setmodalView(false)} isVisible={modalView}>
        <Text isCenter> وقت الرحلة: {state.duration}</Text>
        <Text isCenter> المسافة بالكيلو: {state.distance}</Text>
        <Text isCenter> التكلفة: {state.const}</Text>
        <Button
          isLoading={modalData.loading}
          onPress={() => {
            //do=bookRide&phone=01050003138&comment=
            const d = {};
            bookRide(d, setmodalData).then(r => {
              setmodalView(false);
              setTimeout(() => {
                setIsSuccessOrderModalVisible(true);
              }, 400);
            });
          }}>
          <Text isWhite isCenter>
            {' '}
            تاكيد الحجز{' '}
          </Text>
        </Button>
      </Dialog>
      <SuccessOrderModal
        isVisible={isSuccessOrderModalVisible}
        type="trip"
        data={modalData.results}
        setIsVisble={setIsSuccessOrderModalVisible}
      />
    </View>
  );
};

export default NotificationScreen;
