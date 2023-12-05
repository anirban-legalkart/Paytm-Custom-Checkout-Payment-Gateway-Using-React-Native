import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Linking,
  StyleSheet,
  View
} from 'react-native';
import { processTransaction } from '../Service';

export default function UpiIntent({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {

  const { callBackUrl, orderId, txnToken  } = route.params;

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
          // var form = res?.bankForm?.redirectForm;
        //   // setRedirectForm(form);
        //   navigation.navigate('UpiCollectMerchantCheckPg', { redirectForm: form, orderId, callBackUrl })
        // } else {
          showAlert(res?.resultInfo?.resultMsg, false, false);
            //  OpenDeepLinkURL(res?.deepLinkInfo?.deepLink)
            Linking.openURL(res?.deepLinkInfo?.deepLink)
            
        }

      })
      .catch((err) => {
        showAlert(err.message, false, false);
      });

  });

 

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
