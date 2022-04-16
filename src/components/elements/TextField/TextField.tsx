import * as React from 'react';
import {View, TextInput, TextInputProps, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Icon from '@src/components/elements/Icon';
import styles from './styles';
import Button from '../Button';

interface OwnProps {
  leftIcon?: string;
  leftIconSize?: number;
  rightIcon?: string;
  rightIconSize?: number;
  containerStyle?: StyleProp<ViewStyle>;
  hasMargin?: boolean;
  disabled?: boolean;
  error?: boolean;
  onButtonPressed?: () => {};
}

type TextFieldProps = OwnProps & TextInputProps;

const TextField: React.FC<TextFieldProps> = ({
  leftIcon,
  leftIconSize,
  rightIcon,
  rightIconSize,
  style,
  containerStyle,
  hasMargin,
  error,
  disabled = false,
  onButtonPressed = () => {},
  ...rest
}) => {
  const {
    colors: {text, background},
  } = useTheme();
  let margin = 0;
  if (hasMargin) {
    margin = 5;
  }

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: background, marginTop: margin, marginBottom: margin},
        containerStyle,
      ]}>
      {leftIcon && (
        <View style={{marginBottom: 6}}>
          <Button
            style={{height: 45, justifyContent: 'center', marginLeft: 30}}
            isTransparent
            isChildrenCentered
            onPress={onButtonPressed}>
            <Icon style={styles.leftIcon} name={leftIcon} size={leftIconSize} />
          </Button>
        </View>
      )}
      <TextInput
        style={[
          {color: text, fontFamily: 'Cairo-Light'},
          styles.textField,
          error ? {borderWidth: 0.5, borderColor: 'red'} : {},
          style,
        ]}
        placeholderTextColor={text}
        disabled={disabled}
        underlineColorAndroid="transparent"
        {...rest}
      />
      {rightIcon && (
        <View style={{marginBottom: 6}}>
          <Button
            style={{height: 45, justifyContent: 'center', marginLeft: 30}}
            isTransparent
            isChildrenCentered
            onPress={onButtonPressed}>
            <Icon style={styles.rightIcon} name={rightIcon} size={rightIconSize} />
          </Button>
        </View>
      )}
    </View>
  );
};

TextField.defaultProps = {
  leftIconSize: 14,
};

export default TextField;
