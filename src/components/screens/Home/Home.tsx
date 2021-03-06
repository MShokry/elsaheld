import * as React from 'react';
import {useFocusEffect, useScrollToTop} from '@react-navigation/native';
import {ScrollView, SafeAreaView, InteractionManager, TouchableWithoutFeedback} from 'react-native';
import {SearchBar, LoadingIndicator} from '@src/components/elements';
import Categories from './Categories';
import RecommendedPlaces from './RecommendedPlaces';
import MerchantCampaigns from './MerchantCampaigns';
import PopularCategories from './PopularCategories';
import HotDeals from './HotDeals';
import RemarkablePlaces from './RemarkablePlaces';
import {getHome} from '@src/utils/CartAPI';
// import AppReviewModal from '@src/components/common/AppReviewModal';
import {translate as T} from '@src/utils/LangHelper';
import MainContext from '@src/context/auth-context';
import {baseImages} from '@src/utils/APICONST';

type HomeProps = {};

const Home: React.FC<HomeProps> = ({navigation}) => {
  const [isNavigationTransitionFinished, setIsNavigationTransitionFinished] = React.useState(false);
  const [Places, setPlaces] = React.useState({
    error: '',
    results: [],
    loading: false,
  });
  const [contextState, contextDispatch] = React.useContext(MainContext);

  const scrollViewRef = React.useRef(null);

  useScrollToTop(scrollViewRef);

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
      lat: contextState.location?.latitude ? contextState.location?.latitude : 30,
      long: contextState.location?.longitude ? contextState.location?.longitude : 31,
    };
    getHome(rest, setPlaces);
  }, []);
  const Cats = Places.results || [];
  return (
    <SafeAreaView>
      <ScrollView ref={scrollViewRef} stickyHeaderIndices={[0]}>
        <SearchBar onSearch={() => navigation.navigate('SearchRestModal')} placeholder={T('HomeScreen.search')} />
        <PopularCategories list={false} />
        <MerchantCampaigns key="MerchantCampaigns" />

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
