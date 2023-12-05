import { StyleSheet, Text, View, BackHandler,Button } from 'react-native'
import React, { useState, useEffect } from 'react';

const PaymentStatus = ({
    navigation,
    route,
  }) => {

    const { paymentStatus } = route.params;

    const [backButtonDisabled, setBackButtonDisabled] = useState(true);

    useEffect(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (backButtonDisabled) {
          return true; // Prevent the back button from being pressed
        }
  
        return false; // Allow the back button to be pressed
      });
  
      return () => backHandler.remove();
    }, [backButtonDisabled]);
    
    return (
        <View>
            <Text style={{textAlign: 'center', backgroundColor: 'yellow', fontSize: 20, fontWeight: 'bold' }}>
            Payment Status 
            </Text>


            <Text style={styles.headerText}>
            TXNID :- {paymentStatus.txnId}
            </Text>
            <Text style={styles.headerText}>
            BANKTXNID :- {paymentStatus.bankTxnId}
            </Text>
            <Text style={styles.headerText}>
            TXNAMOUNT :- {paymentStatus.txnAmount}
            </Text>
            {paymentStatus.bankName && <Text style={styles.headerText}>
            BANKNAME :- {paymentStatus.bankName}
            </Text>}
            {paymentStatus.paymentMode &&  <Text style={styles.headerText}>
             PAYMENT MODE :- {paymentStatus.paymentMode}
            </Text>}
            <Text style={styles.headerText}>
            GATEWAYNAME :- {paymentStatus.gatewayName}
            </Text>
            <Text style={[styles.headerText,{fontWeight:'bold', color: paymentStatus.resultInfo.resultCode== '01' ?'green' :'red'}]}>
            STATUS :- {paymentStatus.resultInfo.resultMsg}
            </Text>
            <Text style={styles.headerText}>
            TXNDATE :- {paymentStatus.txnDate}
            </Text>
            
            <Button title="Go Back" onPress={() => navigation.popToTop() } />

        </View>
    )
}

export default PaymentStatus

const styles = StyleSheet.create({
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 16,
      },
})