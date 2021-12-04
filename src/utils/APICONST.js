import * as React from 'react';
import {create} from 'apisauce';
import AuthContext from '@src/context/auth-context';

// export const baseURL = 'https://www.ebda3-eg.com/Elsahel/include/';
// export const baseImages = 'https://www.ebda3-eg.com/Elsahel/uploads/';

export const baseURL = 'https://www.elsahel.co/include/';
export const baseImages = 'https://www.elsahel.co/uploads/';

// 'Content-type': 'application/json',
export const headers = {
  Accept: '*/*',
  'Cache-Control': 'no-cache',
  'Content-Type': 'multipart/form-data',
  Connection: 'keep-alive',
};

// define the api
const api = create({
  baseURL: baseURL,
  headers: headers,
  timeout: 80 * 1000,
});

const handeResponse = response => {
  let error = '';
  let results = [];
  if (response.problem === 'NETWORK_ERROR') {
    error = 'No Internet Connection, Please Check';
  } else if (response.status >= 200 && response.status < 400) {
    results = response.data;
    if (response.status >= 200 && response.status < 400 && response.Status == 1) {
      results = response.data.results;
    } else {
      error = results?.Errors;
    }
  } else if (response.status >= 400 && response.status < 500) {
    // if (response.status === 400) {
    console.log('type', typeof response.date, Array.isArray(response.data));
    if (typeof response.data === 'string' && !Array.isArray(response.data)) {
      console.log('string');
      error = response.data;
    } else if ('Errors' in response.data) {
      error = response.data?.Errors;
    } else {
      error = 'Some Thing went Wrong';
    }
    // }
    if (response.status === 401) {
      error = 'Invalid email or password.';
    }
    if (response.status === 402) {
      error = response.data?.Errors;
    }
    console.log('Server Replied with errors', response.data.length);
  } else if (response.status >= 500) {
    error = 'Server Error';
  }
  return [error, results];
};

export const POST = async (
  url = '',
  body = null,
  setState = () => {},
  params = {showLoading: true, usePagination: false, Append: true, isForm: false},
) => {
  let data = new FormData();
  try {
    Object.keys(body).map(function (keyName, keyIndex) {
      // use keyName to get current key's name
      // and a[keyName] to get its value
      data.append(keyName, body[keyName]);
    });
  } catch (error) {
    console.log('Form', error);
  }
  if (api.headers.json_email) {
    data.append('json_email', api.headers.json_email);
    data.append('json_password', api.headers.json_password);
  }
  return REQUESTING('POST', url, data, setState, params);
};

export const GET = async (
  url = '',
  body = null,
  setState = () => {},
  params = {showLoading: true, usePagination: false, Append: true, isForm: false},
) => {
  let data = new FormData();
  if (body) {
    try {
      Object.keys(body).map(function (keyName, keyIndex) {
        // use keyName to get current key's name
        // and a[keyName] to get its value
        data.append(keyName, body[keyName]);
      });
    } catch (error) {
      console.log('Form', error);
    }
  }
  // REQUESTING('GET', url, body, setState, showLoading);
  console.log(api);
  return REQUESTING('GET', url, data, setState, params);
};

export const PUT = async (url = '', body = null, setState = () => {}, showLoading = false) => {
  return REQUESTING('PUT', url, body, setState, showLoading);
};

export const ConvertToForm = item => {
  let data = new FormData();
  try {
    Object.keys(item).map(function (keyName, keyIndex) {
      // use keyName to get current key's name
      // and a[keyName] to get its value
      data.append(keyName, item[keyName]);
    });
    return data;
  } catch (error) {
    console.log('Form', error);
    return item;
  }
};

export const REQUESTING = async (method = 'POST', url = '', body = null, setState = () => {}, params) => {
  const {showLoading, usePagination, Append, forceData, isForm} = params;
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        if (showLoading) {
          setState(state => ({...state, error: '', loading: true, isRequesting: true, ...forceData}));
        } else {
          setState(state => ({...state, error: '', loading: false, isRequesting: true, ...forceData}));
        }
        let response;
        const bodyModified = isForm ? ConvertToForm(body) : body;
        switch (method) {
          case 'POST':
            response = await api.post(url, bodyModified);
            break;
          case 'PUT':
            response = await api.put(url, bodyModified);
            break;
          case 'DELETE':
            response = await api.delete(url, bodyModified);
            break;
          default:
            response = await api.get(url, bodyModified);
        }
        console.log('URL=======', url, response);
        const [error, results] = handeResponse(response);
        if (usePagination && !!results.current_page && Array.isArray(results.data)) {
          const {data, ...rest} = results;
          if (Append) {
            setState(state => ({
              ...state,
              results: [...state.results, ...data],
              error,
              loading: false,
              isRequesting: false,
              pagination: rest,
            }));
          } else {
            setState(state => ({
              ...state,
              results: data,
              error,
              loading: false,
              isRequesting: false,
              pagination: rest,
            }));
          }
        } else {
          setState(state => ({...state, results, error, loading: false, isRequesting: false}));
        }
        if (error) {
          reject(response);
        } else {
          resolve(results);
        }
      } catch (err) {
        console.log('APIerr ', err);
        setState(state => ({...state, error: 'Some Thing went Wrong', loading: false, isRequesting: false}));
        reject(err);
      }
    })();
  });
};

export default api;
