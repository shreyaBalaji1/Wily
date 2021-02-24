import React from 'react';
import { View, Text, FlatList } from 'react-native';
import db from '../config';
import {ScrollView} from "react-native-gesture-handler";

export default class SearchScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allTransactions: [],
            lastVisibleTransaction: null
        }
    }

    componentDidMount = async() => {
        const query = await db.collection("transaction").get();
        query.docs.map((doc) => {
            this.setState({
                allTransactions: [...this.state.allTransactions, doc.data()]
            });
        });
    }

    fetchMoreTransactions = async() => {
        const query = await db.collection("transaction").startAfter(this.state.lastVisibleTransaction).limit(10).get();
        query.docs.map((doc) => {
            this.setState({
                allTransactions: [...this.state.allTransactions, doc.data()],
                lastVisibleTransaction: doc
            });
        });
    }

    render() {
        return(
        <View>
            
            <View>

            </View>
            <FlatList>
                data = {this.state.allTransactions}
                renderItem = {({item}) => {
                    <View style = {{borderBottomWidth: 2}} key = {index}>
                        <Text>{"Book ID: " + item.bookId}</Text>
                        <Text>{"Student ID: " + item.studentId}</Text>
                        <Text>{"Date: " + item.date.toDate()}</Text>
                        <Text>{"Transaction type: " + item.transactionType}</Text>
                    </View>
                }}
                keyExtractor = {(item, index) => {
                    index.toString();
                }}
                onEndReached = {this.fetchMoreTransactions}
                onEndThreshold = {0.7}
            </FlatList>
        </View>
        );
    }
}