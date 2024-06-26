// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const form = document.getElementById('orderForm');
const orderList = document.getElementById('orderList');
let currentCustomerName = '';
let currentOrderNo = '';

document.getElementById('nextButton').addEventListener('click', () => {
  const customerName = form.customerName.value;
  const orderNo = form.orderNo.value;
  const batterySerialNo = form.batterySerialNo.value;
  const date = new Date();

  db.collection('orders').add({
    srNo: Date.now(),
    date: date.toISOString(),
    customerName: customerName,
    orderNo: orderNo,
    batterySerialNo: batterySerialNo
  }).then(() => {
    // Clear battery serial no and retain customer name and order no
    form.batterySerialNo.value = '';
    currentCustomerName = customerName;
    currentOrderNo = orderNo;
    displayOrders(currentOrderNo);
  }).catch((error) => {
    console.error('Error adding document: ', error);
  });
});

document.getElementById('submitButton').addEventListener('click', () => {
  form.customerName.value = '';
  form.orderNo.value = '';
  form.batterySerialNo.value = '';
  currentCustomerName = '';
  currentOrderNo = '';
  orderList.innerHTML = '';
});

function displayOrders(orderNo) {
  orderList.innerHTML = '';
  db.collection('orders').where('orderNo', '==', orderNo).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const order = doc.data();
      const li = document.createElement('li');
      li.textContent = `Sr No: ${order.srNo}, Date: ${order.date}, Customer Name: ${order.customerName}, Battery Serial No: ${order.batterySerialNo}`;
      orderList.appendChild(li);
    });
  });
}
