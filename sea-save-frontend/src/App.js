import './App.css';
import AppRoutes from "./AppRoutes";
import {useUserContext} from "./context/UserContext";
import Auth from "./components/auth/Auth";
import {useSnackbar} from "notistack";
import {useEffect} from "react";
import LandingPage from "./components/LandingPage";

function App() {
    const { user, loading, error } = useUserContext();
    const { enqueueSnackbar } = useSnackbar();
    useEffect(()=>{
        if (error)
            enqueueSnackbar(error, {variant: "error"})
    }, [error])
  return (
      // <ThemeProvider theme={theme}>
      //   <AppRoutes/>
      // </ThemeProvider>


<>
          {/*{error ? enqueueSnackbar("Check your email!", {variant: "success"}):""}*/}
          {
              loading ?
                  <LandingPage/>
                  :
                  <>
                      {user ? <AppRoutes /> : <Auth />}
                  </>
          }
    {/*{<> {user ? <AppRoutes/> : <Auth/>} </>}*/}
</>
  );
}

export default App;
