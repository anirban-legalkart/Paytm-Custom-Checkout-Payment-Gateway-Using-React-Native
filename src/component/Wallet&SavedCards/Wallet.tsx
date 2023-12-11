import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { fetchPayOption, fetchWalletBalanceInfo, processTransaction, sendOtpToLinkWallet, validateOtpToLinkWallet } from '../../Service';

export default function Wallet({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {

  const { orderId, amount, txnToken, callBackUrl } = route.params;

  const [isWalletLinked, setIsWalletLinked] = useState(false);
  const [mobileNo, setMobileNo] = useState('');
  const [otp, setOtp] = useState('');
  const [paytmWalletBalance, setPaytmWalletBalance] = useState('');
  const [savedCardInfo, setSavedCardInfo] = useState<any>([]);
  const [cardCvv, setCardCvv] = useState('');


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
        res?.resultInfo?.resultStatus === "SUCCESS" && fetchSavedInstruments()
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



  const fetchSavedInstruments = () => {

    fetchPayOption(orderId, txnToken)
      .then((body) => {

        if (body?.resultInfo?.resultStatus === 'S') {
          // console.log(body.merchantPayOption,'body.merchantPayOption');
          // var paymentFlow: string = body.paymentFlow;
          var merchantPayOption = body.merchantPayOption;
          var savedInstruments = merchantPayOption.savedInstruments;
          
          console.log(savedInstruments, 'savedInstruments---->>>');
          

          // "savedInstruments": [
          setSavedCardInfo([
            {
              "iconUrl": "https://staticgw2.paytm.in/33.1.1/",
              "oneClickSupported": false,
              "cardDetails": {
                "cardId": "201707291077050XXXXXX47678ef1041b96e6bcac3489",
                "cardType": "CREDIT_CARD",
                "expiryDate": "012022",
                "firstSixDigit": "411111",
                "lastFourDigit": "1111",
                "status": "1",
                "cvvLength": "3",
                "cvvRequired": true,
                "indian": true
              },
              "issuingBank": "HDFC",
              "isEmiAvailable": false,
              "authModes": [
                "otp"
              ],
              "displayName": "HDFC Bank Credit Card",
              "priority": null,
              "paymentOfferDetails": null,
              "savedCardEmisubventionDetail": null,
              "prepaidCard": false,
              "isHybridDisabled": false,
              "channelCode": "VISA",
              "channelName": "Visa Inc.",
              "isEmiHybridDisabled": false
            }
          ])


        }

      })
      .catch((err) => {
        console.log("gateway error", err);
      })


  }


  const goForSavedCardTransaction = (cardNumber:any, cardType:any ) => {
  //   let payload ={
  //     paymentMode: cardType,
  //     orderId: orderId,
  //     txnToken: txnToken,
  //     // cardInfo   : "1159332987||111|",
  //     cardInfo: `${cardNumber}||${cardCvv}|`,
  // }
  // console.log(payload,'payload--->');
  
    processTransaction({
      paymentMode: cardType,
      orderId: orderId,
      txnToken: txnToken,
      // cardInfo   : "1159332987||111|",
      cardInfo: `${cardNumber}||${cardCvv}|`,
  })
    .then((res) => {
      console.log(res, 'Transaction status--');

      if (res?.resultInfo?.resultStatus === 'S') {
        var form = res?.bankForm?.redirectForm;
        navigation.navigate('SavedCardMerchantCheckPg', { redirectForm: form, orderId, callBackUrl })
      } else {
        showAlert(res?.resultInfo?.resultMsg, false, false);
      }

    })
    .catch((err) => {
      showAlert(err.message, false, false);
    });
  };

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

        {(savedCardInfo != undefined && savedCardInfo?.length > 0) && <View style={{ marginTop: 25 }}>
          <Text style={styles.headerText}>
            Saved Cards :-
          </Text>
          {savedCardInfo.map((item: any, i: any) => (
            <View key={i} style={styles.cardContainer} >
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Text style={styles.cardInfoText}>{item.displayName} </Text>
                <Text style={[styles.cardInfoText, { color: 'blue', marginLeft: 9 }]}>{item.channelCode} </Text>
              </View>

              <Text style={styles.cardInfoText}>{item.cardDetails.firstSixDigit} ****** {item.cardDetails.lastFourDigit} </Text>

              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <TextInput
                  style={[styles.textInput]}
                  keyboardType="numeric"
                  defaultValue={cardCvv}
                  placeholder={'Card Cvv'}
                  onChangeText={(e) => setCardCvv(e)}
                  maxLength={3}
                />
                <View style={{ padding: 8, margin: 4, width:'30%'}}>
                  <Button disabled={cardCvv.length>2 ? false : true} title="Pay" onPress={() => goForSavedCardTransaction(`${item.cardDetails.firstSixDigit}${item.cardDetails.lastFourDigit}` ,item.cardDetails.cardType )} />
                </View>

              </View>
            </View>
          ))}
        </View>}


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

  cardInfoText: {
    padding: 8,
    fontWeight: 'bold',
    // flex: 0.3,
    // alignSelf: 'center',
  },
  cardContainer: {
    padding: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    margin: 8,
    backgroundColor: 'white',
    elevation: 4,
  }

});
