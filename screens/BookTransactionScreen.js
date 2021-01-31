import React from 'react';
import { View, Text } from 'react-native';

export default class BookTransactionScreen extends React.Component {
    render() {
        return(
            <View style={{flex:1, justifyContent: "center", alignItems: "center"}}>
                <Text style = {{fontSize: 20}}>Issue or Return</Text>
            </View>
        );
    }
}