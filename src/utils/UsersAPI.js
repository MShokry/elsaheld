import {useEffect, useState} from 'react';
import api, {PUT, POST, GET} from './APICONST';

const handeResponse = (response) => {
  let error = '';
  let results = [];
  if (response.problem === 'NETWORK_ERROR') {
    error = 'No Internet Connection, Please Check';
  } else if (response.status >= 200 && response.status < 400) {
    results = response.data;
    if ('message' in response.data) {
      error = response.data.message;
    }
  } else if (response.status >= 400 && response.status < 500) {
    // if (response.status === 400) {
    console.log('type', typeof response.date, Array.isArray(response.data));
    if (typeof response.data === 'string' && !Array.isArray(response.data)) {
      console.log('string');
      error = response.data;
    } else if ('message' in response.data) {
      error = response.data.message;
    } else {
      error = 'Some Thing went Wrong';
    }
    // }
    if (response.status === 401) {
      error = 'Invalid email or password.';
    }
    if (response.status === 402) {
      error = response.data.message;
    }
    console.log('Server Replied with errors', response.data.length);
  } else if (response.status >= 500) {
    error = 'Server Error';
  }
  return [error, results];
};

export const logUserFB = async ([user, state, setState]) => {
  try {
    setState({error: '', results: [], loading: true});
    const USER = user;
    const response = await api.post('loginWith/facebook', USER);
    console.log('Server Response logUser', response);
    const [error, results] = handeResponse(response);
    setState({results, error, loading: false});
  } catch (err) {
    console.log(err);
    setState({error: 'Some Thing went Wrong', results: [], loading: false});
  }
};

export const logUserGoogle = async ([user, state, setState]) => {
  try {
    setState({error: '', results: [], loading: true});
    const USER = user;
    const response = await api.post('loginWith/google', USER);
    console.log('Server Response logUser', response);
    const [error, results] = handeResponse(response);
    setState({results, error, loading: false});
  } catch (err) {
    console.log(err);
    setState({error: 'Some Thing went Wrong', results: [], loading: false});
  }
};
export const logUserApple = async ([user, state, setState]) => {
  try {
    setState({error: '', results: [], loading: true});
    const USER = user;
    const response = await api.post('/loginWith/apple', USER);
    console.log('Server Response logUser', response);
    const [error, results] = handeResponse(response);
    setState({results, error, loading: false});
  } catch (err) {
    console.log('Error excep', err);
    setState({error: 'Some Thing went Wrong', results: [], loading: false});
  }
};


export const updateUser = async ([user, state, setState]) => {
  try {
    setState({error: '', results: [], loading: true});
    const USER = {
      name: user.userName, // "name": "Required|String",
      email: user.userEmail, //"email": "Required|Unique",
      password: user.userPassword, //"password": "Required|Any",
      phone: user.userPhone, //"phone": "Optional|Phone:EG"
    };
    const response = await api.put('/auth/profile', USER);
    console.log(response);
    const [error, results] = handeResponse(response);
    setState({results, error, loading: false});
  } catch (err) {
    console.log(err);
    setState({error: 'Some Thing went Wrong', results: [], loading: false});
  }
};


export const logUser = async (user, setState) => {
  POST('siteAPI.php?json=true', user, setState);
};

export const logoutUser = async (setState) => {
  POST('/auth/logout',{}, setState);
};

export const logMe = async (setState) => {
  GET('/auth/beldoor', {}, {authData: setState});
};

export const getTerms = async (setState) => {
  GET('/sign-up/term-&-condition',{}, setState);
};

export const registerUser = async (user, setState) => {
  POST('/sign-up/new', user, setState);
};
export const confirmOTP = async (user, setState) => {
  POST(`/sign-up/verify-otp?key=${user.key}`, user, setState);
};

export const forgetPass = async (user,  setState) => {
  POST('/forget-password/otp', user, setState);
};
export const confirmOTPPass = async (user, setState) => {
  POST(`/forget-password/verify-otp?key=${user.key}`, user, setState);
};
export const changePass = async (user, setState) => {
  POST(`/forget-password/reset?key=${user.key}`, user, setState);
};