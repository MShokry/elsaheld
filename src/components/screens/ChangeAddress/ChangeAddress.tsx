import * as React from 'react';
import { savedAddresses, Address } from '@src/data/mock-address';
import List from '@src/components/elements/List/List';
import { Icon, Divider } from '@src/components/elements';
import ListRowItem, {
  ListRowItemProps,
} from '@src/components/elements/List/ListRowItem';
import { useNavigation } from '@react-navigation/native';
import { I18nManager, View } from 'react-native';
import { getAddresses } from '@src/utils/CartAPI'

type ChangeAddressProps = {};
const chevronIconName = I18nManager.isRTL ? 'chevron-left' : 'chevron-right';

const savedPlaceListItem: ListRowItemProps = {
  id: '1',
  title: 'Saved Places',
  subTitle: 'Select a delivery address easily',
  leftIcon: <Icon name="bookmark" size={16} />,
  rightIcon: <Icon name={chevronIconName} size={16} />,
};

const useCurrentLocationListItem: ListRowItemProps = {
  id: '1',
  title: 'Use Current Location',
  subTitle: '588 Blanda Square - Virginia',
  leftIcon: <Icon name="crosshairs" size={16} />,
};

const ChangeAddress: React.FC<ChangeAddressProps> = () => {
  const navigation = useNavigation();
  const [Adress, setAdress] = React.useState({ error: '', results: [], loading: false });

  const _prepareListData = (addresses: Address[]) => {
    return addresses.map((item) => {
      const { id, description, name } = item;
      return {
        id,
        title: name,
        subTitle: description,
        rightIcon: <Icon name="bookmark" size={16} />,
      };
    });
  };

  React.useEffect(() => {
    getAddresses(setAdress);
  }, [navigation]);
  
  const _savedPlaceListItemPressed = () => {
    navigation.navigate('SavedAddressesScreen');
  };

  // const _renderListHeader = () => {
    return (
      <>
        {/* <ListRowItem
          {...savedPlaceListItem}
          onPress={_savedPlaceListItemPressed}
        />
        <Divider /> */}
        <ListRowItem {...useCurrentLocationListItem} />
        <Divider />
        {Adress.results?.Result?.map((item, index) => {
            const { ID, name, notes, phone, addressName,area, government, city, streetNumber, flatNumber, buildNumber, description, isHome, isWork } = item;
            let leftIcon;
            if (isHome) {
              leftIcon = <Icon name="home" size={16} />;
            } else if (isWork) {
              leftIcon = <Icon name="briefcase" size={16} />;
            }
            return (
              <View key={index}>
                <ListRowItem
                  id={ID}
                  title={`${buildNumber} ${addressName}`}
                  subTitle={`${streetNumber} ${area} - ${city} - ${government}`}
                  leftIcon={leftIcon}
                  note={`${phone}  ${notes}`}
                />
                <Divider />
              </View>
            );
          })}
      </>
    );
  // };

  return (
    <List
      data={_prepareListData(savedAddresses)}
      ListHeaderComponent={_renderListHeader()}
    />
  );
};

export default ChangeAddress;
