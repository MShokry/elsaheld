import * as React from 'react';
import AuthContext from '@src/context/auth-context';
import * as DataBase from '@src/utils/AsyncStorage';

type AuthProviderProps = {};

type AuthState = {
  isLoading: boolean;
  isSignOut: boolean;
  userToken: string | null;
  user: object,
  updated: any,
  Lang: string | null;
  theme: string | null;
  walkThrough: boolean | null,
  loading: boolean | null,
};

type AuthAction =
  | { type: 'RESTORE_TOKEN'; token: string | null }
  | { type: 'SIGN_IN'; token: string | null }
  | { type: 'SIGN_OUT'; token?: null };

const initialAuthState: AuthState = {
  isLoading: false,
  isSignOut: false,
  userToken: '',
  user: { error: '', user: {}, loading: false },
  updated: 0,
  Lang: '',
  theme: 'dark',
  walkThrough: true,
  loading: true,
};

const AuthReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...state,
        userToken: action.token,
        isLoading: false,
      };
    case 'SIGN_IN':
      return {
        ...state,
        userToken: action.token,
        isSignOut: false,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        userToken: null,
        isSignOut: true,
      };
    default:
      return state;
  }
};

export const mainReducer = (state: any, action: any) => {
  // console.log('$$$$Main Context', action);
  switch (action.type) {
    case 'LogUser':
      return {
        ...state,
        user: { error: '', user: action.payload, loading: false },
        userToken: action.payload.token,
      };
    case 'skipLogUser':
      return {
        ...state,
        userToken: action.payload,
      };
    case 'StopLoading':
      return { ...state, loading: false };
    case 'LogOutUser':
      return { ...state, user: { error: '', user: [], loading: false }, userToken: null };
    case 'SetLang':
      return { ...state, Lang: action.payload };
    case 'SetCity':
      return { ...state, City: action.payload };
    case 'walkThrough':
      return { ...state, walkThrough: action.payload };
    default:
      return state;
  }
};
import * as Lang from '@src/utils/LangHelper';
import api from '@src/utils/APICONST';

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = React.useReducer(mainReducer, initialAuthState);
  const _bootstrapAsync = async () => {
    let T = '';
    console.log('Loading Storage');
    // const U = await AsyncStorage.getItem('userToken');
    const langSymbol = (await DataBase.getItem('language')) || 'ar';
    // dispatch({ type: 'SetLang', payload: langSymbol });
    const city = (await DataBase.getItem('city')) || '';
    dispatch({ type: 'SetCity', payload: city });
    console.log('langSymbol', langSymbol, city);

    // const token = await DataBase.getItem("accessToken");
    const U = await DataBase.getItem('userToken');
    console.log('U', U);
    if (U !== undefined && U !== null) {
      console.log('Finding Token');
      try {
        const { token, user } = JSON.parse(U);
        T = user.token;
        if (T) {
          console.log('token', T);
          // 'Content-type': 'application/json',
          api.setHeaders({
            authorization: T,
            Accept: '*/*',
            'Content-Type': 'multipart/form-data',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
            'Accept-Language': langSymbol,
          });
          dispatch({ type: 'LogUser', payload: user });
        }
      } catch (e) {
        console.log('user', e);
      }
    }
    console.log('Auth NAvigate');
    dispatch({ type: 'StopLoading' });
  };

  // React.useEffect(() => {
  //   try {
  //     // setTimeout(_bootstrapAsync(), 500);
  //     // setTimeout(_bootstrapAsync, 500);
  //     // _bootstrapAsync();
  //   } catch (error) {
  //     dispatch({ type: 'StopLoading' });
  //     console.log('Error', error);
  //   }
  // }, []);

  React.useEffect(() => {
    if (state.Lang) {
      console.log("state.Lang", state.Lang);
      Lang.setI18nConfig(state.Lang);
    }
    // return () => { }
  }, [state.Lang]);

  return (
    <AuthContext.Provider value={[state, dispatch]}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
