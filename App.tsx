/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import 'react-native-gesture-handler';
import React from 'react';
import { AppState, AppStateStatus, I18nManager, View } from 'react-native';
import {
  AppearanceProvider,
  useColorScheme,
  ColorSchemeName,
} from 'react-native-appearance';
import RootNavigation from '@src/components/routes/RootNavigation';
import CartProvider from '@src/components/common/CartProvider';
import ThemeContext from '@src/context/theme-context';
import AuthProvider, { mainReducer } from '@src/components/common/AuthProvider/AuthProvider';
import * as DataBase from '@src/utils/AsyncStorage';

import { AppReviewConfig } from '@src/constants';

const { USES_UNTIL_SHOW } = AppReviewConfig;

const App = () => {
  // const [contextState, contextDispatch] = React.useContext(AuthContext);
  const appState = React.useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = React.useState(
    appState.current,
  );
  const scheme = useColorScheme();
  const [currentTheme, setCurrentTheme] = React.useState('light');
  const [useSystemTheme, setUseSystemTheme] = React.useState(false);

  React.useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState: AppStateStatus) => {
    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };

  React.useEffect(() => {
    if (appStateVisible !== 'active') {
      return;
    }
    const handleGetUsesUntilShowAppReview = async () => {
      const usesUntilShowAppReview = await DataBase.getItem(
        USES_UNTIL_SHOW,
      );
      if (!usesUntilShowAppReview) {
        DataBase.setItem(USES_UNTIL_SHOW, '1');
        return;
      }
      const totalUses = parseInt(usesUntilShowAppReview, 10) + 1;
      // AsyncStorage.setItem(USES_UNTIL_SHOW, totalUses.toString());
    };
    handleGetUsesUntilShowAppReview();
  }, [appStateVisible]);

  React.useEffect(() => {
    if (useSystemTheme) {
      setCurrentTheme(scheme);
    }
  }, [scheme, useSystemTheme]);

  const _setTheme = React.useCallback((theme: ColorSchemeName) => {
    setCurrentTheme(theme);
  }, []);

  return (
    <AppearanceProvider>
      <ThemeContext.Provider
        value={{
          theme: currentTheme,
          useSystemTheme,
          setTheme: _setTheme,
          setUseSystemTheme,
        }}>
        <AuthProvider>
          <CartProvider>
            <RootNavigation />
            {/* <View /> */}
          </CartProvider>
        </AuthProvider>
      </ThemeContext.Provider>
    </AppearanceProvider>
  );
};

export default App;
