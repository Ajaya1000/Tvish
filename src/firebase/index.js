import firebase from "firebase";
import { message } from "antd";
const firebaseConfig = {
  apiKey: "AIzaSyARXf2wdmACZax7gaiGt4FvZXIHm6ALbXA",
  authDomain: "tvish-5f65e.firebaseapp.com",
  databaseURL: "https://tvish-5f65e.firebaseio.com",
  projectId: "tvish-5f65e",
  storageBucket: "tvish-5f65e.appspot.com",
  messagingSenderId: "113521192857",
  appId: "1:113521192857:web:982715eff608518d766d08",
  measurementId: "G-0LVR3JVG6V",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth;
var signUp = async (email, password) =>
  await auth().createUserWithEmailAndPassword(email, password);
const signOut = async () => auth().signOut();
const signIn = async (email, password) =>
  await auth().signInWithEmailAndPassword(email, password);


// var authOnChange = async () => auth().onAuthStateChanged((user) => user);

var postProduct = (
  name,
  category,
  imageFile,
  price,
  originalPrice,
  spec,
  origin
) => {
  var currentUser = firebase.auth().currentUser;
  console.log(currentUser);
  var productRef = db.ref("users/" + currentUser.uid + "/products");
  var temp = productRef.push({
    name,
    category,
    price,
    originalPrice,
    spec,
    origin,
  }).key;
  console.log("temp is" + temp);
  let imageRef = firebase
    .storage()
    .ref("users/" + currentUser.uid + "/products")
    .child(`${temp}.jpg`);
  imageRef.put(imageFile).then((snapshot) => {
    console.log("file uploaded succesfuly");
    message.success("Product Added succesfully");
  });
};

var importGoods = async (currentPage, goodsPerPage, lastNode) => {
  var currentUser = firebase.auth().currentUser;
  var productRef;

  if (lastNode) {
    productRef = db
      .ref("users/" + currentUser.uid + "/products")
      .orderByKey()
      .startAt(lastNode)
      .limitToFirst(parseInt(goodsPerPage));
  } else {
    productRef = db
      .ref("users/" + currentUser.uid + "/products")
      .orderByKey()
      .limitToFirst(parseInt(goodsPerPage));
  }
  var goodList = [];
  

  var ans ;
  var temp;
  await productRef.once("value", (snapshot) => {
    temp=snapshot.val();
    console.log(temp);
    console.log('type of temp is ' + (typeof temp))
    // , (snapshot) => {
    snapshot = snapshot.val();
    for (let itemId in snapshot) {
      goodList.push(itemId);
    }
    ans = Promise.all(
        goodList.map((itemId) => {
          var a = {};
          a.id = itemId;
          for (const [pkey, pvalue] of Object.entries(snapshot[itemId])) {
            a[pkey] = pvalue;
          }
          // let url='url';

          // (async()=>{
          // url = await imageRef.child(`${itemId}.jpg`).getDownloadURL();
          // console.log('url is ' + url);
          // })();
          // a.url=url;
          return a;
        })
      )
    })
  // ans.forEach((item,index,arr)=> {

  // })
  console.log('type of ans is ' + (typeof ans))
  console.log(ans);
  return ans;
};
var getImageURL = async (itemId) => {
    var currentUser = firebase.auth().currentUser;
    return firebase
      .storage()
      .ref("users/" + currentUser.uid + "/products").child(`${itemId}.jpg`).getDownloadURL();
}
export {
  signUp,
  signOut,
  signIn,
  db,
  auth,
  postProduct,
  importGoods,
  getImageURL
};
