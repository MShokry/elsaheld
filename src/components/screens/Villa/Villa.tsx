import * as React from 'react';
import {useNavigation, useTheme} from '@react-navigation/native';
import {Carousel, Section, Container, Text, Button, Dialog, TextField, RadioButton} from '@src/components/elements';
import {FlatList, Image, Platform, SafeAreaView, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';

import {getVilla, sendVillaRequest} from '@src/utils/CartAPI';
import {baseImages} from '@src/utils/APICONST';
import SuccessOrderModal from '../Checkout/PlaceOrder/SuccessOrderModal';

import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import {FloatingAction} from 'react-native-floating-action';

type RecommendedPlacesProps = {};

const RecommendedPlaces: React.FC<RecommendedPlacesProps> = () => {
  const navigation = useNavigation();
  const [Places, setPlaces] = React.useState({
    error: '',
    results: [],
    loading: false,
  });

  const {
    colors: {text, background},
  } = useTheme();

  const [resView, setresView] = React.useState(false);
  const Today = moment(new Date()).format('YYYY-MM-DD');

  const [CheckIn, setCheckIn] = React.useState(Today);
  const [isArrive, setisArrive] = React.useState(false);

  const [CheckOut, setCheckOut] = React.useState(Today);
  const [isLeav, setisLeav] = React.useState(false);
  console.log('CheckIn', CheckIn);

  const [area, setarea] = React.useState('');
  const [adults, setadults] = React.useState('');
  const [children, setchildren] = React.useState('');
  const [rooms, setrooms] = React.useState('');
  const propertyTypes = ['شقة', 'شاليه', 'فيلا', 'استراحة', 'استوديو'];

  const [propertyType, setpropertyType] = React.useState('شقة');
  const [VillaReserve, setVillaReserve] = React.useState({error: '', results: [], loading: false});

  const [modalView, setmodalView] = React.useState(false);
  const [modalData, setmodalData] = React.useState({error: '', results: [], loading: false});

  const [isSuccessOrderModalVisible, setIsSuccessOrderModalVisible] = React.useState(false);

  const PT = propertyTypes.map(i => ({value: i, label: i}));
  const _onButtonActionPressed = () => {
    navigation.navigate('PlaceListScreen', {title: 'Recommended'});
  };

  const _onPlaceItemPressed = () => {
    navigation.navigate('PlaceDetailsScreen');
  };
  const clear = () => {
    setCheckIn(Today);
    setCheckOut(Today);
    setadults('');
    setchildren('');
    setrooms('');
    setpropertyType(null);
    setarea('');
  };
  const reload = clear => {
    const d = !!clear
      ? {
          do: 'getPropertyList',
          CheckIn: Today,
          CheckOut: Today,
        }
      : {
          do: 'getPropertyList',
          CheckIn: CheckIn ? moment(CheckIn).format('YYYY-MM-DD') : Today,
          CheckOut: CheckOut ? moment(CheckOut).format('YYYY-MM-DD') : Today,
          adults,
          children,
          rooms,
          propertyType,
          area,
        };
    getVilla(d, setPlaces);
  };

  React.useEffect(() => {
    reload();
  }, []);
  const Details = modalView ? Places.results?.Result?.[modalView - 1] : {};

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

  console.log('Details', Details, getPhotos(Details));

  const actions = [
    {
      text: 'بحث',
      icon: require('@src/assets/filter.png'),
      name: 'Search',
      position: 1,
    },
    {
      text: 'مسح',
      icon: require('@src/assets/cross.png'),
      name: 'clear',
      position: 2,
    },
  ];
  return (
    <SafeAreaView>
      {/* <SearchBar placeholder={T('VillaScreen.search')} /> */}
      <Container style={{backgroundColor: '#28282815', height: '100%'}} isLoading={Places.loading}>
        <FlatList
          data={Places.results?.Result || []}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingTop: 20, paddingBottom: 180}}
          keyExtractor={({item, index}) => item}
          renderItem={({item, index, parallaxProps}) => {
            const {photo, small_pic, area, view, pricePerNight, adults, areaProperty} = item;
            const P = getPhotos(item);
            return (
              <Container key={item} style={[{backgroundColor: '#fff'}, styles.card]}>
                <Container
                  style={{
                    flexDirection: 'row',
                    backgroundColor: 'transparent',
                    justifyContent: 'center',
                  }}>
                  <Container style={styles.coverImageContainer}>
                    <Image
                      source={small_pic ? {uri: `${baseImages}${small_pic}`} : {uri: `${baseImages}${photo}`}}
                      style={styles.coverImage}
                      resizeMode="stretch"
                    />
                  </Container>
                  {/* <Carousel
                    data={getPhotos(Details)}
                    itemWidth={120}
                    renderContent={(pic) => {
                      return <Container style={styles.coverImageContainer}>
                        <Image
                          source={small_pic ? { uri: `${baseImages}${small_pic}` } : { uri: `${baseImages}${photo}` }}
                          style={styles.coverImage}
                          resizeMode="stretch"
                        />
                      </Container>
                    }}
                    // enableSnap={false}
                  /> */}
                  <Container style={styles.cardBody}>
                    <Text numberOfLines={1} style={[styles.cardSubtitle]}>
                      {pricePerNight} لليلة
                    </Text>
                    <Text style={[styles.cardSubtitle]}>
                      تطل علي {view} - {area}
                    </Text>
                    <Text
                      isBold
                      numberOfLines={1}
                      style={[styles.cardSubtitle, {textAlignVertical: 'center', color: '#000'}]}>
                      <Image
                        source={require('../../../assets/app/person.png')}
                        style={styles.icon}
                        resizeMode="contain"
                      />{' '}
                      {adults} شخص{' '}
                      <Image
                        source={require('../../../assets/app/size.png')}
                        style={styles.icon}
                        resizeMode="contain"
                      />{' '}
                      {areaProperty} متر
                    </Text>
                    <Text style={[styles.cardSubtitle]}></Text>
                    <Button
                      padding={0}
                      style={styles.buttonPlus}
                      isTransparent
                      onPress={() => {
                        // setmodalView(index + 1);
                        navigation.navigate('VillaDetails', {...item});
                      }}>
                      <Text isBold isPrimary numberOfLines={1}>
                        التفاصيل
                      </Text>
                    </Button>
                  </Container>
                </Container>
              </Container>
            );
          }}
        />
        <FloatingAction
          actions={actions}
          onPressItem={name => {
            if (name === 'Search') {
              setresView(true);
            } else {
              clear();
              setTimeout(() => {
                reload(true);
              }, 100);
            }
            console.log(`selected button: ${name}`);
          }}
        />
      </Container>
      <Dialog style={{bottom: 0}} onBackdropPress={() => setmodalView(false)} isVisible={!!modalView}>
        {/* <Carousel
          data={Photos}
          renderContent={({ item }) => <Image source={{ uri: `${baseImages}${item}` }} style={styles.coverImageContainer} resizeMode="contain" />}
          itemWidth={275}
          enableSnap={false}
        /> */}
        {/* <Image source={{ uri: `${baseImages}${P[0]}` }} style={styles.coverImage} resizeMode="stretch" /> */}
        <View style={{width: '100%', alignContent: 'center', justifyContent: 'center'}}>
          <Carousel
            data={getPhotos(Details)}
            itemWidth={180}
            sliderWidth={210}
            renderContent={pic => {
              return (
                <View style={styles.coverImageContainer2}>
                  <Image source={{uri: `${baseImages}${pic}`}} style={styles.coverImage2} resizeMode="stretch" />
                </View>
              );
            }}
            hasPagination
            enableSnap={true}
            // enableSnap={false}
          />
        </View>
        <Text isCenter>اسم القرية : {Details?.area}</Text>
        <Text isCenter>المنطقة : {Details?.specialMarque}</Text>
        <Text isCenter>نوع العقار : {propertyTypes[Details?.typeProperty - 1]}</Text>
        <Text isCenter>تطل على : {Details?.view}</Text>
        <Text isCenter>المساحه : {Details?.areaProperty}</Text>
        <Text isCenter>سعر الليلة : {Details?.pricePerNight}</Text>
        <Text isCenter>عدد الأشخاص : {Details?.adults}</Text>
        <Text isCenter>عدد الغرف : {Details?.roomsNumber}</Text>
        <Text isCenter>طريقة الدفع : {Details?.paymentMethod}</Text>
        <Text isCenter>نوع المعلن : {Details?.sale}</Text>
        <Text isCenter>تاريخ النشر : {Details?.advertiser}</Text>
        <Text isCenter>الشروط : {Details?.add_date}</Text>
        <Button
          isLoading={VillaReserve.loading}
          onPress={() => {
            sendVillaRequest({id: Details.ID}, setVillaReserve).then(e => {
              setmodalView(false);
              setTimeout(() => {
                setIsSuccessOrderModalVisible(true);
              }, 500);
            });
          }}>
          <Text isWhite isCenter>
            {' '}
            طلب حجز{' '}
          </Text>
        </Button>
      </Dialog>

      <Dialog style={{bottom: 0}} onBackdropPress={() => setresView(false)} isVisible={!!resView}>
        <>
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
            <TextField value={area} hasMargin placeholder="اسم القرية" onChangeText={(t: string) => setarea(t)} />
            {area ? (
              <Text isSecondary style={{alignSelf: 'flex-start', position: 'absolute', top: -5, left: 10}}>
                اسم القرية
              </Text>
            ) : null}
          </View>
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
          <Section title="اختر نوع العقار">
            <RadioButton defaultValue={propertyType} data={PT} onItemPressed={e => setpropertyType(e)} />
          </Section>
          <Button
            onPress={() => {
              setresView(false);
              reload();
            }}>
            <Text isWhite isCenter>
              بحث
            </Text>
          </Button>
        </>
      </Dialog>
      <SuccessOrderModal isVisible={isSuccessOrderModalVisible} setIsVisble={setIsSuccessOrderModalVisible} />
    </SafeAreaView>
  );
};

export default RecommendedPlaces;

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
    width: 140,
    height: 140,
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
