import React from 'react';
import { View, Text, FlatList, TextInput , Alert , StyleSheet} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import db from '../config';

export default class LoginScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            emailId: "",
            password: ""
        }
    }
    login = async(email, password) => {
        if(email && password) {
            try {
                const response  = await firebase.auth().signInWithEmailAndPassword(email, password);
                if(response) {
                    this.props.navigation.navigate("Transaction");
                }
            }
            catch (error){
                switch(error.code) {
                    case "auth/user-not-found": Alert.alert("User does not exist");
                        break;
                    case "auth/invalid-email": Alert.alert("Incorrect email or password");
                        break;
                }
            }
        }
        else {
            Alert.alert("Enter email AND password")
        }
    }
    render() {
        return(
            <View>
                <TextInput 
                style = {styles.loginBox}
                placeholder = "Email Address"
                keyboardType = "email-address"
                onChangeText = {(text) => {
                    this.setState({
                        emailId: text
                    });
                }}>
                </TextInput>

                <TextInput
                style = {styles.loginBox}
                placeholder = "Password"
                secureTextEntry = {true}
                onChangeText = {(text) => {
                    this.setState({
                        password: text
                    });
                }}>
                </TextInput>
                <TouchableOpacity style = {{height: 30, width: 90, borderWidth: 1, marginTop: 20, paddingTop: 5, borderRadius: 7}}
                onPress = {() => {
                    this.login(this.state.emailId, this.state.password);
                }}>
                    <Text style = {{textAlign: 'center'}}>Login</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    loginBox: {
        width: 300,
        height: 40,
        borderWidth: 1.5,
        fontSize: 20,
        margin: 10,
        paddingLeft: 10
    }
});