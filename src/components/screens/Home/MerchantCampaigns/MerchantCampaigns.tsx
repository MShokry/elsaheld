import * as React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {Carousel, Container, Text} from '@src/components/elements';
import {mockMerchantCaimpaigns, MerchantCampaign} from '@src/data/mock-merchant-caimpaigns';
import styles from './styles';
import {getOffers} from '@src/utils/CartAPI';
import {baseImages} from '@src/utils/APICONST';
import {useNavigation} from '@react-navigation/core';

type MerchantCampaignsProps = {};
// [ ] Goto PlaceDetailsScreen

const MerchantCampaigns: React.FC<MerchantCampaignsProps> = () => {
  const [Offers, setOffers] = React.useState({error: '', results: [], loading: false});

  React.useEffect(() => {
    getOffers(setOffers);
  }, []);

  const navigation = useNavigation();

  const _onPlaceItemPressed = item => {
    navigation.navigate('PlaceDetailsScreen', item);
  };

  const _renderContent = (campaign: MerchantCampaign) => {
    const {id, photo, title, subTitle, backgroundColor} = campaign;
    return (
      <TouchableOpacity onPress={() => _onPlaceItemPressed({...campaign, ...campaign.store})}>
        <Container key={id} style={[styles.campaignItem, {backgroundColor: backgroundColor}]}>
          <Image source={{uri: `${baseImages}${photo}`}} style={styles.campaignImage} />
          {/* <Container style={styles.campaignTitleContainer}>
          <Text style={styles.campaignTitle}>{title}</Text>
          <Text style={styles.campaignSubTitle}>{subTitle}</Text>
          </Container>
        <Container /> */}
        </Container>
      </TouchableOpacity>
    );
  };

  return (
    <Container style={styles.merchantCampaignContainer}>
      <Carousel data={Offers.results} renderContent={_renderContent} itemWidth={275} enableSnap={false} />
    </Container>
  );
};

export default MerchantCampaigns;
