// Import the necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, where, getDocs } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbKd1q8udQYTmiib_qBcRHJ8ClNOesdQU",
  authDomain: "orderentryproject.firebaseapp.com",
  projectId: "orderentryproject",
  storageBucket: "orderentryproject.appspot.com",
  messagingSenderId: "724123231255",
  appId: "1:724123231255:web:baec94a71583ad99dca852",
  measurementId: "G-GEQG9TXC09"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById('orderForm');
const orderList = document.getElementById('orderList');
let currentCustomerName = '';
let currentOrderNo = '';

document.getElementById('nextButton').addEventListener('click', async () => {
  const customerName = form.customerName.value;
  const orderNo = form.orderNo.value;
  const batterySerialNo = form.batterySerialNo.value;
  const date = new Date();

  if (!customerName || !orderNo || !batterySerialNo) {
    alert("Please fill in all fields before proceeding.");
    return;
  }

  try {
    await addDoc(collection(db, 'orders'), {
      srNo: Date.now(),
      date: date.toISOString(),
      customerName: customerName,
      orderNo: orderNo,
      batterySerialNo: batterySerialNo
    });
    console.log('Document successfully written!');
    // Clear battery serial no and retain customer name and order no
    form.batterySerialNo.value = '';
    currentCustomerName = customerName;
    currentOrderNo = orderNo;
    displayOrders(currentOrderNo);
  } catch (error) {
    console.error('Error adding document: ', error);
  }
});

document.getElementById('submitButton').addEventListener('click', () => {
  form.customerName.value = '';
  form.orderNo.value = '';
  form.batterySerialNo.value = '';
  currentCustomerName = '';
  currentOrderNo = '';
  orderList.innerHTML = '';
});

async function displayOrders(orderNo) {
  orderList.innerHTML = '';
  const q = query(collection(db, 'orders'), where('orderNo', '==', orderNo));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const order = doc.data();
    const li = document.createElement('li');
    li.textContent = `Sr No: ${order.srNo}, Date: ${order.date}, Customer Name: ${order.customerName}, Battery Serial No: ${order.batterySerialNo}`;
    orderList.appendChild(li);
  });
}

// Initial load
displayOrders(currentOrderNo);
