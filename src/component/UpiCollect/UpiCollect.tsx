import React, { useState } from 'react';
import {
  Alert,
  Button,
  StyleSheet,
  TextInput,
  View
} from 'react-native';
import { processTransaction, validateUserVPA } from '../../Service';

export default function UpiCollect({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const [upiCode, setUpiCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const { callBackUrl, orderId, txnToken } = route.params;

  const showAlert = (message: string, isSuccess: boolean, goToTop = true) => {
    setTimeout(
      (alertMessage, isSuccess, goToTop) => {
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
      isSuccess,
      goToTop
    );
  };

  const goForUpiCollectTransaction = () => {

    processTransaction({
      paymentMode: 'UPI',
      orderId: orderId,
      txnToken: txnToken,
      payerAccount: upiCode,
    })
      .then((res) => {
        console.log(res, 'Transaction status--');

        if (res?.resultInfo?.resultStatus === 'S') {
          var form = res?.bankForm?.redirectForm;
          navigation.navigate('UpiCollectMerchantCheckPg', { redirectForm: form, orderId, callBackUrl })
        } else {
          showAlert(res?.resultInfo?.resultMsg, false, false);
        }

      })
      .catch((err) => {
        showAlert(err.message, false, false);
      });
  };

  const verifyVPA = () => {
    validateUserVPA(
      upiCode,
      orderId,
      txnToken
    )
      .then((res) => {
        setIsVerified(res?.valid)
        showAlert(JSON.stringify(res), true, false);
      })
      .catch((err) => {
        showAlert(err.message, false, false);
      });
  };

  return (
    <View style={styles.mainView}>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={{ flex: 0.67 }}>
          <TextInput
            style={styles.textInput}
            defaultValue={upiCode}
            placeholder={'Enter Your Upi Id'}
            onChangeText={(e) => {setUpiCode(e), setIsVerified(false) }}
            maxLength={20}
          />
        </View>

        <View style={{ flex: 0.25 }}>
          <Button disabled={upiCode.length > 3 ? false : true} title="Verify" onPress={() => verifyVPA()} />
        </View>

      </View>

      <View style={styles.buttonStyle}>
        <Button disabled={isVerified  ? false : true} title="Pay" onPress={() => goForUpiCollectTransaction()} />
      </View>

      
    </View>
  );
}
const styles = StyleSheet.create({
  mainView: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
    paddingTop: 16,
    padding: 4,
  },
  buttonStyle: {
    padding: 8,
    margin: 8,
  },
  textInput: {
    fontSize: 18,
    padding: 8,
    borderColor: 'gray',
    marginStart: 8,
    marginEnd: 8,
    borderBottomWidth: 1,
  },
});
