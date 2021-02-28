import React from 'react';
import { View, Text, FlatList, TextInput } from 'react-native';
import db from '../config';
import {ScrollView, TouchableOpacity} from "react-native-gesture-handler";

export default class SearchScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allTransactions: [],
            lastVisibleTransaction: null,
            search: ""
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
        var text = this.state.search.toUpperCase();
        var enteredText = text.split("");
        if(enteredText[0].toUpperCase() === "B") {
            const query = await db.collection("transaction").where("bookId", "==", text).startAfter(this.state.lastVisibleTransaction).limit(10).get();
            query.docs.map((doc) => {
                this.setState({
                    allTransactions: [...this.state.allTransactions, doc.data()],
                    lastVisibleTransaction: doc
                });
            });
        }
        else if(enteredText[0].toUpperCase() === "S") {
            const query = await db.collection("transaction").where("studentId", "==", text).startAfter(this.state.lastVisibleTransaction).limit(10).get();
            query.docs.map((doc) => {
                this.setState({
                    allTransactions: [...this.state.allTransactions, doc.data()],
                    lastVisibleTransaction: doc
                });
            });
        }
        
    }

    searchTransactions = async(text) => {
        var enteredText = text.split("");   //Splits up the word into individual letters
        if(enteredText[0].toUpperCase() === "B") {
          const transaction = await db.collection("transaction").where("bookId", "==", text).get();
          transaction.docs.map((doc)=>{
            this.setState({
                allTransactions: [...this.state.allTransactions, doc.data()],
                lastVisibleTransaction: doc
            });
          });
        }
        else if(enteredText[0].toUpperCase() === "S") {
            const transaction = await db.collection("transaction").where("studentId", "==", text).get();
            transaction.docs.map((doc)=> {
                this.setState({
                    allTransactions: [...this.state.allTransactions, doc.data()],
                    lastVisibleTransaction: doc
                });
            })
        }
    }

    render() {
        return(
        <View style={styles.container}>
            
            <View style = {styles.searchBar}>
                <TextInput
                style = {styles.bar}
                placeholder = "Enter Book ID or Student ID"
                onChangeText = {(text) => {
                    this.setState({
                        search: text
                    });
                }}>
                </TextInput>
                <TouchableOpacity style = {styles.searchButton}
                onPress = {() => {
                    this.searchTransactions(this.state.search);
                }}>
                    <Text>Search</Text>
                </TouchableOpacity>
                
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

const styles = StyleSheet.create({
     bar:{
      borderWidth:2,
      height:30,
      width:300,
      paddingLeft:10,
    },
    container: {
      flex: 1,
      marginTop: 20
    },
    searchBar:{
      flexDirection:'row',
      height:40,
      width:'auto',
      borderWidth:0.5,
      alignItems:'center',
      backgroundColor:'grey',
  
    },
    searchButton:{
        borderWidth:1,
        height:30,
        width:50,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'green'
      }
});