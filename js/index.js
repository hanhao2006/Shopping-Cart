
// console.log("login");

const loginForm = document.querySelector('.login');
const blurImage = document.querySelector('.main-image');
loginForm.style.display = 'none';

const btnLogin = document
  .querySelector('.login-user')
  .addEventListener('click', () => {
    loginForm.style.display = 'block';
    blurImage.classList.toggle('main-image-blur');
  });


  const signupForm = document.querySelector('.signup');

  signupForm.style.display = 'none';

  const btnSignup = document
    .querySelector('.login-signup')
    .addEventListener('click', () => {
      signupForm.style.display = 'block';
      blurImage.classList.toggle('main-image-blur');
    });

var firebaseConfig = {
  apiKey: 'AIzaSyBYGBM5GlSjSn9c6lcJtb5psIgYUKV1uNU',
  authDomain: 'shoppingcart-41475.firebaseapp.com',
  databaseURL: 'https://shoppingcart-41475.firebaseio.com',
  projectId: 'shoppingcart-41475',
  storageBucket: 'shoppingcart-41475.appspot.com',
  messagingSenderId: '663001194541',
  appId: '1:663001194541:web:6209abf5b7323f81b7d8a4',
  measurementId: 'G-68NV7T1RX7',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

firebase.auth.Auth.Persistence.LOCAL;

// const btn = document.querySelector('#btn-login').addEventListener('click',console.log("hi"));
$('#btn-login').click(function () {
  var userEmail = $('#email').val();
  var userPassword = $('#psw').val();
  // console.log("postion button");
  
  if (userEmail != '' && userPassword != '') {
    var result = firebase
      .auth()
      .signInWithEmailAndPassword(userEmail, userPassword);
      console.log("hello");
  
    window.alert('Welcom');
    
    result.catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;

      console.log(errorCode);
      console.log(errorMessage);
      window.alert('Message : ' + errorMessage);
    });
  } else {
    window.alert('Please fill out all the fiel');
  }
});