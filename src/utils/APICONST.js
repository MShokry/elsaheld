import * as React from 'react';
import {create} from 'apisauce';
import AuthContext from '@src/context/auth-context';

// export const baseURL = 'https://www.ebda3-eg.com/Elsahel/include/';
export const baseURL = 'https://www.ebda3-eg.com/arrivo/include/';

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

const handeResponse = (response) => {
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
      error = response.data.Errors;
    } else {
      error = 'Some Thing went Wrong';
    }
    // }
    if (response.status === 401) {
      error = 'Invalid email or password.';
    }
    if (response.status === 402) {
      error = response.data.Errors;
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
  showLoading = false,
) => {
  console.log(api.headers);

  let data = new FormData();
  try {
    Object.keys(body).map(function (keyName, keyIndex) {
      // use keyName to get current key's name
      // and a[keyName] to get its value
      data.append(keyName, body[keyName]);
    });
  } catch (error) {console.log("Form",error);}
  if(api.headers.json_email){
    data.append("json_email", api.headers.json_email);
    data.append("json_password", api.headers.json_password);
  }
  await REQUESTING(
    'POST',
    url,
    data,
    setState,
    showLoading,
  );
};

export const GET = async (
  url = '',
  body = null,
  setState = () => {},
  showLoading = false,
) => {
  let data = new FormData();
  if (body) {
    try {
      Object.keys(body).map(function (keyName, keyIndex) {
        // use keyName to get current key's name
        // and a[keyName] to get its value
        data.append(keyName, body[keyName]);
      });
    } catch (error) {console.log("Form",error);}
  }
  // REQUESTING('GET', url, body, setState, showLoading);
  console.log(api);
  REQUESTING(
    'GET',
    `webService.php?do=${url}`,
    data,
    setState,
    showLoading,
  );
};

export const PUT = async (
  url = '',
  body = null,
  setState = () => {},
  showLoading = false,
) => {
  REQUESTING('PUT', url, body, setState, showLoading);
};

export const REQUESTING = async ( method = 'POST', url = '', body = null, setState = () => {}, showLoading,) => {
  try {
    if (!showLoading) {
      setState((state) => ({error: '', results: state.results, loading: true}));
    } else {
      setState((state) => ({error: '',results: state.results,loading: false}));
    }
    let response;
    switch (method) {
      case 'POST':
        response = await api.post(url, body);
        break;
      case 'PUT':
        response = await api.put(url, body);
        break;
      default:
        response = await api.get(url, body);
    }
    console.log(url, response);
    const [error, results] = handeResponse(response);
    Promise.resolve([results,error])
    setState({results, error, loading: false});
  } catch (err) {
    console.log(err);
    setState({error: 'Some Thing went Wrong', results: [], loading: false});
  }
};
export default api;
