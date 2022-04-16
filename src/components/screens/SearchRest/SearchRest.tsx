import * as React from 'react';
import {Button, Container, Icon, List, LoadingIndicator, SearchBar} from '@src/components/elements';
import {mockPlaceList} from '@src/data/mock-places';
import {getRestaurants, searchRestaurants} from '@src/utils/CartAPI';

import PlaceListItem from '@src/components/common/PlaceListItem';
import styles from './styles';
import {useRoute} from '@react-navigation/core';
import MainContext from '@src/context/auth-context';
import {SafeAreaView, View} from 'react-native';

type PlaceListProps = {};

const PlaceList: React.FC<PlaceListProps> = ({navigation}) => {
  const [Places, setPlaces] = React.useState({error: '', results: [], loading: true});
  const route = useRoute();
  const [contextState, contextDispatch] = React.useContext(MainContext);

  React.useEffect(() => {
    const rest = {
      word: contextState.word,
      lat: contextState.location?.latitude ? contextState.location?.latitude : 0,
      long: contextState.location?.longitude ? contextState.location?.longitude : 0,
    };
    searchRestaurants(rest, setPlaces);
  }, [contextState.word]);

  return (
    <Container style={styles.root}>
      <SafeAreaView />

      <Container style={styles.searchBarContainer}>
        <View style={styles.closeIconContainer}>
          <Button
            isTransparent
            onPress={() => {
              navigation.goBack();
            }}>
            <Icon useIonicons name="close" size={20} />
          </Button>
        </View>
        <View style={styles.searchBarIconContainer}>
          <SearchBar placeholder="ابحث عن طبق" />
        </View>
      </Container>
      {Places.loading && <LoadingIndicator size="large" hasMargin />}
      <List
        data={Places.results}
        refreshing={Places.loading}
        renderItem={({item}) => {
          return <PlaceListItem key={item.id} data={item} />;
        }}
      />
    </Container>
  );
};

export default PlaceList;
