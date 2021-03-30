import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Carousel, Section, Card, LoadingIndicator } from '@src/components/elements';
import { Dimensions } from 'react-native';
import { mockPlaces, Resturant } from '@src/data/mock-places';
import PlaceCardInfo from '@src/components/common/PlaceCardInfo';
import AuthContext from '@src/context/auth-context';
import * as DataBase from '@src/utils/AsyncStorage';
import { translate as T } from '@src/utils/LangHelper';
import useThemeColors from '@src/custom-hooks/useThemeColors';
import { getRestaurants } from '@src/utils/CartAPI';
import LottieView from 'lottie-react-native';

type PopularPlacesProps = {};

const PopularPlaces: React.FC<PopularPlacesProps> = ({place}) => {
  console.log(place);
  
  const { card, primary, background } = useThemeColors();
  const [Places, setPlaces] = React.useState({ error: '', results: place?.Restaurants||[], loading: false });
  // const [contextState, contextDispatch] = React.useContext(AuthContext);

  const navigation = useNavigation();

  const _onButtonActionPressed = () => {
    navigation.navigate('PlaceListScreen', { title: 'Popular Near You' });
  };

  const _onPlaceItemPressed = (item) => {
    navigation.navigate('PlaceDetailsScreen', item);
  };

  React.useEffect(() => {
    // getRestaurants(setPlaces);
  }, []);
  if (Places.loading) {
    return (<LoadingIndicator size="large" hasMargin />)
  }
  return (
    <Section
      title={place?.Name ||"Popular Near You"}
      actionButtonText="View more"
      onButtonActionPressed={_onButtonActionPressed}>

        <Carousel
          data={Places.results}
          hasParallaxImages
          itemWidth={Dimensions.get('window').width - 50}
          renderContent={(item: Resturant, index, parallaxProps) => {
            const { photo, name, details } = item;
            return (
              <Card
                coverImage={{ uri: `https://www.ebda3-eg.com/arrivo/uploads/${photo}` }}
                title={name || ' '}
                subTitle={details || ' '}
                parallaxProps={parallaxProps}
                onPress={() => _onPlaceItemPressed(item)}>
                <PlaceCardInfo data={item} />
              </Card>
            );
          }}
        />
      
    </Section>
  );
};

export default PopularPlaces;
