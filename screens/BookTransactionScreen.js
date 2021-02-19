import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, ToastAndroid, KeyboardAvoidingView, Alert } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as firebase from 'firebase';
import db from "../config";

export default class BookTransactionScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            hasCameraPermissions: null,
            scanned: false,
            scannedBookID: "",
            scannedStudentID: "",
            buttonState: "normal",
            transactionMessage: ""
        }
    }
    getCameraPermissons = async(id) => {
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            /*
            status==="granted" is true -- permission has been granted
            */
            hasCameraPermissions: status === "granted",
            buttonState: id,
            scanned: false
        })
    }
    handleBarcodeScanned = async({data}) => {
        const {buttonState} = this.state.buttonState;
        if(buttonState === "BookId") {
            this.setState({
                scanned: true,
                scannedBookID: data,
                buttonState: "normal"
            });
        }
        else if(buttonState === "StudentId") {
            this.setState({
                scanned: true,
                scannedStudentID: data,
                buttonState: "normal"
            });
        }
        
    }

    initiateBookIssue  = async() => {
        db.collection("transaction").add({
            studentId: this.state.scannedStudentID,
            bookId: this.state.scannedBookID,
            date: firebase.firestore.Timestamp.now().toDate(),
            transactionType: "issue",
        });
        db.collection("books").doc(this.state.scannedBookID).update({
            bookAvailability: false
        });
        db.collection("students").doc(this.state.scannedStudentID).update({
            noOfBooksIssued: firebase.firestore.FieldValue.increment(1)
        });
        Alert.alert("Book issued");
        this.setState({
            scannedBookID: "",
            scannedStudentID: ""
        });
    }

    initiateBookReturn  = async() => {
        db.collection("transaction").add({
            studentId: this.state.scannedStudentID,
            bookId: this.state.scannedBookID,
            date: firebase.firestore.Timestamp.now().toDate(),
            transactionType: "return",
        });
        db.collection("books").doc(this.state.scannedBookID).update({
            bookAvailability: true
        });
        db.collection("students").doc(this.state.scannedStudentID).update({
            noOfBooksIssued: firebase.firestore.FieldValue.increment(-1)
        });
        Alert.alert("Book returned");
        this.setState({
            scannedBookID: "",
            scannedStudentID: ""
        });
    }

    checkStudentEligibilityForBookIssue = async() => {
        const studentRef = await db.collection("students").where("studentId","==", this.state.scannedStudentID).get();
        var isStudentEligible = "";
        if(studentRef.docs.length == 0) {
            this.setState({
                scannedBookID: "",
                scannedStudentID: ""
            });
            isStudentEligible = false;
            Alert.alert("The student does not exist in the database")
        }
        else {
            studentRef.docs.map((doc) => {
                var student = doc.data();
                if(student.noOfBooksIssued < 2) {
                    isStudentEligible = true;
                }
                else {
                    isStudentEligible = false;
                    Alert.alert("Student has already issued 2 books")
                }
                this.setState({
                    scannedBookID: "",
                    scannedStudentID: ""
                });
            });
        }
        return isStudentEligible;
    }

    checkStudentEligibilityForBookReturn = async() => {
        const transactionRef = await db.collection("transaction").where("bookId","==", this.state.scannedBookID).limit(1).get();
        var isStudentEligible = "";

       
            transactionRef.docs.map((doc) => {
                var lastBookTransaction = doc.data();
                if(lastBookTransaction.studentId === this.state.scannedStudentID) {
                    isStudentEligible = true;
                }
                else {
                    isStudentEligible = false;
                    Alert.alert("The book was not issued by this student")
                }
                this.setState({
                    scannedBookID: "",
                    scannedStudentID: ""
                });
            });
        
        return isStudentEligible;
    }

    checkBookEligibility = async() => {
        const bookRef = await db.collection("books").where("bookId","==",this.state.scannedBookID).get();

        var transactionType = "";
        if(bookRef.docs.length == 0) {
            transactionType = false
        }
        else {
            bookRef.docs.map((doc) => {
                var book = doc.data();
                if(book.bookAvailability) {
                    transactionType = "issue";
                }
                else {
                    transactionType = "return";
                }
            });
        }
        return transactionType;
    }

    handleTransaction  = async() => {
        var transactionType = await this.checkBookEligibility();

        if(!transactionType) {
            Alert.alert("The book does not exist in the database");
            this.setState({
                scannedBookID: "",
                scannedStudentID: ""
            });
        }
        else if(transactionType === "issue") {
            var isStudentEligible = await this.checkStudentEligibilityForBookIssue();
            if(isStudentEligible) {
                this.initiateBookIssue();
                Alert.alert("Book issued to the student")
            }
        }
        else {
            var isStudentEligible = await this.checkStudentEligibilityForBookReturn();
            if(isStudentEligible) {
                this.initiateBookReturn();
                Alert.alert("Book returned to the library")
            }
        }
    }
    
    render() {
        const hasCameraPermissions = this.state.hasCameraPermissions;
        const scanned = this.state.scanned;
        const buttonState = this.state.buttonState;
        if(buttonState !== "normal" && hasCameraPermissions) {
            return(
                <BarCodeScanner onBarCodeScanned = {scanned ? undefined : this.handleBarcodeScanned} 
                style = {StyleSheet.absoluteFillObject}/>
            );
        }
        else if(buttonState === "normal") {
            return(
                <KeyboardAvoidingView style={styles.container} behavior = "padding" enabled>
                    <View>
                        <Image
                        source = {require("../assets/booklogo.jpg")}
                        style = {{width: 200, height: 200}}/>
                        <Text style = {{textAlign: 'center', fontSize: 30}}>Wireless Library</Text>
                    </View>
                    <View>
                        <TextInput style = {styles.inputBox} placeholder = "Book ID" value = {this.state.scannedBookID} onChangeText = {(text) => {
                            this.setState({
                                scannedBookID: text
                            });
                        }} />
                        <TouchableOpacity style = {styles.scanButton} onPress = {this.getCameraPermissons("BookId")}>
                            <Text style = {styles.buttonText}>Scan</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TextInput style = {styles.inputBox} placeholder = "Student ID" value = {this.state.scannedStudentID} onChangeText = {(text) => {
                            this.setState({
                                scannedStudentID: text
                            });
                        }}/>
                        <TouchableOpacity style = {styles.scanButton} onPress = {this.getCameraPermissons("StudentId")}>
                            <Text style = {styles.buttonText}>Scan</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style = {styles.submitButton} onPress = {async() => {this.handleTransaction();
                    this.setState({
                        scannedBookID: "",
                        scannedStudentID: ""
                    });}}>
                        <Text style = {styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    scanButton: {
        margin: 10,
        padding: 10,
        backgroundColor: "#2196f3"
    },
    displayText: {
        fontSize: 15,
        textDecorationLine: 'underline'
    },
    buttonText: {
        fontSize: 20
    },
    inputBox: {
        width: 200,
        height: 40,
        borderWidth: 1.5,
        borderRightWidth: 0,
        fontSize: 20
    },
    submitButton: {
        backgroundColor: "#fbc02d",
        width: 100,
        height: 50
    },
    submitButtonText: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: "white",
        padding: 10
    }
});

/*
var R = 0

R == 0 //true
R === 0 //true

R == "0"    //true
R === "0"   //false
*/