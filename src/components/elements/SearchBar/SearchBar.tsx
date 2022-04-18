import * as React from 'react';
import {View} from 'react-native';
import Container from '../Container';
import TextField from '../TextField';
import styles from './styles';
import {useTheme} from '@react-navigation/native';
import {searchRestaurants} from '@src/utils/CartAPI';
import MainContext from '@src/context/auth-context';

import SwitchSelector from 'react-native-switch-selector';
import {POST} from '@src/utils/APICONST';

type SearchBarProps = {
  leftIconName?: string;
  placeholder?: string;
  onSearch?: () => {};
};
const options = [
  {label: 'Offline', activeColor: 'red', value: 0},
  {label: 'Online', activeColor: 'green', value: 1},
];
const SearchBar: React.FC<SearchBarProps> = ({
  leftIconName = 'search',
  onSearch = () => {},
  placeholder = 'Search',
}) => {
  const {
    colors: {card, primary, background},
  } = useTheme();
  const [contextState, contextDispatch] = React.useContext(MainContext);
  const [OnlineBut, setOnlineBut] = React.useState(0);

  return (
    <View>
      <Container style={[styles.searchContainer, {backgroundColor: card}]}>
        <SwitchSelector
          options={options}
          value={OnlineBut}
          initial={0}
          height={32}
          borderRadius={15}
          buttonColor="#bb00cc"
          backgroundColor="#ccc"
          onPress={value => {
            console.log('value', value);
            setOnlineBut(value);
            POST('?json=true', {status: value, do: 'changeStatus'});
          }}
        />
      </Container>
    </View>
  );
};

export default SearchBar;
