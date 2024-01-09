export const FUNCTION = {
  get_error_message : (message) => {
    if (message==="The email address is badly formatted.")
      return ({type:"email", message:"유효하지 않은 이메일입니다."})
    else if (message==="There is no user record corresponding to this identifier. The user may have been deleted.")
      return({type:"pw", message:"이메일이나 비밀번호가 틀렸습니다."})
    else if(message==="The password is invalid or the user does not have a password.")
      return({type:"pw", message:"이메일이나 비밀번호가 틀렸습니다."})
    else if (message==="Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.")
      return({type:"pw", message:"로그인 시도가 여러 번 실패하여 이 계정에 대한 액세스가 일시적으로 해제되었습니다. 암호를 재설정하여 즉시 복원하거나 나중에 다시 시도할 수 있습니다."})
    else{
      alert("이메일이나 비밀번호가 틀렸습니다.")
      console.log(message)
      return({type:"", message:""})
    }
  }
}