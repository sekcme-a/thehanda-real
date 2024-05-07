import { Grid, TextField } from "@mui/material"
import Image from "next/image"
import styles from "src/auth/login/Login.module.css"
import IdAndPassword from "src/auth/login/IdAndPassword"
import LeftContent from "src/auth/LeftContent"
import useUserData from "context/userData"
import { useEffect } from "react"
import { useRouter } from "next/router"

const Login = () => {
  const {user} = useUserData()
  const router = useRouter()

  useEffect(()=>{
    if(user)  router.push("/auth/hallway")
  },[user])
  return(
    <div className={styles.main_container}>
      <Grid container>
        <Grid item xs={0}sm={8.5} md={8.5}> 
          <LeftContent />
        </Grid>
        <Grid item xs={12} sm={3.5} md={3.5}>
          <div className={styles.login_container}>
            <h2>Welcome to Thehanda!</h2>
            <h3>로그인해서 어플을 관리하세요.</h3>
            <IdAndPassword style={{marginTop:"40px"}}/>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default Login