import {useEffect, useState} from 'react';
import api, {PUT, POST, GET} from './APICONST';

const handeResponse = response => {
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

export const getRestaurants = async (rest, setState) => {
  POST('webService.php?do=getRestaurants', {Location: `${rest.lat},${rest.long}`, estoreType: rest.id}, setState);
};
export const getOffers = async setState => {
  POST('/webService.php?do=getOffers', {}, setState);
};

export const searchRestaurants = async (res, setState) => {
  // GET(
  //   `siteAPI.php?ajax_page=true&json=true&do=searchRestaurant&word=${res.word}`,
  //   {Location: `${res.lat},${res.long}`, fastest: true, preparation: true, word: res.word, storeType: res.word},
  //   setState,
  // );
  POST(
    `webService.php?do=getRestaurants&keyword=${res.word}`,
    {Location: `${res.lat},${res.long}`, keyword: res.word},
    setState,
  );
};

export const getHome = async (rest, setState) => {
  POST('webService.php?do=getHomeRestaurants', {Location: `${rest.lat},${rest.long}`}, setState);
};
export const getStoreTypes = async (rest, setState) => {
  POST('webService.php?do=getStoreTypes', {Location: `${rest.lat},${rest.long}`}, setState);
};
export const getMenu = async (id, setState) => {
  POST('webService.php?do=getMenu', {RestaurantID: id}, setState);
};
export const RateRestaurant = async (order, setState) => {
  POST('webService.php?do=RateRestaurant&json=true', order, setState);
};
export const GetComments = async (id, setState) => {
  POST('webService.php?do=GetComments&json=true', {RestaurantID: id}, setState);
};
//Orders
export const createOrder = async (order, setState) => {
  await POST('siteAPI.php?json=true&do=PlaceOrder', order, setState);
};
export const getCoupon = async (Coupon, setState) => {
  await POST('webService.php?do=getCoupon&json=true', {Coupon}, setState);
};
export const GetOrders = async (order, setState) => {
  POST('?do=myOrders&json=true', {do: 'myOrders', DataType: 'newOrders', ...order}, setState);
};

export const GetOrdersRide = async (order, setState) => {
  POST('siteAPI.php?ajax_page=true&json=true&start=0&end=20', {...order, do: 'getMyBookRide'}, setState);
};
export const GetOrdersAny = async (order, setState) => {
  POST('siteAPI.php?ajax_page=true&json=true&start=0&end=20', {...order, do: 'getMyOrders'}, setState);
};
export const GetOrdersVilla = async (order, setState) => {
  POST(
    'webService.php?ajax_page=true&json=true&start=0&end=20&do=getChaletRequests',
    {...order, do: 'getChaletRequests'},
    setState,
  );
};

export const ReOrders = async (OrderID, setState) => {
  POST('webService.php?do=UserEditOrder&json=true', {type: 'reorder', OrderID}, setState);
};
export const CancelOrders = async (orderID, setState) => {
  POST('webService.php?do=cancelOrder&json=true', {...orderID}, setState);
};

//Adress
export const getAddresses = async setState => {
  POST('siteAPI.php?json=true&do=getAddresses', {do: 'getAddresses'}, setState);
};
export const addAddresses = async (adress, setState) => {
  POST('siteAPI.php?json=true', {...adress, do: 'addAddress'}, setState);
};
export const updateAddresses = async (adress, setState) => {
  POST('siteAPI.php?json=true', {...adress, do: 'updateAddress'}, setState);
};
export const deleteAddresses = async (id, setState) => {
  POST('siteAPI.php?json=true', {id: id, do: 'deleteAddress'}, setState);
};

export const setRide = async (data, setState) => {
  return POST('siteAPI.php?json=true', {...data, do: 'setRide'}, setState);
};
export const bookRide = async (data, setState) => {
  return POST('siteAPI.php?json=true&ajax_page=true', {...data, do: 'bookRide'}, setState);
};

export const getVilla = async (d, setState) => {
  POST('siteAPI.php?json=true&ajax_page=true', d, setState);
};
export const sendVillaRequest = async (d, setState) => {
  POST('siteAPI.php?json=true&ajax_page=true', {...d, do: 'sendPropertyRequest'}, setState);
};

/*
[3:56 PM, 9/23/2021] عماد حسن: do = getPropertyList
CheckIn
CheckOut
adults
children
rooms
propertyType
[3:57 PM, 9/23/2021] عماد حسن: $propertyType[1] = "شقة";
    $propertyType[2] = "شاليه";
    $propertyType[3] = "فيلا";
    $propertyType[4] = "استراحة";
    $propertyType[5] = "استوديو";
do =sendPropertyRequest
id 
CheckIn
CheckOut
adults
children
rooms
propertyType
commnet
phone
name


-----------------------------36798520321727701921748319242
Content-Disposition: form-data; name="CheckIn"

2021-10-07
-----------------------------36798520321727701921748319242
Content-Disposition: form-data; name="CheckOut"

2021-10-07
-----------------------------36798520321727701921748319242
Content-Disposition: form-data; name="adults"

2
-----------------------------36798520321727701921748319242
Content-Disposition: form-data; name="children"

0
-----------------------------36798520321727701921748319242
Content-Disposition: form-data; name="rooms"

2
-----------------------------36798520321727701921748319242
Content-Disposition: form-data; name="name"

Mahmoud
-----------------------------36798520321727701921748319242
Content-Disposition: form-data; name="phone"

01050003138
-----------------------------36798520321727701921748319242
Content-Disposition: form-data; name="commnet"


-----------------------------36798520321727701921748319242
Content-Disposition: form-data; name="propertyType"

1
-----------------------------36798520321727701921748319242
Content-Disposition: form-data; name="do"

sendRequest
-----------------------------36798520321727701921748319242--

*/
