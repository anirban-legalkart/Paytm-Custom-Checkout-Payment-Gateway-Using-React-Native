import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { fetchNBBankList, processTransaction } from '../../Service';

export default function NetBanking({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const [isNBFetched, setNBFetched] = useState(false);
  const [nbCodeList, setNBCodeList] = useState([]);
  const { txnToken } = route.params;
  const { orderId, callBackUrl } = route.params;

  const showAlert = useCallback(
    (message: string, isSuccess: boolean, goToTop = true) => {
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
    },
    [navigation]
  );


  const getNBList = useCallback(() => {
    
    fetchNBBankList(
      orderId,
      txnToken
    )
      .then((res) => {
        // console.log(res, 'OTP--');
        showAlert(JSON.stringify(res?.resultInfo?.resultMsg), true, false);

        if (res?.resultInfo?.resultStatus === 'S') {
          var nbPayOption = res?.nbPayOption;
          setNBCodeList(nbPayOption.payChannelOptions);
        } else {
          showAlert(res?.resultInfo?.resultMsg, false, false);
        }
      })
      .catch((err) => {
        showAlert(err.message, false, false);
      });
  }, [txnToken, orderId, showAlert]);

  useEffect(() => {
    if (!isNBFetched) {
      getNBList();
      setNBFetched(true);
    }
    // onClick("HDFC")
  }, [isNBFetched, getNBList]);

  const onClick = (bankCode: string) => {

    processTransaction({
        paymentMode: 'NET_BANKING',
        orderId: orderId,
        txnToken: txnToken,
        channelCode: bankCode,
    })
      .then((res) => {
        console.log(res, 'Transaction status--');

        if (res?.resultInfo?.resultStatus === 'S') {
          var form = res?.bankForm?.redirectForm;
          // setRedirectForm(form);
          navigation.navigate('NetBankingMerchantCheckPg', { redirectForm: form, orderId, callBackUrl })
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
      <FlatList
        data={nbCodeList}
        renderItem={({ item }: { item: any }) => (
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => onClick(item.channelCode)}
          >
            <Text style={styles.buttonText}>{item.channelName}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => item.channelCode + index.toString()}
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
  buttonStyle: {
    height: 45,
    justifyContent: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    padding: 0,
  },
  buttonText: {
    fontSize: 18,
    padding: 8,
  },
});
