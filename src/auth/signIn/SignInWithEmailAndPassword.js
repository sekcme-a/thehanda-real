import styles from "./SignInWithEmailAndPassword.module.css"
import useUserData from "context/userData";

import { TextField, IconButton, Button } from "@mui/material"
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { useState } from "react";
import { auth } from "firebase/firebase";
import { FUNCTION } from "./SignInWithEmailAndPasswordFunction";

const SignInWithEmailAndPassword = ({style}) => {
  const {setUser} = useUserData()

  const [isPwVisible, setIsPwVisible] = useState(false)
  const [isPwConfirmVisible, setIsPwConfirmVisible] = useState(false)

  //*****for inputs
  const [values, setValues] = useState({
    email: "",
    pw:"",
    pwConfirm:"",
  })
  const onValuesChange = (prop) => (event) => {
      setValues(prevValues => ({...prevValues, [prop]: event.target.value}))
  }
  const handleValues = (type, value) => {
    setValues(prevValues => ({ ...prevValues, [type]: value }))
  }
  const [error, setError] = useState({
    type:"",
    message:""
  })
  const handleError = (type, message) => { setError({type: type, message: message})}
  //for inputs*****

  const onSignInClick = async () => {
    if(!values.email) setError({type:"email", message:'이메일을 입력해주세요.'})
    else if(!values.pw) setError({type:"pw", message:"비밀번호를 입력해주세요."})
    else if(values.pw!==values.pwConfirm) setError({type:"pwConfirm", message:"재확인 비밀번호가 다릅니다."})
    else{
      try{
        const userCred = await auth.createUserWithEmailAndPassword(values.email, values.pw)
        setUser(userCred.user ?? null)

      }catch(e){
        const err = FUNCTION.get_error_message(e.message)
        setError(err)
      }
    }
  }

  return(
    <div className={styles.main_container} style={style}>
      <TextField
        label="이메일"
        variant="outlined"
        error={error.type==="email"}
        helperText={error.type!=="email" ? "" : error.message}
        value={values.email}
        onChange={onValuesChange("email")}
        fullWidth
        size="small"
      />
      
      <TextField
        label="비밀번호"
        variant="outlined"
        sx={{mt:"20px"}}
        type={isPwVisible ? "text":"password"}
        error={error.type==="pw"}
        helperText={error.type!=="pw" ? "" : error.message}
        value={values.pw}
        onChange={onValuesChange("pw")}
        // multiline={false} rows={1} maxRows={1}
        size="small"
        InputProps={{
          endAdornment: <IconButton onClick={()=>setIsPwVisible(!isPwVisible)}>{isPwVisible ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}</IconButton>
        }}
        fullWidth
      />
      <TextField
        label="비밀번호 재확인"
        variant="outlined"
        sx={{mt:"20px"}}
        type={isPwConfirmVisible ? "text":"password"}
        error={error.type==="pwConfirm"}
        helperText={error.type!=="pwConfirm" ? "" : error.message}
        value={values.pwConfirm}
        onChange={onValuesChange("pwConfirm")}
        // multiline={false} rows={1} maxRows={1}
        size="small"
        InputProps={{
          endAdornment: <IconButton onClick={()=>setIsPwConfirmVisible(!isPwConfirmVisible)}>{isPwVisible ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}</IconButton>
        }}
        fullWidth
      />

      <Button
        variant="contained"
        onClick={onSignInClick}
        sx={{mt:'30px'}}
        fullWidth
      >
        회원가입
      </Button>
    </div>
  )
}

export default SignInWithEmailAndPassword