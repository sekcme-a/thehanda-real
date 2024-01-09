export const FUNCTION = {
  get_error_message: (message) => {
    if(message==="The email address is badly formatted.")
      return({type:"email", message:"유효하지 않은 이메일입니다."})
    else if(message==="Password should be at least 6 characters")
      return({type:"pw", message:"비밀번호는 최소 6자기 이상이여야합니다."})
    else if(message==="The email address is already in use by another account.")
      return({type:"email", message:"이미 등록된 이메일 주소입니다."})
    else{
      alert("오류가 발생했습니다. 잠시후에 다시 시도해주세요.")
      console.log(message)
      return({type:"", message:""})
    }
  }
}