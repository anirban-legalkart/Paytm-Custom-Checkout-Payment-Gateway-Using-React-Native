import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function PayModePage({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const openPage = (pageName: string) => {
    navigation.navigate(pageName, route.params);
    console.log(route.params);
  };
  return (
    <View style={styles.mainView}>
      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={() => openPage('Wallet')}
      >
        <Text style={styles.buttonText}>Wallet</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={() => openPage('NetBanking')}
      >
        <Text style={styles.buttonText}>NetBanking</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={() => openPage('UpiCollect')}
      >
        <Text style={styles.buttonText}>Upi Collect</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={() => openPage('UpiIntent')}
      >
        <Text style={styles.buttonText}>Upi Intent</Text>
      </TouchableOpacity>
     
      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={() => openPage('NewCard')}
      >
        <Text style={styles.buttonText}>New Card</Text>
      </TouchableOpacity>
    
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
  },
  buttonStyle: {
    height: 45,
    justifyContent: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  buttonText: {
    fontSize: 19,
    alignSelf: 'center',
  },
});
