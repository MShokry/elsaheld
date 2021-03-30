import * as React from 'react';
import { Text as BaseText, TextProps as BaseTextProps } from 'react-native';
import useThemeColors from '@src/custom-hooks/useThemeColors';

interface TextProps extends BaseTextProps {
  children?: React.ReactNode;
  isPrimary?: boolean;
  isSecondary?: boolean;
  isBold?: boolean;
  isHeadingTitle?: boolean;
  isCenter?: boolean;
  isWhite?: boolean;
  hasMargin?: boolean;
}

const Text: React.FC<TextProps> = ({
  children,
  isPrimary,
  isSecondary,
  isWhite,
  isBold,
  isHeadingTitle,
  isCenter,
  hasMargin,
  style,
  ...rest
}) => {
  const { primary, secondary, text } = useThemeColors();
  let color = text;
  let fontSize = 14;
  let marginTop = 0;
  let textAlign: 'auto' | 'center' | 'left' | 'right' | 'justify' | undefined;

  if (isSecondary) {
    color = secondary;
    fontSize = 13;
  }

  if (isHeadingTitle) {
    fontSize = 20;
  }

  if (isPrimary) {
    color = primary;
  }

  if (isWhite) {
    color = 'white';
  }

  if (isCenter) {
    textAlign = 'center';
  }

  if (hasMargin) {
    marginTop = 10;
  }

  // const fontWeight = isBold ? 'bold' : 'normal';
  const isfontWeight = !!style?.fontWeight;
  let styles;
  if (style) {
    styles = Object.keys(style).reduce((object, key) => {
      if (key !== 'fontWeight') {
        object[key] = style[key]
      }
      return object
    }, {});
  }

  return (
    <BaseText
      {...rest}
      style={[
        {
          color,
          fontFamily: (isfontWeight || isBold) ? 'Cairo-Bold' : 'Cairo-Regular',
          // fontWeight,
          fontSize,
          textAlign,
          marginTop,
        },
        styles,
      ]}>
      {children}
    </BaseText>
  );
};

export default Text;
