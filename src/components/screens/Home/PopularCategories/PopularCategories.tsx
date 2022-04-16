import * as React from 'react';
import {useTheme, useNavigation} from '@react-navigation/native';
import {Image, View, Dimensions, ImageBackground} from 'react-native';
import {Text, Container, Touchable, List, Carousel} from '@src/components/elements';

import styles from './styles';
import {getStoreTypes} from '@src/utils/CartAPI';
import MainContext from '@src/context/auth-context';
import {baseImages} from '@src/utils/APICONST';
import {FlatList} from 'react-native-gesture-handler';

var {width} = Dimensions.get('window');

type PopularCategoriesProps = {list: boolean};
// [x] ToDo remove border edge and circle image
const PopularCategories: React.FC<PopularCategoriesProps> = ({list}) => {
  const navigation = useNavigation();
  const {
    colors: {border},
  } = useTheme();
  const [contextState, contextDispatch] = React.useContext(MainContext);
  const [Cat, setCat] = React.useState({
    error: '',
    results: [],
    loading: false,
  });
  const placholder = require('@src/assets/categories/category-3.png');
  const _onButtonCategoryItemPressed = (name: string, ID: number, subCats: any, item: any) => {
    return () => {
      navigation.navigate('PlaceListScreen', {...item, title: name, estoreType: ID, subCats});
    };
  };
  React.useEffect(() => {
    const rest = {
      lat: contextState.location?.latitude ? contextState.location?.latitude : 0,
      long: contextState.location?.longitude ? contextState.location?.longitude : 0,
    };
    getStoreTypes(rest, setCat);
  }, []);
  if (Cat.results?.length === 0) {
    return null;
  }
  return (
    <>
      {list ? (
        <Container style={styles.categoryContainer}>
          <FlatList
            data={Cat.results || []}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => {
              const {ID, photo, name, subCats} = item;
              return (
                <Touchable
                  style={{width: Dimensions.get('screen').width / 5.4}}
                  key={`${ID} - ${index}`}
                  onPress={_onButtonCategoryItemPressed(name, ID, subCats, item)}>
                  <View style={[styles.categoryItemList, {borderColor: border}]}>
                    <Container>
                      <Image
                        style={styles.categoryImage}
                        source={photo ? {uri: `${baseImages}${photo}`} : placholder}
                      />
                    </Container>
                    <Container>
                      <Text style={styles.categoryTitle}>{name}</Text>
                    </Container>
                  </View>
                </Touchable>
              );
            }}
          />
        </Container>
      ) : (
        <View style={styles.categoryContainer2}>
          {Cat.results?.map((category, idx) => {
            const {ID, photo, name, subCats} = category;
            return (
              <ImageBackground
                key={ID}
                source={photo ? {uri: `https://www.elsahel.co/category/${photo}`} : placholder}
                style={{
                  width: width / 2 - 8,
                  height: width / 2 - 8,
                  margin: 4,
                }}>
                <Touchable
                  key={ID}
                  style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                  // style={[styles.categoryItem, {borderColor: border}, idx ? {height: 100} : {height: 200}]}
                  onPress={_onButtonCategoryItemPressed(name, ID, subCats)}>
                  {/* <Container>
                    <Image style={styles.categoryImage} source={photo ? {uri: `${baseImages}${photo}`} : placholder} />
                  </Container> */}
                  {/* <Text style={styles.categoryTitle}>{name}</Text> */}
                </Touchable>
              </ImageBackground>
            );
          })}
        </View>
      )}
    </>
  );
};

export default PopularCategories;
