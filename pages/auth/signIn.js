import { Grid, TextField } from "@mui/material"
import Image from "next/image"
import LeftContent from "src/auth/LeftContent"
import styles from "src/auth/signIn/SignIn.module.css"
import SignInWithEmailAndPassword from "src/auth/signIn/SignInWithEmailAndPassword"
import { useRouter } from "next/router"
import { Button } from "@mui/material"

const Login = () => {
  const router = useRouter()


  return(
    <div className={styles.main_container}>
      <Grid container>
        <Grid item xs={0}sm={8.5} md={8.5}> 
          <LeftContent />
        </Grid>
        <Grid item xs={12} sm={3.5} md={3.5}>
          <div className={styles.login_container}>
            <h2>더한다 회원가입</h2>
            <h3>회원가입을 통해 어플을 관리하세요!</h3>
            <h4 className={styles.warning}>{`!실제 사용하고 있는 이메일을 입력해주세요.`}</h4>
            <h4 className={styles.warning}>{`(비밀번호 찾기 시 메일 발송)`}</h4>
            <SignInWithEmailAndPassword style={{marginTop:"40px"}}/>
            <div className={styles.center}>
              <Button
                variant="text"
                onClick={()=>router.back()}
              >
                {"< 뒤로가기"}
              </Button>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default Login