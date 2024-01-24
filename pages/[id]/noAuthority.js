import styles from "src/auth/noAuthority/noAuthority.module.css"
import Image from "next/image"
import { useRouter } from "next/router"
import useUserData from "context/userData"
import { firestore as db } from "firebase/firebase"

import { Button } from "@mui/material"
import { useState } from "react"
import { useEffect } from "react"


const NoAuthority = () => {
  const router = useRouter()
  const {id} = router.query
  const {user, userData} = useUserData()
  const [isSending, setIsSending] = useState(false)
  const [sended, setSended] = useState(false)

  useEffect(()=>{
    if(userData.roles && (userData.roles.includes("super_admin") || userData.roles.includes(`${id}_admin`) || userData.roles.includes(`${id}_high_admin`)||userData.roles.includes(`${id}_super_admin`)))
      router.push(`/${id}/dashboard`)
  },[])

  const onButtonClick = async () => {
    setSended(false)
    setIsSending(true)
    const teamDoc = await db.collection("team").doc(id).get()
    if(teamDoc.exists && teamDoc.data().adminUsers && teamDoc.data().adminUsers.includes(user.uid))
      alert("이미 엑세스 권한이 있습니다. 새로고침하세요.")
    else
      await db.collection("team").doc(id).collection("application").doc(user.uid).set({sendedAt: new Date()})
    setIsSending(false)
    setSended(true)
  }

  return (
    <div className={styles.main_container}>
      <div className={styles.no_authority_container}>
        <div className={styles.logo_container}>
          <Image src={"/images/no_authority.jpg"} alt="Teams 로고" width={350} height={150} />
        </div>  
        <h1>Admin Teams에 오신것을 환영합니다!</h1>
        <h2>Admin Teams의 {id} 팀에 대한 엑세스 권한이 없습니다.<br /> 아래의 버튼을 통해 관리자에게 권한을 요청하세요.</h2>
        <div style={{width:'100%', display:"flex", justifyContent:"center", marginTop:"20px", flexWrap:"wrap"}}>
          <Button
            variant="contained"
            onClick={onButtonClick}
            sx={{width:"150px"}}
          >
            권한 요청
          </Button>
          <div style={{width:"100%", display:"flex", justifyContent:"center", marginTop:"15px"}}>
            {isSending && <p>요청중입니다...</p>}
            {sended && <p>성공적으로 요청되었습니다.</p>}
          </div>
        </div>
        
        {/* {props.isTeamName ? 
          <>
            <h2>Admin Teams의 {props.teamName} 팀에 대한 엑세스 권한이 없습니다.<br /> 팀의 관리자에게 엑세스 권한을 요청하세요.</h2>
            <h3>요청코드 : {props.uid}</h3>
          </>
        :
          <h2>Admin Teams에 {props.teamName} 조직이 존재하지 않습니다. 조직을 생성하려면 홈페이지 관리자에게 문의하세요.</h2>
      } */}
      </div>
      
    </div>
  )
}

export default NoAuthority