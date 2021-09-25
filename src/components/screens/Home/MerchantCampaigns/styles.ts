import {StyleSheet, I18nManager} from 'react-native';

export default StyleSheet.create({
  merchantCampaignContainer: {
    paddingTop: 30,
    // marginTop: 20,
    paddingBottom: 10,
  },
  campaignItem: {
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    backgroundColor: 'red',
  },
  campaignImage: {
    width: '100%',
    height: 140,
    resizeMode: 'stretch',
  },
  campaignTitleContainer: {
    backgroundColor: 'transparent',
    width: '100%',
    marginLeft: 10,
  },
  campaignTitle: {
    fontWeight: 'bold',
    color: 'white',
    textAlign: I18nManager.isRTL ? 'left' : 'auto',
  },
  campaignSubTitle: {
    color: 'white',
    fontSize: 12,
    marginTop: 2,
    textAlign: I18nManager.isRTL ? 'left' : 'auto',
  },
});
