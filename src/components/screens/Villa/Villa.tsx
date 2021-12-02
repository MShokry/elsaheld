import * as React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Carousel, Section, Card, SearchBar, Container, Text, Button, Dialog} from '@src/components/elements';
import {Dimensions, FlatList, Image, Platform, SafeAreaView, StyleSheet, View} from 'react-native';
import {mockPlaces, Place} from '@src/data/mock-places';
import PlaceCardInfo from '@src/components/common/PlaceCardInfo';

import {getVilla, sendVillaRequest} from '@src/utils/CartAPI';
import {baseImages} from '@src/utils/APICONST';
import {translate as T} from '@src/utils/LangHelper';

type RecommendedPlacesProps = {};

const RecommendedPlaces: React.FC<RecommendedPlacesProps> = () => {
  const navigation = useNavigation();
  const [Places, setPlaces] = React.useState({
    error: '',
    results: [],
    loading: false,
  });
  const [CheckIn, setCheckIn] = React.useState('');
  const [CheckOut, setCheckOut] = React.useState('');
  const [adults, setadults] = React.useState('');
  const [children, setchildren] = React.useState('');
  const [rooms, setrooms] = React.useState('');
  const [propertyType, setpropertyType] = React.useState('');
  const [VillaReserve, setVillaReserve] = React.useState({error: '', results: [], loading: false});

  const [modalView, setmodalView] = React.useState(false);
  const [modalData, setmodalData] = React.useState({error: '', results: [], loading: false});

  const propertyTypes = ['شقة', 'شاليه', 'فيلا', 'استراحة', 'استوديو'];

  const _onButtonActionPressed = () => {
    navigation.navigate('PlaceListScreen', {title: 'Recommended'});
  };

  const _onPlaceItemPressed = () => {
    navigation.navigate('PlaceDetailsScreen');
  };

  React.useEffect(() => {
    const d = {
      do: 'getPropertyList',
      CheckIn,
      CheckOut,
      adults,
      children,
      rooms,
      propertyType,
    };
    getVilla(d, setPlaces);
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

  console.log(Details, getPhotos(Details));

  return (
    <SafeAreaView>
      <SearchBar placeholder={T('VillaScreen.search')} />
      <Container style={{backgroundColor: '#aaa', height: '100%'}} isLoading={Places.loading}>
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
                        setmodalView(index + 1);
                      }}>
                      <Text isBold isPrimary numberOfLines={1}>
                        احجز الان
                      </Text>
                    </Button>
                  </Container>
                </Container>
              </Container>
            );
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
          isLoading={modalData.loading}
          onPress={() => {
            //                 const d = {
            //                   id
            // CheckIn
            // CheckOut
            // adults
            // children
            // rooms
            // propertyType
            // commnet
            // phone
            // name
            //                 }
            sendVillaRequest({}, setVillaReserve);
          }}>
          <Text isWhite isCenter>
            {' '}
            تاكيد الحجز{' '}
          </Text>
        </Button>
      </Dialog>
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
    width: '100%',
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
