import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Container, Section, Divider, Icon, Button } from '@src/components/elements';
import { ScrollView } from 'react-native-gesture-handler';
import ListRowItem from '@src/components/elements/List/ListRowItem';
import { favoriteAddresses } from '@src/data/mock-address';
import styles from './styles';
import { Alert, View } from 'react-native';
import { deleteAddresses, getAddresses } from '@src/utils/CartAPI'
type SavedAddressesProps = {};

const SavedAddresses: React.FC<SavedAddressesProps> = () => {
  const navigation = useNavigation();
  const [Adress, setAdress] = React.useState({ error: '', results: [], loading: false });
  const _addAddressItemPressed = () => {
    navigation.navigate('AddAddressScreen');
  };
  React.useEffect(() => {
    getAddresses(setAdress);
  }, [navigation]);
  console.log(Adress);
  const _removeIdx = (id) => {
    Alert.alert(
      'حذف عنوان',
      'هل تريد حذف هذا العنوان ؟',
      [{
        text: 'تاكيد',
        style: 'cancel',
        onPress: () => {
          deleteAddresses(id, () => { });
          setTimeout(() => {
            getAddresses(setAdress);
          }, 300);
        }
      },
      { text: 'عودة' },]
    )
    // getAddresses(setAdress);
  };
  return (
    <ScrollView>
      <Section title="المفضلة">
        <Container style={styles.container}>
          {Adress.results?.Result?.map((item, index) => {
            const { ID, name, notes, phone, addressName, area, government, city, streetNumber, flatNumber, buildNumber, description, isHome, isWork } = item;
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
                  onPress={()=>navigation.navigate('AddAddressScreen', item)}
                  rightIcon={<Button onPress={() => _removeIdx(item.ID)}>
                    <Icon name='trash-alt' />
                    {/* <Text style={styles.sideDishText} isBold>x</Text> */}
                  </Button>}
                  note={`${phone}  ${notes}`}
                />
                <Divider />
              </View>
            );
          })}
          <ListRowItem
            title="اضف عنوان"
            subTitle="اضافة الي المفضلة"
            onPress={_addAddressItemPressed}
          />
        </Container>
      </Section>
    </ScrollView>
  );
};

export default SavedAddresses;
