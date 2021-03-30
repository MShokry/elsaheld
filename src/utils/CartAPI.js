import {useEffect, useState} from 'react';
import api, {PUT, POST, GET} from './APICONST';

const handeResponse = (response) => {
  let error = '';
  let results = [];
  if (response.problem === 'NETWORK_ERROR') {
    error = 'خطئ بالشبكة تاكد من الاتصال بالانترنت';
  } else if (response.status >= 200 && response.status < 400) {
    results = response.data;
  } else if (response.status >= 400 && response.status < 500) {
    console.log('Server Replied with errors', response.data.length);
    if (response.data.message) {
      error = response.data.message;
    } else if (response.data.length > 0) {
      const errors = response.data[0];
      'password' in errors ? (error = errors.password) : null;
      'name' in errors ? (error = errors.first_name) : null;
      'email' in errors ? (error = errors.email) : null;
      'phone' in errors ? (error = errors.phone) : null;
      'message' in errors ? (error = errors.message) : null;
    }
  } else if (response.status >= 500) {
    error = ' Server Error ';
  }
  return [error, results];
};

export const getRestaurants = async ( id,setState) => {
  POST('webService.php?do=getRestaurants', {Location:"33.232,32.322",estoreType: id}, setState);
};
export const getHome = async ( setState) => {
  POST('webService.php?do=getHomeRestaurants', {Location:"33.232,32.322"}, setState);
};
export const getStoreTypes = async ( setState) => {
  POST('webService.php?do=getStoreTypes', {Location:"33.232,32.322"}, setState);
};
export const getMenu = async (id, setState) => {
  POST('webService.php?do=getMenu', {RestaurantID:id}, setState);
};

export const createOrder = async (order, setState) => {
  POST('siteAPI.php?json=true&do=PlaceOrder', order, setState);
};
export const GetOrders = async (order, setState) => {
  POST('webService.php?do=GetOrders&json=true&start=0&end=10', order, setState);
};
