import { applyMiddleware, combineReducers, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';
import { IReducerStateAction } from './IState';
import { mapInitialState } from './map';
import { authInitialState } from './auth';
import { layoutInitialState } from './layout';

export const getReducerState = (
  reducerName: string,
  state: any,
  { reducer, type, payload }: IReducerStateAction,
  prefix: string,
) => {
  prefix = prefix ? `${prefix}.` : '';
  if (`${prefix}${reducerName}` === reducer) {
    return {
      ...state,
      [type]: payload,
    };
  }

  return state;
};

export const getMappedReducers = ({
  reducers,
  prefix,
}: {
  reducers: any;
  prefix?: string;
}) =>
  Object.entries(reducers).reduce(
    (data: any, [reducerName, getState]: any) => ({
      ...data,
      [reducerName]: (
        initialState = getState(),
        payload: IReducerStateAction,
      ) => getReducerState(reducerName, initialState, payload, prefix),
    }),
    {},
  );

export const flintReducers = {
  flint: combineReducers({
    ...getMappedReducers({
      prefix: 'flint',
      reducers: {
        map: mapInitialState,
        auth: authInitialState,
        layout: layoutInitialState,
      },
    }),
  }),
};

export const flintCombinedReducer = combineReducers(flintReducers);

export const flintStore = createStore(
  flintCombinedReducer,
  applyMiddleware(ReduxThunk),
);

export interface IAuthUser {
  email: string;
  firstName: string;
  lastName: string;
  externalKey: number;
  phone: string;
}

export interface IAuthState {
  user?: IAuthUser | {};
  authenticating: boolean;
}

import { IAuthState } from './authState';

export const authInitialState = (): IAuthState => ({
  user: {},
  authenticating: false,
});


import { IAuthState } from './authState';

export const authInitialState = (): IAuthState => ({
  user: {},
  authenticating: false,
});

    dispatch({
        reducer: 'flint.auth',
        type: 'authenticating',
        payload: true,
    });
Every new reducer you have to initialize like the follow

export const authInitialState = (): IAuthState => ({
  user: {},
  authenticating: false,
});

// to auto generate the store you can use prefix or don’t 
getMappedReducers({
      prefix: 'flint',
      reducers: {
        map: mapInitialState,
        auth: authInitialState,
        layout: layoutInitialState,
      },
    })
And this is the usage 

 dispatch({
        reducer: 'flint.auth', // the reducer with prefix if there is a prefix otherwise, use `auth` only
        type: 'authenticating', // what prop you need to update in the reducer
        payload: true,
    });