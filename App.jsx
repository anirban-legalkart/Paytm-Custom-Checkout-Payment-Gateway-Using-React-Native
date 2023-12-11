import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Payment from './src/Payment';
import NetBanking from './src/component/NetBanking/NetBanking';
import NetBankingMerchantCheckPg from './src/component/NetBanking/NetBankingMerchantCheckPg';
import NewCard from './src/component/NewCard/NewCard';
import NewCardMerchantCheckPg from './src/component/NewCard/NewCardMerchantCheckPg';
import PayModePage from './src/component/PayModePage';
import PaymentStatus from './src/component/PaymentStatus';
import UpiCollect from './src/component/UpiCollect/UpiCollect';
import UpiCollectMerchantCheckPg from './src/component/UpiCollect/UpiCollectMerchantCheckPg';
import UpiIntent from './src/component/UpiIntent';
import Wallet from './src/component/Wallet&SavedCards/Wallet';
import SavedCardMerchantCheckPg from './src/component/Wallet&SavedCards/SavedCardMerchantCheckPg';

const Stack = createStackNavigator();

const headerColor = '#026bc2';

export default function App() {
  return (
    <>
      {/* <StatusBar barStyle="default" backgroundColor={headerColor} /> */}
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: headerColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
         
          <Stack.Screen
            name="Home"
            component={Payment}
            options={{ title: 'React Native App' }}
          />
          <Stack.Screen
            name="PayMode"
            component={PayModePage}
            options={{ title: 'PayModes' }}
          />
          <Stack.Screen
            name="Wallet"
            component={Wallet}
            options={{ title: 'Wallet' }}
          />
          <Stack.Screen
            name="NetBanking"
            component={NetBanking}
            options={{ title: 'NetBanking' }}
          />
          <Stack.Screen
            name="NetBankingMerchantCheckPg"
            component={NetBankingMerchantCheckPg}
            options={{ headerShown:false }}
          />
          <Stack.Screen
            name="UpiCollect"
            component={UpiCollect}
            options={{ title: 'Upi Collect' }}
          />
          <Stack.Screen
            name="UpiCollectMerchantCheckPg"
            component={UpiCollectMerchantCheckPg}
            options={{ headerShown:false }}
          />
          <Stack.Screen
            name="UpiIntent"
            component={UpiIntent}
            options={{ title: 'Upi Intent' }}
          />
         
          <Stack.Screen
            name="NewCard"
            component={NewCard}
            options={{ title: 'New Card' }}
          />
          <Stack.Screen
            name="NewCardMerchantCheckPg"
            component={NewCardMerchantCheckPg}
            options={{ headerShown:false }}
          />

          <Stack.Screen
            name="SavedCardMerchantCheckPg"
            component={SavedCardMerchantCheckPg}
            options={{ headerShown:false }}
          />
          
          <Stack.Screen
            name="PaymentStatus"
            component={PaymentStatus}
            options={{ title: 'Payment Status' ,headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}