import React from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import WebView from 'react-native-webview';
import { fetchTransactionStatus } from '../../Service';

export default function NewCardMerchantCheckPg({
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
                  <input type="hidden"  name="MD" value="${redirectForm.content.MD}">
                  <input type="hidden"  name="PaReq" value="${redirectForm.content.PaReq}">
                  <input type="hidden"  name="TermUrl" value="${redirectForm.content.TermUrl}">
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
