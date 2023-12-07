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

  const [countDownTimer, setCountDownTimer] = useState({
    minutes: 0,
    seconds: 0,
  });

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



  /*----->>>> Transaction timer functionality start<<<-------*/
  useEffect(() => {
    const interval = setInterval(() => {

      if (countDownTimer.seconds > 0) {
        setCountDownTimer({
          ...countDownTimer,
          seconds: countDownTimer.seconds - 1,
        });
      }

      if (countDownTimer.seconds === 0) {
        if (countDownTimer.minutes === 0) {
          clearInterval(interval);
        } else {
          setCountDownTimer({
            seconds: 59,
            minutes: countDownTimer.minutes - 1,
          });
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });
  /*----->>>> Transaction timer functionality end<<<-------*/


  const startTimer = () => {
    setCountDownTimer({
      minutes: 1,
      seconds: 59,
    })
  };


  const openUpiIntentList = (() => {

    processTransaction({
      paymentMode: 'UPI_INTENT',
      orderId: orderId,
      txnToken: txnToken
    })
    .then((res) => {
      console.log(res, 'Transaction status--');
      
      if (res?.resultInfo?.resultStatus === 'S') {
        (countDownTimer.minutes == 0 || countDownTimer.seconds == 0) && startTimer()
        
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

      navigation.popToTop()
    }, 60000 * 2);

  })



  return (<>

    {(countDownTimer.minutes > 0 || countDownTimer.seconds > 0) && <View style={{ justifyContent: "center", alignItems: "center", marginTop: 35 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }} >
        You have 0{countDownTimer.minutes} : {countDownTimer.seconds} secs left to complete this transaction
      </Text>
    </View>
    }


    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

      <Button
        title="Click To Open Upi Intent List"
        onPress={openUpiIntentList}
      />
    </View>
  </>);
}

const styles = StyleSheet.create({

});
