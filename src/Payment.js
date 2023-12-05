import React, { useEffect, useState } from 'react';
import { Button, View } from 'react-native';
import { fetchPayOption, generateToken } from './Service';
import { MID } from './Constant';

const Payment = ({navigation}) => {

  const [orderId, setOrderId] = useState('LKORDER15942011933');
  const [isOrderIdUpdated, setOrderIdUpdated] = useState(false);
  const [paymentFlow, setPaymentFlow] = useState('NONE');

  useEffect(() => {
    if (!isOrderIdUpdated) {
      generateOrderId();
      setOrderIdUpdated(true);
    }
  });

  const generateOrderId = () => {
    const r = Math.random() * new Date().getMilliseconds();
    setOrderId(
      'LKORDER' +
      (1 + Math.floor(r % 2000) + 10000) +
      'b' +
      (Math.floor(r % 100000) + 10000),
    );
  };



  const payNow = async () => {
    // let orderId = '7688677868766734532';
    let amount = 10;

    const token = await generateToken(orderId, amount);


    try {
      fetchPayOption(orderId,token)
        .then((body) => {
          // console.log(body.merchantPayOption,'body.merchantPayOption');
          // var paymentFlow: string = body.paymentFlow;
          var merchantPayOption = body.merchantPayOption;
          var savedInstruments = merchantPayOption.savedInstruments;
          var upiProfile = merchantPayOption.upiProfile;
          var vpaDetails = [];
          var bankAccounts = [];
          var paytmWalletBalance = '';
          if (
            upiProfile != undefined &&
            upiProfile.respDetails != undefined &&
            // upiProfile.upiOnboarding === true &&
            upiProfile.respDetails.profileDetail != undefined
          ) {
            vpaDetails = upiProfile.respDetails.profileDetail.vpaDetails;
            bankAccounts = upiProfile.respDetails.profileDetail.bankAccounts;
          }
          if (
            merchantPayOption.paymentModes[0].payChannelOptions[0]
              .balanceInfo != undefined
          ) {
            paytmWalletBalance =
              merchantPayOption.paymentModes[0].payChannelOptions[0]
                .balanceInfo.accountBalance.value;
          }
          var merchantDetails = body.merchantDetails;
          // initPaytmSdk(token, amount);
          // console.log(merchantDetails,'merchantDetails---->>>');
          console.log(savedInstruments,'savedInstruments---->>>');
          navigation.navigate('PayMode', {
            paymentFlow: paymentFlow,
            savedInstruments: savedInstruments,
            vpaDetails: vpaDetails,
            bankAccounts: bankAccounts,
            paytmWalletBalance: paytmWalletBalance,
            merchantDetails: merchantDetails,
            mid: MID,
            orderId: orderId,
            txnToken: token,
            amount: amount.toFixed(2),
            callBackUrl: `https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=${orderId}`
          });
          setOrderIdUpdated(false);
        })
        .catch((err) => {
          console.log("gateway error", err);
          setOrderIdUpdated(false);
        })
    } catch (error) {
      console.log("try catch error", error)
    }

  }


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="Create Payment"
        onPress={payNow}
      />
    </View>
  )
}

export default Payment