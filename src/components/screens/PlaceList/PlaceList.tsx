import * as React from 'react';
import { Container, List } from '@src/components/elements';
import { mockPlaceList } from '@src/data/mock-places';
import { getRestaurants } from '@src/utils/CartAPI';

import PlaceListItem from '@src/components/common/PlaceListItem';
import styles from './styles';
import { useRoute } from '@react-navigation/core';

type PlaceListProps = {};

const PlaceList: React.FC<PlaceListProps> = () => {
  const [Places, setPlaces] = React.useState({ error: '', results: [], loading: false });
  const route = useRoute();

  React.useEffect(() => {
    getRestaurants(route.params.estoreType, setPlaces);
  }, []);

  return (
    <Container style={styles.root}>
      <List
        data={Places.results}
        renderItem={({ item }) => {
          return <PlaceListItem key={item.id} data={item} />;
        }}
      />
    </Container>
  );
};

export default PlaceList;
