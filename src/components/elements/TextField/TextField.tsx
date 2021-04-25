import * as React from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import Icon from '@src/components/elements/Icon';
import styles from './styles';
import Button from '../Button';

interface OwnProps {
  leftIcon?: string;
  leftIconSize?: number;
  containerStyle?: StyleProp<ViewStyle>;
  hasMargin?: boolean;
  error?: boolean;
  onButtonPressed?: () => { },
}

type TextFieldProps = OwnProps & TextInputProps;

const TextField: React.FC<TextFieldProps> = ({
  leftIcon,
  leftIconSize,
  style,
  containerStyle,
  hasMargin,
  error,
  onButtonPressed = () => { },
  ...rest
}) => {
  const {
    colors: { text, background },
  } = useTheme();
  let margin = 0;
  if (hasMargin) {
    margin = 5;
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: background, marginTop: margin, marginBottom: margin },
        containerStyle,
      ]}>
      {leftIcon && (
        <Button
          style={{height: 45}}
          isTransparent
          isChildrenCentered
          onPress={onButtonPressed}
        >
          <Icon style={styles.leftIcon} name={leftIcon} size={leftIconSize} />
        </Button>
      )}
      <TextInput
        style={[{ color: text, fontFamily: 'Cairo-Light', }, styles.textField, error ? { borderWidth: .5, borderColor: 'red' } : {}, style]}
        placeholderTextColor={text}
        underlineColorAndroid="transparent"
        {...rest}
      />
    </View>
  );
};

TextField.defaultProps = {
  leftIconSize: 14,
};

export default TextField;
