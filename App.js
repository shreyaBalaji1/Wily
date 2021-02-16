import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import BookTransactionScreen from './screens/BookTransactionScreen';
import SearchScreen from "./screens/SearchScreen";

export default class App extends React.Component {
  render() {
    return (
      <AppContainer/>
    );
  }
}

const tabNavigator = createBottomTabNavigator({
  Transaction: {screen: BookTransactionScreen},
  Search: {screen: SearchScreen}
},
{
  defaultNavigationOptions: ({navigation}) => {
    tabBarIcon: (() => {
      const routeName = navigation.state.routeName;
      if(routeName === "Transaction") {
        return(
          <Image
          source = {require("./assets/book.png")}
          style = {{width: 40, height: 40}}/>
        );
      }
      else if(routeName === "Search") {
        return(
          <Image
          source = {require("./assets/searchingbook.png")}
          style = {{width: 40, height: 40}}/>
        );
      }
    })
  }
}
);

var AppContainer = createAppContainer(tabNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
