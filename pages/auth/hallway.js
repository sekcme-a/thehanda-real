import AskTeam from "src/auth/hallway/AskTeam"
import AskName from "src/auth/hallway/AskName"
import { useEffect, useState } from "react"
import useUserData from "context/userData"

const Hallway = () => {
  const [step, setStep] = useState(0)
  const {user, userData} = useUserData()

  useEffect(()=>{
    if(userData && userData.name)
      setStep(2)
    else
      setStep(1)
  },[userData])

  if(step!==0)
  return(
    <div style={{
      width:"100%",
      height:"100%",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      backgroundColor:"rgba(244,248,250,0.87)"
    }}>
      {step===1 ? <AskName {...{setStep}} /> : <AskTeam /> }
    </div>
  )
}

export default Hallway
