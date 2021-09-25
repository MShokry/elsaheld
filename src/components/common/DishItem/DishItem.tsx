import * as React from 'react';
import { Image, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Container, Text, Touchable } from '@src/components/elements';
import { Dish } from '@src/data/mock-places';
import styles from './styles';
import { baseImages } from '@src/utils/APICONST';

type DishItemProps = {
  data: Dish;
};

const DishItem: React.FC<DishItemProps> = ({ data }) => {
  const { price, name, description, photo } = data;
  const navigation = useNavigation();

  const _onPlaceItemPressed = (DishData) => {
    navigation.navigate('DishDetailsModal', DishData);
  };

  return (
    <Touchable onPress={() => _onPlaceItemPressed(data)}>
      <Container style={styles.container}>
        {photo ? <Image style={styles.image} source={{ uri: `${baseImages}${photo}` }} /> : null}
        <View style={styles.placeInfoContainer}>
          <View style={styles.placeInfo}>
            <Text style={styles.placeTitle}>{`${name}`}</Text>
            <Text style={styles.placeSubTitle}>{`${description}`}</Text>
            <Text isPrimary isBold>
              {`${price}`} EGP
            </Text>
          </View>
        </View>
      </Container>
    </Touchable>
  );
};

export default DishItem;
