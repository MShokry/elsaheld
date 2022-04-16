import * as React from 'react';
import {useNavigation, useTheme} from '@react-navigation/native';
import {Carousel, Container, Text, Button, Dialog, TextField} from '@src/components/elements';
import {Dimensions, Image, Platform, SafeAreaView, StyleSheet, View, TouchableWithoutFeedback} from 'react-native';

import {sendVillaRequest} from '@src/utils/CartAPI';
import {baseImages} from '@src/utils/APICONST';
import SuccessOrderModal from '../SuccessOrderModal';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AuthContext from '@src/context/auth-context';

import moment from 'moment';
import {TouchableHighlight} from 'react-native-gesture-handler';
import EnterPhone from '@src/components/elements/enterPhone';

type VillaDetailsProps = {};

const {width, height} = Dimensions.get('window');

const VillaDetails: React.FC<VillaDetailsProps> = ({route}) => {
  const navigation = useNavigation();
  const [contextState, contextDispatch] = React.useContext(AuthContext);
  const {
    colors: {text, background},
  } = useTheme();
  const user = contextState.user?.user || {};

  const [Places, setPlaces] = React.useState({
    error: '',
    results: [],
    loading: false,
  });
  const Today = moment(new Date()).format('YYYY-MM-DD');

  const [CheckIn, setCheckIn] = React.useState(Today);
  const [isArrive, setisArrive] = React.useState(false);

  const [CheckOut, setCheckOut] = React.useState(Today);
  const [isLeav, setisLeav] = React.useState(false);

  const [adults, setadults] = React.useState('');
  const [children, setchildren] = React.useState('');
  const [rooms, setrooms] = React.useState('');
  const [name, setname] = React.useState(user?.name);
  const [phone, setphone] = React.useState(user?.phone);
  const [commnet, setcommnet] = React.useState('');

  const [propertyType, setpropertyType] = React.useState('');
  const [VillaReserve, setVillaReserve] = React.useState({error: '', results: [], loading: false});

  const [modalView, setmodalView] = React.useState(false);
  const [resView, setresView] = React.useState(false);
  const [modalData, setmodalData] = React.useState({error: '', results: [], loading: false});

  const [isSuccessOrderModalVisible, setIsSuccessOrderModalVisible] = React.useState(false);
  const [isPhone, setisPhone] = React.useState(false);

  const propertyTypes = ['شقة', 'شاليه', 'فيلا', 'استراحة', 'استوديو'];

  const _onButtonActionPressed = () => {
    navigation.navigate('PlaceListScreen', {title: 'Recommended'});
  };

  const _onPlaceItemPressed = () => {
    navigation.navigate('PlaceDetailsScreen');
  };

  const {params} = route;
  const Details = params;

  const getPhotos = it => {
    let Photos = [];
    for (let index = 0; index < 6; index++) {
      const element = index ? it?.[`photo${index}`] : it?.photo;
      if (element) {
        Photos.push(element);
      }
    }
    return Photos;
  };

  // console.log('Details', Details, getPhotos(Details));
  const id = Details.ID;

  const diffDays = moment(CheckOut).diff(moment(CheckIn), 'days') || 1;
  const DaysAll = diffDays > 0 ? diffDays : 0;
  const DayPrice = parseInt(Details.pricePerNight);
  return (
    <SafeAreaView>
      <Container
        style={{backgroundColor: '#28282815', height: '100%', paddingHorizontal: 20}}
        isLoading={Places.loading}>
        {/* <Image source={{ uri: `${baseImages}${P[0]}` }} style={styles.coverImage} resizeMode="stretch" /> */}
        <View style={{width: '100%'}}>
          <Carousel
            data={getPhotos(Details)}
            itemWidth={width - 80}
            sliderWidth={width - 40}
            renderContent={pic => {
              return (
                // <View style={styles.coverImageContainer2}>
                <TouchableHighlight onPress={() => setmodalView(true)}>
                  <>
                    <Image source={{uri: `${baseImages}${pic}`}} style={styles.coverImage2} resizeMode="stretch" />
                  </>
                </TouchableHighlight>
                // </View>
              );
            }}
            hasPagination
            enableSnap={true}
            // enableSnap={false}
          />
        </View>
        <Text>اسم القرية : {Details?.area}</Text>
        <Text>المنطقة : {Details?.specialMarque}</Text>
        <Text>نوع العقار : {propertyTypes[Details?.typeProperty - 1]}</Text>
        <Text>تطل على : {Details?.view}</Text>
        <Text>المساحه : {Details?.areaProperty}</Text>
        <Text>سعر الليلة : {Details?.pricePerNight}</Text>
        <Text>عدد الأشخاص : {Details?.adults}</Text>
        <Text>عدد الغرف : {Details?.roomsNumber}</Text>
        <Text>طريقة الدفع : {Details?.paymentMethod}</Text>
        <Text>نوع المعلن : {Details?.sale}</Text>
        <Text>تاريخ النشر : {Details?.advertiser}</Text>
        <Text>الشروط : {Details?.add_date}</Text>
        <Button
          isLoading={VillaReserve.loading}
          onPress={() => {
            setresView(true);
          }}>
          <Text isWhite isCenter>
            {' '}
            طلب حجز{' '}
          </Text>
        </Button>
      </Container>
      <Dialog style={{bottom: 0, width, height}} onBackdropPress={() => setmodalView(false)} isVisible={!!modalView}>
        <View style={{height: height - 120}}>
          <Carousel
            data={getPhotos(Details)}
            itemWidth={width - 80}
            sliderWidth={width - 40}
            renderContent={pic => {
              return (
                <TouchableWithoutFeedback onPress={() => setmodalView(false)}>
                  <Image
                    source={{uri: `${baseImages}${pic}`}}
                    style={{width: width - 60, height: height - 120, resizeMode: 'contain'}}
                    resizeMode="stretch"
                  />
                </TouchableWithoutFeedback>
              );
            }}
            // hasPagination
            enableSnap={true}
            // enableSnap={false}
          />
        </View>
      </Dialog>
      <Dialog style={{bottom: 0}} onBackdropPress={() => setresView(false)} isVisible={!!resView}>
        <>
          <Text isSecondary isCenter>
            عدد الليالي {DaysAll}
          </Text>
          <Text isCenter>
            التكلفة {DaysAll * DayPrice}
            {'\n'}
          </Text>
          <DateTimePickerModal
            isVisible={isArrive}
            mode="date"
            date={CheckIn ? new Date(CheckIn) : new Date()}
            minimumDate={new Date()}
            onConfirm={v => {
              setisArrive(false);
              setCheckIn(v);
            }}
            onCancel={() => setisArrive(false)}
          />
          <DateTimePickerModal
            isVisible={isLeav}
            mode="date"
            date={CheckOut ? new Date(CheckOut) : new Date()}
            minimumDate={CheckIn ? new Date(CheckIn) : new Date()}
            onConfirm={v => {
              setisLeav(false);
              setCheckOut(v);
            }}
            onCancel={() => setisLeav(false)}
          />

          <TouchableWithoutFeedback onPress={() => setisArrive(true)}>
            <View style={{marginBottom: 10}}>
              <View
                style={{
                  padding: 12,
                  borderRadius: 15,
                  height: 45,
                  backgroundColor: background,
                  fontFamily: 'Cairo-Light',
                }}>
                <Text>{moment(CheckIn).format('DD-MMMM-YYYY')} </Text>
              </View>
              {CheckIn ? (
                <Text isSecondary style={{alignSelf: 'flex-start', position: 'absolute', top: -5, left: 10}}>
                  ميعاد الوصول
                </Text>
              ) : null}
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => setisLeav(true)}>
            <View style={{marginBottom: 10}}>
              <View
                style={{
                  padding: 12,
                  borderRadius: 15,
                  height: 45,
                  backgroundColor: background,
                  fontFamily: 'Cairo-Light',
                }}>
                <Text>{moment(CheckOut).format('DD-MMMM-YYYY')} </Text>
              </View>
              {CheckOut ? (
                <Text isSecondary style={{alignSelf: 'flex-start', position: 'absolute', top: -5, left: 10}}>
                  ميعاد المغادرة
                </Text>
              ) : null}
            </View>
          </TouchableWithoutFeedback>
          <View>
            <TextField
              value={adults}
              hasMargin
              placeholder=" عدد الاشخاص "
              keyboardType="number-pad"
              onChangeText={(t: string) => setadults(t)}
            />
            {adults ? (
              <Text isSecondary style={{alignSelf: 'flex-start', position: 'absolute', top: -5, left: 10}}>
                عدد الاشخاص
              </Text>
            ) : null}
          </View>
          <View>
            <TextField
              value={children}
              hasMargin
              placeholder=" عدد الاطفال "
              keyboardType="number-pad"
              onChangeText={(t: string) => setchildren(t)}
            />
            {children ? (
              <Text isSecondary style={{alignSelf: 'flex-start', position: 'absolute', top: -5, left: 10}}>
                عدد الاطفال
              </Text>
            ) : null}
          </View>
          <View>
            <TextField
              value={rooms}
              hasMargin
              placeholder=" عدد الغرف "
              keyboardType="number-pad"
              onChangeText={(t: string) => setrooms(t)}
            />
            {rooms ? (
              <Text isSecondary style={{alignSelf: 'flex-start', position: 'absolute', top: -5, left: 10}}>
                عدد الغرف
              </Text>
            ) : null}
          </View>
          <View>
            <TextField value={name} hasMargin placeholder="  الاسم " onChangeText={(t: string) => setname(t)} />
            {name ? (
              <Text isSecondary style={{alignSelf: 'flex-start', position: 'absolute', top: -5, left: 10}}>
                الاسم
              </Text>
            ) : null}
          </View>
          <View>
            <TextField
              value={phone}
              hasMargin
              keyboardType="number-pad"
              placeholder=" رقم الهاتف  "
              onChangeText={(t: string) => setphone(t)}
            />
            {phone ? (
              <Text isSecondary style={{alignSelf: 'flex-start', position: 'absolute', top: -5, left: 10}}>
                رقم الهاتف
              </Text>
            ) : null}
          </View>
          <View>
            <TextField
              value={commnet}
              hasMargin
              placeholder=" ملاحظات   "
              onChangeText={(t: string) => setcommnet(t)}
            />
            {commnet ? (
              <Text isSecondary style={{alignSelf: 'flex-start', position: 'absolute', top: -5, left: 10}}>
                الملاحظات
              </Text>
            ) : null}
          </View>
          <Button
            isLoading={VillaReserve.loading}
            onPress={() => {
              if (!contextState.isPhoneActive) {
                setisPhone(true);
                //show modal to enter the phone
              } else {
                const d = {
                  id,
                  CheckIn: moment(CheckIn).format('YYYY-MM-DD'),
                  CheckOut: moment(CheckOut).format('YYYY-MM-DD'),
                  adults,
                  children,
                  propertyType,
                  commnet,
                  phone,
                  name,
                };
                sendVillaRequest({id: Details.ID, ...d}, setVillaReserve).then(e => {
                  setresView(false);
                  setTimeout(() => {
                    setIsSuccessOrderModalVisible(true);
                  }, 500);
                });
              }
            }}>
            <Text isWhite isCenter>
              ارسل الطلب
            </Text>
          </Button>
        </>
      </Dialog>
      <EnterPhone isVisible={isPhone} hide={() => setisPhone(false)} />
      <SuccessOrderModal
        type="Villa"
        isVisible={isSuccessOrderModalVisible}
        setIsVisble={setIsSuccessOrderModalVisible}
      />
    </SafeAreaView>
  );
};

export default VillaDetails;

const styles = StyleSheet.create({
  card: {
    // backgroundColor: 'white',
    marginLeft: 5,
    marginRight: 5,
    padding: 10,
    borderRadius: 10,
    shadowColor: '#ccc',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
    marginBottom: 10,
  },
  icon: {
    width: 20,
    height: 20,
  },
  coverImageContainer: {
    height: '100%',
    width: 140,
    padding: 10,
    backgroundColor: 'transparent',
  },
  coverImageContainer2: {
    padding: 10,
    width: 180,
  },
  coverImage2: {
    width: width - 90,
    height: width - 90,
    resizeMode: 'contain',
  },
  coverImageSmallContainer: {
    height: 120,
    padding: 10,
    backgroundColor: 'transparent',
  },
  coverImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    // borderRadius: 10,
    marginTop: 15,
    resizeMode: 'contain',
  },
  parallaxImageContainer: {
    flex: 1,
    marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
  },
  cardBody: {
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
  },
  cardTitle: {
    marginTop: 5,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    marginTop: 2,
    marginBottom: 10,
    fontSize: 12,
  },
  buttonPlus: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    width: '100%',
    borderWidth: 1,
  },
});
