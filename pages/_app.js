import "src/public/styles/reset.css"
import "src/public/styles/quill.css"
import "src/public/styles/calendar.css"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { UserDataProvider } from "context/userData";
import { DataProvider } from "context/data";
import { useEffect } from "react";
import AuthStateChanged from "src/public/hooks/AuthStateChanged";
import Navbar from 'src/public/components/layout/Navbar'
import Topbar from 'src/public/components/layout/Topbar'
import { useRouter } from "next/router";
import { auth } from "firebase/firebase";
import { firestore as db } from "firebase/firebase";

export default function App({ Component, pageProps }) {
  const router = useRouter()
  
  const theme = createTheme({
    palette: {
      primary: {
        main: '#814ad8'
      }
    }
  });



  return (
      
        <UserDataProvider>
          <DataProvider>
            <AuthStateChanged>
            <ThemeProvider theme={theme}>
            
                {router.pathname.includes("auth") || router.pathname.includes("noAuthority") ? 
                  <Component {...pageProps} />
                  :
                  <div style={{display:"flex", width:"100%", minHeight:"100vh"}}>
                    <Navbar />
                    <div style={{width:"calc(100% - 250px)", float:"right", boxSizing:"border-box"}}>
                      <Topbar />
                      <div style={{padding: "20px 30px"}}><Component {...pageProps} /></div>
                    </div>
                  </div>
                }
            </ThemeProvider>
            </AuthStateChanged>
          </DataProvider>
        </UserDataProvider>
    
    )
}
