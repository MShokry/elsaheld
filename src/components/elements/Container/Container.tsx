import * as React from 'react';
import { ActivityIndicator, View, ViewProps } from 'react-native';
import { useTheme } from '@react-navigation/native';

interface OwnProps {
  children?: React.ReactNode;
  isLoading?: boolean,
}

type ContainerProps = OwnProps & ViewProps;

const Container: React.FC<ContainerProps> = ({ children, style, isLoading, ...rest }) => {
  const {
    colors: { card },
  } = useTheme();
  return (
    <View style={[{ backgroundColor: card }, style]} {...rest}>
      {isLoading && <ActivityIndicator size='large' />}
      {children}
    </View>
  );
};

export default Container;
