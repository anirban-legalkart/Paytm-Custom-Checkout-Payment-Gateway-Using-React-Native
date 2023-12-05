import React from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import WebView from 'react-native-webview';
import { fetchTransactionStatus } from '../../Service';

export default function UpiCollectMerchantCheckPg({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const { orderId, callBackUrl, redirectForm } = route.params;

  return (
    <View style={styles.mainView}>
   
          <WebView
            originWhitelist={['*']}
            source={{ html: `
               <html>
                <head>
                  <title>Merchant Checkout Page</title>
                </head>
                <body>
                  <center>
                  <h1>Please do not refresh this page...</h1>
                  </center>
                  <form method="post" action="${redirectForm.actionUrl}" name="f1">
                  <input type="hidden"  name="MERCHANT_VPA" value="${redirectForm.content.MERCHANT_VPA}">
                  <input type="hidden"  name="CHANNEL" value="${redirectForm.content.CHANNEL}">
                  <input type="hidden"  name="externalSrNo" value="${redirectForm.content.externalSrNo}">
                  <input type="hidden"  name="MCC" value="${redirectForm.content.MCC}">
                  <input type="hidden"  name="payerVpa" value="${redirectForm.content.payerVpa}">
                  <input type="hidden"  name="txnAmount" value="${redirectForm.content.txnAmount}">
                  <input type="hidden"  name="txnToken" value="${redirectForm.content.txnToken}">
                  </form>

                  

                  <script type="text/javascript">document.f1.submit();</script>
                </body>
               </html>` 
              }}

              onNavigationStateChange={(navigationState) => {
                // if (navigationState.title == 'Paytm') {
                if (navigationState?.url?.includes(`ORDER_ID=${orderId}`)) {
                  fetchTransactionStatus(orderId)
                  .then((res) => {
                    // console.log(res, 'Order status--');
                    navigation.navigate('PaymentStatus', { paymentStatus: res })
                
                      })
                }
                // console.warn(navigationState,'navigationState--->');
                
            }
              }
          />


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
  
});
