import * as React from 'react';

type AuthState = {
  userToken: string | null;
  user: object,
  updated: any,
  Lang: string | null;
  theme: string | null;
  walkThrough: boolean | null,
  loading: boolean | null,
  signIn: () => void;
  signOut: () => void;
  signUp: () => void;
};

const initialAutthState: AuthState = {
  userToken: null,
  user: { error: '', user: [], loading: false },
  updated: 0,
  Lang: 'ar',
  theme: 'dark',
  walkThrough: true,
  loading: true,
  signIn: () => { },
  signOut: () => { },
  signUp: () => { },
};

const AuthContext = React.createContext(initialAutthState);

export default AuthContext;
