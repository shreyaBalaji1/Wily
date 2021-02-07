import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default class BookTransactionScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            hasCameraPermissions: null,
            scanned: false,
            scannedData: "",
            buttonState: "normal"
        }
    }
    getCameraPermissons = async() => {
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            /*
            status==="granted" is true -- permission has been granted
            */
            hasCameraPermissions: status === "granted",
            buttonState: "clicked",
            scanned: false
        })
    }
    handleBarcodeScanned = async({data}) => {
        this.setState({
            scanned: true,
            scannedData: data,
            buttonState: "normal"
        });
    }
    
    render() {
        const hasCameraPermissions = this.state.hasCameraPermissions;
        const scanned = this.state.scanned;
        const buttonState = this.state.buttonState;
        if(buttonState === "clicked" && hasCameraPermissions) {
            return(
                <BarCodeScanner onBarCodeScanned = {scanned ? undefined : this.handleBarcodeScanned} 
                style = {StyleSheet.absoluteFillObject}/>
            );
        }
        else if(buttonState === "normal") {
            return(
                <View style={styles.container}>
                    <Text style = {styles.displayText}>{
                            hasCameraPermissions===true ? this.state.scannedData : "Request Camera Permission"
                        }
                    </Text>
                    <TouchableOpacity style = {styles.scanButton} onPress = {this.getCameraPermissons}>
                        <Text style = {styles.buttonText}>Scan QR Code</Text>
                    </TouchableOpacity>
                </View>
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
    }
});