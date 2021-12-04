import * as React from 'react';
import {View} from 'react-native';
import Container from '../Container';
import TextField from '../TextField';
import styles from './styles';
import {useTheme} from '@react-navigation/native';
import {searchRestaurants} from '@src/utils/CartAPI';

type SearchBarProps = {
  leftIconName?: string;
  placeholder?: string;
};

const SearchBar: React.FC<SearchBarProps> = ({leftIconName = 'search', placeholder = 'Search'}) => {
  const {
    colors: {card},
  } = useTheme();

  React.useEffect(() => {
    // const rest = {
    //   word: contextState.word,
    //   lat: contextState.location?.latitude ? contextState.location?.latitude : 0,
    //   long: contextState.location?.longitude ? contextState.location?.longitude : 0,
    // };
    // searchRestaurants('بوم');
  }, []);
  return (
    <View>
      <Container style={[styles.searchContainer, {backgroundColor: card}]}>
        <TextField leftIcon={leftIconName} placeholder={placeholder} />
      </Container>
    </View>
  );
};

export default SearchBar;
