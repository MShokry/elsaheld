import React, {Fragment} from 'react';
import {
  I18nManager,
  Keyboard,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';
import {useScrollToTop} from '@react-navigation/native';
import {Icon, Divider, Dialog, Text, Button, TextField, Container, SearchBar} from '@src/components/elements';
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

import MainContext from '@src/context/auth-context';

const GOOGLE_MAPS_APIKEY = 'AIzaSyCz1ikkHhlXK2JoCtkLZ6dE8JMVzlcUbsA';
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

const NotificationScreen: React.FC<NotificationScreenProps> = ({navigation}) => {
  const [contextState, contextDispatch] = React.useContext(MainContext);

  const chevronIconName = I18nManager.isRTL ? 'chevron-left' : 'chevron-right';
  const {primary} = useThemeColors();
  const scrollViewRef = React.useRef(null);
  const mapdir = React.useRef(null);
  const mapviewref = React.useRef(null);
  const [TripPrice, setTripPrice] = React.useState({error: '', results: [], loading: false});
  const [isSuccessOrderModalVisible, setIsSuccessOrderModalVisible] = React.useState(false);
  const [modalData, setmodalData] = React.useState({error: '', results: [], loading: false});
  const [requestD, setrequestD] = React.useState('');

  const isLogin = contextState.user?.user?.ID;

  const [currentViewR, setcurrentViewR] = React.useState({
    latitude: contextState.location?.latitude ? contextState.location?.latitude : 30.0444,
    longitude: contextState.location?.longitude ? contextState.location?.longitude : 31.2357,
    latitudeDelta: 0.0143,
    longitudeDelta: 0.0134,
  });
  const [state, setstate] = React.useState({
    reagon: {
      latitude: contextState.location?.latitude ? contextState.location?.latitude : 30.0444,
      longitude: contextState.location?.longitude ? contextState.location?.longitude : 31.2357,
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
  const handleLocationSelectedClear = () => {
    setstate({...state, destination: null});
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
      title: data?.structured_formatting.main_text,
    };
    setstate({...state, region});
  };
  const handleLocationSelectedSourceClear = () => {
    setstate({...state, region: null});
  };

  console.log(state);

  const _onMarkerDragEd = e => {
    console.log(e.nativeEvent.coordinate);
    const {latitude, longitude} = e.nativeEvent.coordinate;
    const markerLocation = {
      latitude,
      longitude,
    };
    if (!!!region || !!!destination) {
      setstate({...state, markerLocation});
    }
  };
  const _onsetMerk = () => {
    const markerLocation = {
      ...state.reagon,
    };
    console.log(state.reagon);

    if (!!!region || !!!destination) {
      setstate({...state, markerLocation});
    }
  };

  const _setCurretnView = e => {
    setcurrentViewR(e.nativeEvent?.coordinate);
  };

  const _setMarkToDestination = () => {
    if (region) {
      Geocoder.from(markerLocation)
        .then(json => {
          var addressComponent = json.results[0].formatted_address;
          console.log('addressComponent', json);
          const destination = {
            ...markerLocation,
            title: addressComponent,
          };
          setstate({...state, destination, markerLocation: null});
        })
        .catch(error => console.warn(error));
    } else {
      Geocoder.from(markerLocation)
        .then(json => {
          var addressComponent = json.results[0].formatted_address;
          console.log('addressComponent', json);
          const region = {
            ...markerLocation,
            latitudeDelta: 0.0143,
            longitudeDelta: 0.0134,
            title: addressComponent,
          };
          setstate({...state, region, markerLocation: null});
        })
        .catch(error => console.warn(error));
    }
  };

  return (
    // <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps={'handled'} ref={scrollViewRef}>
    <View style={{flex: 1}} ref={scrollViewRef}>
      <SafeAreaView />

      <SearchBar />
      {/* <Search
        currentLocationLabel={region?.title || ''}
        dest
        withIcon
        onLocationSelected={handleLocationSelectedSource}
        clear={handleLocationSelectedSourceClear}
        onPressIcon={_onsetMerk}
      /> */}
      {/* <Search
        currentLocationLabel={destination?.title || ''}
        onLocationSelected={handleLocationSelected}
        clear={handleLocationSelectedClear}
      /> */}
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
        showsUserLocation={!!!region}
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
        {destination && <Marker title="الي" coordinate={destination} />}
        {region && <Marker title="من" coordinate={region} onPress={a => console.log(a)} />}
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
              if (isLogin) {
                const data = {
                  origin: `${state.region.latitude},${state.region.longitude}`,
                  destination: `${state.destination.latitude},${state.destination.longitude}`,
                  originName: `${state.region.title}`,
                  destinationName: `${state.destination.title}`,
                  distance_in_kilo: `${state.distance}`,
                  duration_text: `${state.duration}+min`,
                  type: 'Order',
                };
                setRide(data, setTripPrice).then(r => {
                  console.log(r);
                  setstate({...state, const: r.cost});
                  setmodalView(true);
                });
              } else {
                navigation.navigate('Auth');
              }
            }}>
            <Text isWhite> بدء الطلب </Text>
          </Button>
        </View>
      )}
      <Dialog style={{bottom: 0}} onBackdropPress={() => setmodalView(false)} isVisible={modalView}>
        <Container style={styles.container}>
          <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <TextField
                // style={[{backgroundColor: card}, styles.phoneNumberTextField]}
                containerStyle={{height: 140}}
                style={{height: 130}}
                underlineColorAndroid="transparent"
                value={requestD}
                onChangeText={t => setrequestD(t)}
                hasMargin
                placeholder="ادخل طلبك"
                autoFocus
                multiline
                numberOfLines={10}
              />
              <Text isCenter> وقت الرحلة: {state.duration}</Text>
              <Text isCenter> المسافة بالكيلو: {state.distance}</Text>
              <Text isCenter> التكلفة للتوصيل: {state.const}</Text>
              <Button
                isLoading={modalData.loading}
                style={{marginTop: 20}}
                onPress={() => {
                  const d = {items: requestD, type: 'Order'};
                  bookRide(d, setmodalData).then(r => {
                    setmodalView(false);
                    setTimeout(() => {
                      setIsSuccessOrderModalVisible(true);
                    }, 400);
                  });
                }}>
                <Text isWhite isCenter>
                  {' '}
                  تاكيد الطلب{' '}
                </Text>
              </Button>
            </KeyboardAvoidingView>
          </ScrollView>
        </Container>
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
