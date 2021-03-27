import * as React from 'react';
import { Animated, SafeAreaView, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Container, Text, LoadingIndicator } from '@src/components/elements';
import HeadingInformation from './HeadingInformation';
import PopularDishes from './PopularDishes';
import TabSectionList from '@src/components/elements/TabSectionList';
import DishItem from '@src/components/common/DishItem';
import { mockPlaceDetails as placeDetailsData1 } from '@src/data/mock-places';
import styles from './styles';
import BasketSummary from './BasketSummary';
import AuthContext from '@src/context/auth-context';
import * as DataBase from '@src/utils/AsyncStorage';
import { translate as T } from '@src/utils/LangHelper';
import { getMenu } from '@src/utils/CartAPI';

type PlaceDetailsProps = {};

const PlaceDetails: React.FC<PlaceDetailsProps> = ({ route }) => {
  const {
    colors: { primary, border, card },
  } = useTheme();
  const [Places, setPlaces] = React.useState({ error: '', results: [], loading: true });
  const [contextState, contextDispatch] = React.useContext(AuthContext);

  const Resturant = route.params || {};
  const [scrollY] = React.useState(new Animated.Value(0));

  const coverTranslateY = scrollY.interpolate({
    inputRange: [-4, 0, 10],
    outputRange: [-2, 0, 3],
  });

  const coverScale = scrollY.interpolate({
    inputRange: [-200, 0],
    outputRange: [2, 1],
    extrapolateRight: 'clamp',
  });

  const tabBarOpacity = scrollY.interpolate({
    inputRange: [200, 500],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  React.useEffect(() => {
    getMenu(Resturant?.ID, setPlaces);
  }, []);
  if (Places.loading) {
    return (<LoadingIndicator size="large" hasMargin />)
  }
  const placeDetailsData = Places.results;
  // placeDetailsData.data = placeDetailsData.Menu;
  placeDetailsData.data = placeDetailsData.Menu?.map((item) => {
    return { ...item, data: item.MenuList }
  });
  console.log("placeDetailsData", placeDetailsData.data?.length);
  return (
    <SafeAreaView style={styles.rootContainer}>
      <View style={styles.tabSectionListContainer}>
        {!!placeDetailsData?.data?.length &&
          <TabSectionList
            ListHeaderComponent={
              <>
                <Animated.View
                  style={[
                    styles.coverPhotoContainer,
                    {
                      transform: [
                        {
                          translateY: coverTranslateY,
                        },
                      ],
                    },
                  ]}>
                  {Resturant.photo && (
                    <Animated.Image
                      source={{ uri: `https://www.ebda3-eg.com/arrivo/uploads/${Resturant.photo}` }}
                      style={[
                        styles.coverPhoto,
                        {
                          transform: [
                            {
                              scale: coverScale,
                            },
                          ],
                        },
                      ]}
                    />
                  )}
                </Animated.View>
                <HeadingInformation data={Resturant} />
                {/* <PopularDishes /> */}
              </>
            }
            sections={placeDetailsData.data || []}
            data={(item) => item.MenuList}
            keyExtractor={(item) => item.ID.toString()}
            stickySectionHeadersEnabled={false}
            scrollToLocationOffset={5}
            tabBarStyle={[styles.tabBar, { opacity: tabBarOpacity }]}
            tabBarScrollViewStyle={{ backgroundColor: card }}
            ItemSeparatorComponent={() => (
              <Container style={[styles.separator, { backgroundColor: border }]} />
            )}
            renderTab={({ name, isActive }) => {
              const borderBottomWidth = isActive ? 2 : 0;
              return (
                <Container
                  style={{
                    borderBottomWidth,
                    borderColor: primary,
                  }}>
                  <Text isPrimary={isActive && true} style={styles.tabText}>
                    {name}
                  </Text>
                </Container>
              );
            }}
            renderSectionHeader={({ section }) => (
              <Text style={styles.sectionHeaderText}>{section.name}</Text>
            )}
            renderItem={({ item }) => {
              return <DishItem data={item} />;
            }}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      y: scrollY,
                    },
                  },
                },
              ],
              {
                useNativeDriver: true,
              },
            )}
          />
        }
      </View>
      <BasketSummary />
    </SafeAreaView>
  );
};
export default PlaceDetails;
