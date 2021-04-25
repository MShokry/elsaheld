import * as React from 'react';
import { useTheme, useNavigation } from '@react-navigation/native';
import { Image, View } from 'react-native';
import { Text, Container, Touchable } from '@src/components/elements';
import { mockCategories } from '@src/data/mock-categories';
import styles from './styles';
import { getStoreTypes } from '@src/utils/CartAPI';
import MainContext from '@src/context/auth-context';

type PopularCategoriesProps = {};

const PopularCategories: React.FC<PopularCategoriesProps> = () => {
  const navigation = useNavigation();
  const {
    colors: { border },
  } = useTheme();
  const [contextState, contextDispatch] = React.useContext(MainContext);
  const [Cat, setCat] = React.useState({ error: '', results: [], loading: false });
  const placholder = require('@src/assets/categories/category-3.png');
  const _onButtonCategoryItemPressed = (name: string, ID: number) => {
    return () => {
      navigation.navigate('PlaceListScreen', { title: name, estoreType: ID });
    };
  };
  React.useEffect(() => {
    const rest = {
      lat: contextState.location?.latitude
        ? contextState.location?.latitude
        : 0,
      long: contextState.location?.longitude
        ? contextState.location?.longitude
        : 0
    }
    getStoreTypes(rest, setCat);
  }, []);
  if (Cat.results.length == 0) {
    return null
  }
  return (
    <Container style={styles.categoryContainer}>
      {Cat.results?.map((category) => {
        const { ID, photo, name } = category;
        return (
          <Touchable key={ID} onPress={_onButtonCategoryItemPressed(name, ID)}>
            <View style={[styles.categoryItem, { borderColor: border }]}>
              <Container>
                <Image style={styles.categoryImage} source={photo ? { uri: `https://www.ebda3-eg.com/arrivo/uploads/${photo}` } : placholder} />
              </Container>
              <Container>
                <Text style={styles.categoryTitle}>{name}</Text>
              </Container>
            </View>
          </Touchable>
        );
      })}
    </Container >
  );
};

export default PopularCategories;
