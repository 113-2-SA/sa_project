import { getAuth, signInWithEmailAndPassword ,GoogleAuthProvider ,signOut, signInWithPopup} from "firebase/auth";

const provider = new GoogleAuthProvider();
const auth = getAuth();
const Login = (email:any,password:any) => {


const auth = getAuth();

//email登入
signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
//google登入

  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result.user;
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      
    });


};


signOut(auth).then(() => {
  // Sign-out successful.
}).catch((error) => {
  // An error happened.
});
export { signOut };

