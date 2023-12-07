import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Linking,
  StyleSheet,
  View,
  Text
} from 'react-native';
import { fetchTransactionStatus, processTransaction } from '../Service';

export default function UpiIntent({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {

  const { callBackUrl, orderId, txnToken } = route.params;


  const showAlert = useCallback(
    (message: string, isSuccess: boolean, goToTop = true) => {
      setTimeout(
        (alertMessage, isSuccess) => {
          var title = 'Error';
          if (isSuccess) {
            title = 'Response';
          }
          Alert.alert(
            title,
            alertMessage,
            [
              {
                text: 'OK',
                onPress: () => {
                  if (goToTop) navigation.popToTop();
                },
              },
            ],
            { cancelable: false }
          );
        },
        300,
        message,
        isSuccess
      );
    },
    [navigation]
  );



  const openUpiIntentList = (() => {

    processTransaction({
      paymentMode: 'UPI_INTENT',
      orderId: orderId,
      txnToken: txnToken
    })
      .then((res) => {
        console.log(res, 'Transaction status--');

        if (res?.resultInfo?.resultStatus === 'S') {
          
          handleUpiIntentTransactionStatus()
          Linking.openURL(res?.deepLinkInfo?.deepLink)
          
        }

      })
      .catch((err) => {
        showAlert(err.message, false, false);
      });

  });




  const handleUpiIntentTransactionStatus = (() => { //PENDING

    let resultStatus = 'PENDING'
    console.warn("resultStatus response>>>", resultStatus);

    const timer = setInterval(() => {
      if (resultStatus != 'PENDING') {  // if we recive status other then PENDING , it will clear the timeInterval
        clearInterval(timer);
        console.warn("<<<Inside if>>>");
      } else {
        console.warn("<<<Inside else>>>");

        fetchTransactionStatus(orderId)
          .then((res: any) => {
            resultStatus = res?.resultInfo?.resultStatus

            console.warn(res?.resultInfo?.resultStatus, 'Order status--');
            res?.resultInfo?.resultStatus != 'PENDING' && navigation.navigate('PaymentStatus', { paymentStatus: res })
          })

      }
    }, 1000);


    setTimeout(() => { //this Will be called after 2 min
      console.warn("I will call after 2 minutes");
      clearInterval(timer);

      // clearInterval(interval);
      navigation.popToTop()
    }, 60000 * 2);

  })

  

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>


      <Button
        title="Click To Open Upi Intent List"
        onPress={openUpiIntentList}
      />
    </View>
  );
}

const styles = StyleSheet.create({

});
