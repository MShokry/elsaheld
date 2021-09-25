import * as React from 'react';
import { useFocusEffect, useScrollToTop } from '@react-navigation/native';
import { ScrollView, SafeAreaView, InteractionManager } from 'react-native';
import { SearchBar, LoadingIndicator } from '@src/components/elements';
import Categories from './Categories';
import RecommendedPlaces from './RecommendedPlaces';
import MerchantCampaigns from './MerchantCampaigns';
import PopularCategories from './PopularCategories';
import HotDeals from './HotDeals';
import RemarkablePlaces from './RemarkablePlaces';
import { getHome } from '@src/utils/CartAPI';
// import AppReviewModal from '@src/components/common/AppReviewModal';
import { translate as T } from '@src/utils/LangHelper';
import MainContext from '@src/context/auth-context';
import { baseImages } from '@src/utils/APICONST';

type HomeProps = {};

const Home: React.FC<HomeProps> = () => {
  const [isNavigationTransitionFinished, setIsNavigationTransitionFinished] =
    React.useState(false);
  const [Places, setPlaces] = React.useState({
    error: '',
    results: [],
    loading: false,
  });
  const [contextState, contextDispatch] = React.useContext(MainContext);

  const scrollViewRef = React.useRef(null);

  useScrollToTop(scrollViewRef);
  console.log(contextState);

  useFocusEffect(
    React.useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        setIsNavigationTransitionFinished(true);
      });
      return () => task.cancel();
    }, []),
  );

  React.useEffect(() => {
    const rest = {
      lat: contextState.location?.latitude
        ? contextState.location?.latitude
        : 0,
      long: contextState.location?.longitude
        ? contextState.location?.longitude
        : 0,
    };
    getHome(rest, setPlaces);
  }, []);
  const Cats = Places.results || [];
  return (
    <SafeAreaView>
      <ScrollView ref={scrollViewRef} stickyHeaderIndices={[0]}>
        <SearchBar placeholder={T('HomeScreen.search')} />
        <PopularCategories />
        <MerchantCampaigns />

        {isNavigationTransitionFinished ? (
          <>
            {Cats.map(place => {
              return <Categories place={place} />;
            })}
            {/* <PopularPlaces /> */}
            {/* <MerchantCampaigns /> */}
            {/* <RecommendedPlaces /> */}
            {/* <HotDeals /> */}
            {/* <RemarkablePlaces /> */}
          </>
        ) : (
          <LoadingIndicator size="large" hasMargin />
        )}
      </ScrollView>
      {/* <AppReviewModal daysBeforeReminding={1} /> */}
    </SafeAreaView>
  );
};

export default Home;
