import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Platform} from 'react-native';

import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

export default function Search({onLocationSelected, dest, currentLocationLabel, clear}) {
  const [searchFocused, setsearchFocused] = React.useState(false);
  const ref = React.useRef();

  React.useEffect(() => {
    const d = ref.current?.getAddressText();
    console.log('currentLocationLabel', currentLocationLabel, d);
    if (d !== currentLocationLabel) {
      ref.current?.setAddressText(currentLocationLabel);
    }
  }, [currentLocationLabel]);
  return (
    <GooglePlacesAutocomplete
      ref={ref}
      placeholder="Search"
      placeholderTextColor="#333"
      onPress={onLocationSelected}
      query={{
        key: 'AIzaSyCz1ikkHhlXK2JoCtkLZ6dE8JMVzlcUbsA',
        language: 'ar',
      }}
      currentLocationLabel={currentLocationLabel}
      textInputProps={{
        onFocus: () => {
          setsearchFocused(true);
        },
        onBlur: () => {
          setsearchFocused(false);
        },
        onChangeText: t => {
          if (!!!t) {
            clear();
          }
          console.log(t);
        },
        autoCapitalize: 'none',
        autoCorrect: false,
      }}
      listViewDisplayed={searchFocused}
      fetchDetails
      enablePoweredByContainer={false}
      
      styles={{
        container: {
          position: 'absolute',
          top: dest ? Platform.select({ios: 40, android: 20}) : Platform.select({ios: 100, android: 80}),
          width: '100%',
        },
        textInputContainer: {
          flex: 1,
          backgroundColor: 'transparent',
          height: 54,
          marginHorizontal: 20,
          borderTopWidth: 0,
          borderBottomWidth: 0,
        },
        textInput: {
          height: 54,
          margin: 0,
          borderRadius: 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 20,
          paddingRight: 20,
          marginTop: 0,
          marginLeft: 0,
          marginRight: 0,
          elevation: 5,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: {x: 0, y: 0},
          shadowRadius: 15,
          borderWidth: 1,
          borderColor: '#DDD',
          fontSize: 18,
        },
        listView: {
          borderWidth: 1,
          borderColor: '#DDD',
          backgroundColor: '#FFF',
          marginHorizontal: 20,
          elevation: 5,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: {x: 0, y: 0},
          shadowRadius: 15,
          marginTop: 10,
        },
        description: {
          fontSize: 16,
        },
        row: {
          padding: 17,
          height: 58,
        },
      }}
    />
  );
}

const styles = StyleSheet.create({});
