// import {API_URL} from './Constant';
// import { SERVER_API_URL } from './Server_Url';
// const baseUrl= 'http://192.168.77.246:5000/api'
const baseUrl= 'http://192.168.7.246:5000/api'

export const generateToken = async (orderId, amount) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify({
    // "orderId": 'LKORDER3494224234',
    // "amount": 1,
    orderId: orderId,
    amount: amount,
  });
console.log(raw,'raw---');
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  // return await fetch('http://192.168.1.9:5000/api/payment', requestOptions)
  return await fetch( baseUrl +'/payment', requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log("result",result)
      return result?.body?.txnToken;
    })
    .catch(error => console.log('error', error));
};




export const fetchPayOption = async (orderId, txnToken) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify({
    // "orderId": 'LKORDER3494224234',
    // "txnToken": '8765345672344678',
    orderId: orderId,
    txnToken: txnToken,
  });
// console.log(raw,'raw---');
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  // return await fetch('http://192.168.1.9:5000/api/fetchPayOption', requestOptions)
  return await fetch(baseUrl +'/fetchPayOption', requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log("fetchPayOption -->> result",result)
      return result?.body
    })
    .catch(error => console.log('error', error));
};


export const sendOtpToLinkWallet = async (mobileNo, orderId, txnToken) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify({
    // "orderId": 'LKORDER3494224234',
    // "txnToken": '8765345672344678',
    mobileNo: mobileNo,
    orderId: orderId,
    txnToken: txnToken,
  });
// console.log(raw,'raw---');
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  // return await fetch('http://192.168.1.9:5000/api/sendOtpToLinkWallet', requestOptions)
  return await fetch(baseUrl +'/sendOtpToLinkWallet', requestOptions)
    .then(response => response.json())
    .then(result => {
      // console.log("sendOtpToLinkWallet -->> result",result)
      return result?.body
    })
    .catch(error => console.log('error', error));
};


export const validateOtpToLinkWallet = async (otp, orderId, txnToken) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify({
    // "orderId": 'LKORDER3494224234',
    // "txnToken": '8765345672344678',
    otp: otp,
    orderId: orderId,
    txnToken: txnToken,
  });
// console.log(raw,'raw---');
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  // return await fetch('http://192.168.1.9:5000/api/validateOtpToLinkWallet', requestOptions)
  return await fetch(baseUrl +'/validateOtpToLinkWallet', requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log("validateOtpToLinkWallet -->> result",result)
      return result?.body
    })
    .catch(error => console.log('error', error));
};


export const fetchWalletBalanceInfo = async (orderId, txnToken) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify({
    // "orderId": 'LKORDER3494224234',
    // "txnToken": '8765345672344678',
    orderId: orderId,
    txnToken: txnToken,
  });
// console.log(raw,'raw---');
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  // return await fetch('http://192.168.1.9:5000/api/fetchWalletBalanceInfo', requestOptions)
  return await fetch(baseUrl +'/fetchWalletBalanceInfo', requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log("fetchWalletBalanceInfo -->> result",result)
      return result?.body
    })
    .catch(error => console.log('error', error));
};




// export const processTransaction = async (paymentMode, orderId, txnToken, channelCode) => {
export const processTransaction = async (payload) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  // var raw = JSON.stringify({
  //   // "orderId": 'LKORDER3494224234',
  //   // "txnToken": '8765345672344678',
  //   paymentMode: paymentMode,
  //   orderId: orderId,
  //   txnToken: txnToken,
  //   channelCode: channelCode
  // });
  var raw = JSON.stringify(payload);

// console.log(raw,'raw---');
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  // return await fetch('http://192.168.1.9:5000/api/processTransaction', requestOptions)
  return await fetch(baseUrl +'/processTransaction', requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log("processTransaction -->> result",result)
      return result?.body
    })
    .catch(error => console.log('error', error));
};




export const fetchNBBankList = async (orderId, txnToken) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify({
    // "orderId": 'LKORDER3494224234',
    // "txnToken": '8765345672344678',
    orderId: orderId,
    txnToken: txnToken,
  });
// console.log(raw,'raw---');
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  // return await fetch('http://192.168.1.9:5000/api/fetchNBBankList', requestOptions)
  return await fetch(baseUrl +'/fetchNBBankList', requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log("fetchNBBankList -->> result",result)
      return result?.body
    })
    .catch(error => console.log('error', error));
};






export const fetchTransactionStatus = async (orderId) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify({
   
    orderId: orderId,
  });
// console.log(raw,'raw---');
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  // return await fetch('http://192.168.1.9:5000/api/fetchTransactionStatus', requestOptions)
  return await fetch(baseUrl +'/fetchTransactionStatus', requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log("fetchTransactionStatus -->> result",result)
      return result?.body
    })
    .catch(error => console.log('error', error));
};




export const validateUserVPA = async (vpa, orderId, txnToken) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify({
    vpa: vpa,
    orderId: orderId,
    txnToken: txnToken
  });
// console.log(raw,'raw---');
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  // return await fetch('http://192.168.1.9:5000/api/validateUserVPA', requestOptions)
  return await fetch(baseUrl +'/validateUserVPA', requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log("validateUserVPA -->> result",result)
      return result?.body
    })
    .catch(error => console.log('error', error));
};



export const validateUserCardDetails = async (cardNo, orderId, txnToken) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify({
    cardNo: cardNo,
    orderId: orderId,
    txnToken: txnToken
  });
// console.log(raw,'raw---');
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  // return await fetch('http://192.168.1.9:5000/api/validateUserCardDetails', requestOptions)
  return await fetch(baseUrl +'/validateUserCardDetails', requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log("validateUserCardDetails -->> result",result)
      return result?.body
    })
    .catch(error => console.log('error', error));
};
