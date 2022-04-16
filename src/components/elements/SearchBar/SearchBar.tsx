import * as React from 'react';
import {TouchableOpacity, View} from 'react-native';
import Container from '../Container';
import TextField from '../TextField';
import styles from './styles';
import {useTheme} from '@react-navigation/native';
import {searchRestaurants} from '@src/utils/CartAPI';
import MainContext from '@src/context/auth-context';
import Text from '../Text';

type SearchBarProps = {
  leftIconName?: string;
  placeholder?: string;
  onSearch?: () => {};
  navgate?: boolean;
};

const SearchBar: React.FC<SearchBarProps> = ({
  leftIconName = 'search',
  onSearch = () => {},
  placeholder = 'Search',
  navgate = false,
}) => {
  const {
    colors: {card, background},
  } = useTheme();
  const [contextState, contextDispatch] = React.useContext(MainContext);
  // const [word, setword] = useState('');

  return (
    <View>
      <Container style={[styles.searchContainer, {backgroundColor: card}]}>
        {navgate ? (
          <TouchableOpacity
            style={{
              backgroundColor: background,
              borderRadius: 15,
              justifyContent: 'center',
              marginTop: 5,
              marginBottom: 5,
              paddingHorizontal: 10,
              height: 48,
            }}
            onPress={onSearch}>
            <Text>{placeholder}</Text>
            {/* <TextField
              onBlur={() => onSearch()}
              leftIcon={leftIconName}
              placeholder={placeholder}
              disabled={true}
              onButtonPressed={onSearch}
            /> */}
          </TouchableOpacity>
        ) : (
          <TextField
            value={contextState.word}
            onChangeText={(t: string) => contextDispatch({type: 'setWord', payload: t})}
            leftIcon={leftIconName}
            placeholder={placeholder}
            onButtonPressed={onSearch}
          />
        )}
      </Container>
    </View>
  );
};

export default SearchBar;
