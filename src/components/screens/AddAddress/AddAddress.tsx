import * as React from 'react';
import {TextField, List, Divider, Button, Text} from '@src/components/elements';
import {Alert, View} from 'react-native';
import {savedAddresses, Address} from '@src/data/mock-address';
import styles from './styles';
import Geocoder from 'react-native-geocoding';
import {addAddresses, updateAddresses} from '@src/utils/CartAPI';
import {useRoute} from '@react-navigation/core';
import {useTheme} from '@react-navigation/native';

type AddAddressProps = {};

const AddAddress: React.FC<AddAddressProps> = () => {
  const [form, setform] = React.useState([]);
  const [Adrress, setAdrress] = React.useState({error: '', results: [], loading: false});
  const route = useRoute();
  const {
    colors: {text, background},
  } = useTheme();
  const _prepareListData = (addresses: Address[]) => {
    return addresses.map(item => {
      const {id, description, name} = item;
      return {
        id,
        title: name,
        subTitle: description,
      };
    });
  };
  const [SearchText, setSearchText] = React.useState('');

  React.useEffect(() => {
    if (Adrress.results.Status) {
      Alert.alert('اضافة العنوان', 'تم اضافة العنوان بنجاح');
    }
  }, [Adrress.results]);

  const adr = () => {
    Geocoder.from(SearchText)
      .then(json => {
        console.log(SearchText, json);
        var addressComponent = json.results[0].address_components[0];
        console.log(addressComponent);
      })
      .catch(error => console.warn(error));
  };

  const _renderListHeader = () => {
    return (
      <>
        {/* <View style={styles.searchTextFieldContainer}> */}
        <TextField
          onButtonPressed={() => {
            adr();
          }}
          value={SearchText}
          onChangeText={t => {
            setSearchText(t);
          }}
          style={[styles.searchTextFieldContainer, {width: '90%'}]}
          placeholder="اكتب العنوان"
          leftIcon="map-marker-alt"
        />
        {/* </View> */}
        <Divider />
      </>
    );
  };

  const userInfo = [
    {
      field: 'رقم التليفون',
      data: 'phone',
      type: 'phone',
    },
    {
      field: 'المحافظة',
      data: 'phone',
      type: 'government',
    },
    {
      field: 'المدينة',
      data: 'phone',
      type: 'city',
    },
    {
      field: 'الحي',
      data: 'phone',
      type: 'area',
    },
    {
      field: 'رقم الشارع',
      data: 'phone',
      type: 'streetNumber',
    },
    {
      field: 'رقم الوحدة',
      data: 'phone',
      type: 'buildNumber',
    },
    {
      field: 'الدور',
      data: 'phone',
      type: 'layerNumber',
    },
    {
      field: 'الشقة',
      data: 'phone',
      type: 'flatNumber',
    },
    {
      field: 'ملاحظات',
      data: 'phone',
      type: 'notes',
    },
  ];
  console.log(form);
  React.useEffect(() => {
    console.log('route', route);
    setform(route?.params || {});
  }, []);

  return (
    <>
      <List
        data={userInfo}
        // ListHeaderComponent={_renderListHeader()}
        renderItem={({item}) => {
          return (
            <>
              <TextField
                defaultValue={form[item.type]}
                hasMargin
                placeholder={`${item.field}`}
                onChangeText={(t: string) => setform({...form, [item.type]: t})}
              />
              <Text isSecondary style={{alignSelf: 'flex-start', position: 'absolute', top: -5, left: 10}}>
                {form?.[item.type] ? item.field : ''}
              </Text>
            </>
          );
        }}
      />
      {AddAddress.error ? (
        <Text isPrimary hasMargin style={{marginVertical: 10}}>
          {AddAddress.error}
        </Text>
      ) : null}
      <Button
        isFullWidth
        disabled={form.length < 5}
        onPress={() => {
          route?.params?.ID ? updateAddresses(form, setAdrress) : addAddresses(form, setAdrress);
        }}
        isLoading={AddAddress.loading}>
        <Text isBold isWhite>
          {route?.params?.ID ? 'تعديل العنوان' : 'إضافة العنوان'}
        </Text>
      </Button>
    </>
  );
};

export default AddAddress;
