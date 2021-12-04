import React from 'react';
import MapViewDirections from 'react-native-maps-directions';

const Directions = ({ destination, origin, onReady }) => (
  <MapViewDirections
    destination={destination}
    origin={origin}
    onReady={onReady}
    apikey='AIzaSyCz1ikkHhlXK2JoCtkLZ6dE8JMVzlcUbsA'
    strokeWidth={3}
    strokeColor="#222"
  />
);

export default Directions;
