import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { fetchWalletBalanceInfo, processTransaction, sendOtpToLinkWallet, validateOtpToLinkWallet } from '../Service';

export default function Wallet({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {

  const { orderId, amount, txnToken } = route.params;

  const [isWalletLinked, setIsWalletLinked] = useState(false);
  const [mobileNo, setMobileNo] = useState('');
  const [otp, setOtp] = useState('');
  const [paytmWalletBalance, setPaytmWalletBalance] = useState('');


  const showAlert = (message: string, isSuccess: boolean, isNavigate: boolean) => {
    setTimeout(
      (alertMessage, isSuccess) => {
        var title = 'Error';
        if (isSuccess) {
          title = 'Response';
        }
        Alert.alert(
          title,
          alertMessage,
          [{ text: 'OK', onPress: () => isNavigate ? navigation.popToTop() : null }],
          { cancelable: false }
        );
      },
      300,
      message,
      isSuccess
    );
  };

  const goForWalletTransaction = () => {

    processTransaction({
          paymentMode: 'BALANCE',
          orderId: orderId,
          txnToken: txnToken,
      })
      .then((res) => {
        console.log(res, 'Transaction status--');
        showAlert(JSON.stringify(`Status:- ${res?.resultInfo?.resultMsg}; Txn-Type:- ${res?.txnInfo?.BANKNAME} ; Txn-ID:- ${res?.txnInfo?.TXNID} `), true, true);
      })
      .catch((err) => {
        showAlert(err.message, false, false);
      });
  }



  const sendOtp = () => {
    sendOtpToLinkWallet(
      // "7777777777",
      mobileNo,
      orderId,
      txnToken
    )
      .then((res) => {
        // console.log(res, 'OTP--');
        res?.resultInfo?.resultStatus === "SUCCESS" && setIsWalletLinked(true)
        showAlert(JSON.stringify(res?.resultInfo?.resultMsg), true, false);
      })
      .catch((err) => {
        showAlert(err.message, false, false);
      });
  }


  const verifyOtp = () => {
    validateOtpToLinkWallet(
      otp,
      orderId,
      txnToken
    )
      .then((res) => {
        console.log(res, 'verifyOtp--');

        // showAlert(JSON.stringify(res), true);
        res?.resultInfo?.resultStatus === "SUCCESS" && fetchWalletBalance()
      })
      .catch((err) => {
        showAlert(err.message, false, false);
      });
  }


  const fetchWalletBalance = () => {
    fetchWalletBalanceInfo(
      orderId,
      txnToken
    )
      .then((res) => {
        // console.log(res, 'fetchWalletBalanceInfo--');
        setPaytmWalletBalance(res?.balanceInfo?.value)
        // showAlert(JSON.stringify(res), true);
      })
      .catch((err) => {
        showAlert(err.message, false, false);
      });
  }

  const paytmWalletLoginFrom = () => {
    return (!isWalletLinked ? <View><TextInput
      style={styles.textInput}
      keyboardType="numeric"
      defaultValue={mobileNo}
      maxLength={10}
      placeholder={'Enter Mobile No'}
      onChangeText={(e) => setMobileNo(e)}
    />
      <Button disabled={mobileNo.length > 9 ? false : true} title="send OTP" onPress={() => sendOtp()} /></View>

      : <View>
        <TextInput
          style={styles.textInput}
          keyboardType="numeric"
          defaultValue={otp}
          maxLength={6}
          placeholder={'Enter OTP'}
          onChangeText={(e) => setOtp(e)}
        />
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <Button title="Cancel" onPress={() => setIsWalletLinked(false)} />
          <Button disabled={otp.length > 5 ? false : true} title="Verify OTP" onPress={() => verifyOtp()} />
        </View>
      </View>
    )
  }


  return (
    <View style={styles.mainView}>
     
      <View>

        {(paytmWalletBalance == undefined || paytmWalletBalance == "") ? paytmWalletLoginFrom()
          : (<View>
            <Text style={styles.headerText}>
              Wallet Balance - {paytmWalletBalance}
            </Text>
            <Text style={styles.headerText}>
              Payable Amount - {amount}
            </Text>
            <View style={styles.buttonStyle}>
              <Button disabled={parseFloat(amount) <= parseFloat(paytmWalletBalance) ? false : true} title="Pay" onPress={() => goForWalletTransaction()} />
            </View>

          </View>)}
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
    padding: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 16,
  },
  buttonStyle: {
    padding: 8,
    margin: 4,
  },

  textInput: {
    fontSize: 18,
    padding: 8,
    borderColor: 'gray',
    marginStart: 8,
    marginEnd: 8,
    borderBottomWidth: 1,
    marginBottom: 15
  },
});
