import {createContext, useContext, useEffect, useState} from "react";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import {auth} from "../firebase";
import {useSnackbar} from "notistack";

export const UserContext = createContext({});

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (res) => {
      if (res) {
        setUser(res);
      } else {
        setUser(null);
      }
      setError("");
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const registerUser = async (email, password, name) => {
    setLoading(true);
    await createUserWithEmailAndPassword(auth, email, password)
        // .then(() =>
        //   updateProfile(auth.currentUser, {
        //     displayName: name,
        //   })
        // )
        .then((res) => {
          enqueueSnackbar("User Registration Successfully!", {variant: "success"})
          console.log("auth ", auth.currentUser)
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
  };

  const signInUser = (email, password) => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        enqueueSnackbar("User Login Successfully!", {variant: "success"})
        console.log(res)
      })
      .catch((err) => setError(err.code))
      .finally(() => setLoading(false));
  };

  const logoutUser = () => {
    signOut(auth);
  };

  const forgotPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const contextValue = {
    user,
    loading,
    error,
    signInUser,
    registerUser,
    logoutUser,
    forgotPassword,
  };
  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
