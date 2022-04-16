import * as React from 'react';
import {mockPlaceList} from '@src/data/mock-places';
import {getRestaurants} from '@src/utils/CartAPI';

import PlaceListItem from '@src/components/common/PlaceListItem';
import styles from './styles';
import {useRoute} from '@react-navigation/core';
import MainContext from '@src/context/auth-context';
import {GET} from '@src/utils/APICONST';
import {FlatList, View, Image, Dimensions} from 'react-native';

import {Text, Container, Touchable, List, Carousel} from '@src/components/elements';

type PlaceListProps = {};

const PlaceList: React.FC<PlaceListProps> = () => {
  const [Places, setPlaces] = React.useState({error: '', results: [], loading: false});
  const route = useRoute();
  const [contextState, contextDispatch] = React.useContext(MainContext);

  const {params} = route;
  const [IDV, setID] = React.useState(route.params.estoreType);

  React.useEffect(() => {
    const rest = {
      id: IDV,
      lat: contextState.location?.latitude ? contextState.location?.latitude : 0,
      long: contextState.location?.longitude ? contextState.location?.longitude : 0,
    };
    getRestaurants(rest, setPlaces);
  }, [IDV]);

  console.log(params);

  return (
    <Container style={styles.root} isLoading={Places.loading}>
      <View style={{marginTop: 10, height: 40}}>
        <FlatList
          data={params.subCats || []}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => {
            const {ID, photo, name, subCats} = item;
            return (
              <Touchable
                style={[
                  {
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    backgroundColor: '#cccccc30',
                    borderRadius: 15,
                    marginLeft: 10,
                  },
                  IDV === item.ID ? {backgroundColor: '#CCCccc'} : {},
                ]}
                key={`${ID} - ${index}`}
                onPress={() => {
                  if (IDV === item.ID) {
                    setID(route.params.estoreType);
                  } else {
                    setID(item.ID);
                  }
                }}>
                <Text style={styles.categoryTitle}>{name}</Text>
              </Touchable>
            );
          }}
        />
      </View>
      <List
        data={Places.results}
        renderItem={({item}) => {
          return <PlaceListItem key={item.id} data={item} />;
        }}
      />
    </Container>
  );
};

export default PlaceList;
