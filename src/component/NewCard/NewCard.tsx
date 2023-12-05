import React, { useState } from 'react';
import {
  Alert,
  Button,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { processTransaction, validateUserCardDetails } from '../../Service';

export default function NewCard({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const [cardNumber, setCardNubmer] = useState('');
  const cardTypeList = [
    { name: 'Debit Card', value: 'DEBIT_CARD' },
    { name: 'Credit Card', value: 'CREDIT_CARD' },
  ];
  const [cardType, setCardType] = useState('DEBIT_CARD');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [binDetail, setBinDetail] = useState<any>({});

  const { txnToken, orderId, callBackUrl } = route.params;

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

  const getBin = (cardNumberValue: string) => {

    validateUserCardDetails(cardNumberValue, orderId, txnToken)
      .then((res) => {
        // console.log(res,'check card----');
        var resultInfo = res.resultInfo;
        if (resultInfo.resultStatus === 'S') {
          var binDetail = res.binDetail;

          setBinDetail(binDetail)
        } else {
          showAlert('getBin => ' + resultInfo.resultMsg, false, false);
        }
        // showAlert(res, true, false)
      })
      .catch((err) => {
        showAlert(err.message, false, false);
      });
  };


  const goForNewCardTransaction = () => {

    const cardExpiryArray = cardExpiry?.split("/");

    processTransaction({
      paymentMode: cardType,
      orderId: orderId,
      txnToken: txnToken,
      // cardInfo   : "|4389760168314294|123|122032",
      cardInfo: `|${cardNumber}|${cardCvv}|${cardExpiryArray[0]}20${cardExpiryArray[1]}`,
  })
    .then((res) => {
      console.log(res, 'Transaction status--');

      if (res?.resultInfo?.resultStatus === 'S') {
        var form = res?.bankForm?.redirectForm;
        // setRedirectForm(form);
        navigation.navigate('NewCardMerchantCheckPg', { redirectForm: form, orderId, callBackUrl })
      } else {
        showAlert(res?.resultInfo?.resultMsg, false, false);
      }

    })
    .catch((err) => {
      showAlert(err.message, false, false);
    });
  };

  const checkCardNumber = (num: string) => {
   
    setCardNubmer(num);
    if (num.length >= 6) {
      getBin(num);
    }else{  setBinDetail({}) }
  };

  const { width } = Dimensions.get('window');
  const itemWidth = (width - 69) / 2;

  return (
    <View style={styles.mainView}>
      <View
        style={{
          padding: 12,
          borderWidth: 1,
          borderColor: 'gray',
          borderRadius: 8,
          margin: 8,
          backgroundColor: 'white',
          elevation: 4,
        }}
      >
        <TextInput
          style={styles.textInput}
          keyboardType="numeric"
          defaultValue={cardNumber}
          placeholder={'Card Number'}
          onChangeText={(e) => checkCardNumber(e)}
          maxLength={16}
        />
        <TextInput
          style={styles.textInput}
          defaultValue={cardExpiry}
          placeholder={'Card Expiry MM/YY'}
          onChangeText={(e) => setCardExpiry(e)}
          maxLength={5}
        />
        <TextInput
          style={styles.textInput}
          keyboardType="numeric"
          defaultValue={cardCvv}
          placeholder={'Card Cvv'}
          onChangeText={(e) => setCardCvv(e)}
          maxLength={3}
        />
        <View
          style={{
            borderColor: 'lightskyblue',
            borderWidth: 1,
            marginStart: 8,
            marginTop: 16,
            marginEnd: 8,
          }}
        >
          <FlatList
            horizontal={true}
            data={cardTypeList}
            keyExtractor={(item, index) => item.value + index.toString()}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback onPress={() => setCardType(item.value)}>
                <View
                  style={{
                    flex: 1,
                    minWidth: itemWidth,
                    maxWidth: itemWidth,
                  }}
                >
                  {item.value === cardType && (
                    <View style={styles.selectedView}>
                      <Text style={styles.selectedHeaderText}>{item.name}</Text>
                    </View>
                  )}
                  {item.value != cardType && (
                    <View style={styles.unselectedView}>
                      <Text style={styles.unSelectedHeaderText}>
                        {item.name}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableWithoutFeedback>
            )}
          />
        </View>

        {(binDetail != undefined &&  Object.keys(binDetail).length>0 )  && <View style={styles.listView}>
        <Text style={styles.listHeaderText}>Issuing Bank :- {binDetail.issuingBank} </Text>
        <Text style={styles.listHeaderText}>Card Type :- {binDetail.channelName} </Text>
        </View>}
        
        <View style={styles.buttonStyle}>
          <Button disabled={cardNumber == '' || cardExpiry == '' || cardCvv == '' || Object.keys(binDetail).length == 0 } title="Pay" onPress={() => goForNewCardTransaction()} />
        </View>
        
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
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    padding: 8,
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
  listView: {
    margin: 8,
    flexDirection: 'row',
  },
  listHeaderText: {
    padding: 8,
    fontWeight: 'bold',
    flex: 0.3,
    alignSelf: 'center',
  },
  selectedView: {
    backgroundColor: 'lightskyblue',
    borderColor: 'white',
  },
  selectedHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    padding: 8,
    alignSelf: 'center',
  },
  unSelectedHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    padding: 8,
    alignSelf: 'center',
  },
  unselectedView: {
    backgroundColor: 'white',
  },
});
