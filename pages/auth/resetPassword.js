import { Grid, TextField } from "@mui/material"
import Image from "next/image"
import styles from "src/auth/resetPassword/Index.module.css"
import ResetPassword from "src/auth/resetPassword/ResetPassword"
import LeftContent from "src/auth/LeftContent"

const Login = () => {
  return(
    <div className={styles.main_container}>
      <Grid container>
        <Grid item xs={0}sm={8.5} md={8.5}> 
          <LeftContent />
        </Grid>
        <Grid item xs={12} sm={3.5} md={3.5}>
          <div className={styles.login_container}>
            <h2>비밀번호를 잊어버리셨나요? 🔒</h2>
            <h3>이메일을 입력하시면 해당 이메일로 비밀번호 재설정 안내 메일을 보내드립니다.</h3>
            <ResetPassword style={{marginTop:"40px"}}/>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default Login