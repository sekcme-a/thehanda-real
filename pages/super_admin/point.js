
import { Button, Dialog } from "@mui/material"

import { firestore as db } from "firebase/firebase"
import { useState } from "react"
import { useEffect } from "react"

import styles from "./point.module.css"
import { useRouter } from "next/router"
import { getYYYYMM } from "src/public/hooks/getDate"

import GivePoint from "src/super_admin/point/GivePoint"
import Coupon from "src/super_admin/point/Coupon"
import { EditPoint_ForSuperAdmin } from "src/public/hooks/handlePoints"
import TeamList from "src/super_admin/dialog/TeamList"
import useUserData from "context/userData"

const Point = () => {
  const router = useRouter()
  const [applicateList, setApplicateList] = useState([])
  const [isTeamListDialogOpen, setIsTeamListDialogOpen] = useState(false)
  const {userData} = useUserData()

  useEffect(()=> {
    if(!userData.roles.includes("super_admin")){
      alert("권한이 없습니다.")
      router.push("/")
    }
  },[])

  useEffect(()=> {
    const fetchData = async () => {
      const snapShot = await db.collection("super_admin").doc("document").collection("point").orderBy("createdAt", "desc").get()

      if(!snapShot.empty){
        const list = snapShot.docs.map((doc) => {
          return {...doc.data(), id: doc.id}
        })
        setApplicateList(list)
      }

    }

    fetchData()
  },[])


  const onChargeClick = async (data) => {
    if(confirm(
`팀명: ${data.teamName}
충전액: ${data.chargePointAmount}
입금자명: ${data.depositor}
신청일: ${data.createdAt.toDate().toLocaleString('ko-kr')}

충전하시겠습니까?
`
    )){

      await EditPoint_ForSuperAdmin(
        data.teamId, 
        `포인트 충전 (결재)`,
        `${data.depositor} (입금자 명)`,
        data.chargePointAmount,
        ""
      )

      db.collection("super_admin").doc("document").collection("point").doc(data.id).update({
        hasCharged: true,
        chargedAt: new Date()
      })

      
      alert("포인트 충전이 완료되었습니다.")
      router.reload()
    }
  }


  const onDeleteClick = async (data) => {
    if(confirm(
`팀명: ${data.teamName}
충전액: ${data.chargePointAmount}
입금자명: ${data.depositor}
신청일: ${data.createdAt.toDate().toLocaleString('ko-kr')}

해당 요청을 삭제하시겠습니까? 
`
    )){
      await db.collection("super_admin").doc("document").collection("point").doc(data.id).delete()
      alert("삭제되었습니다.")
      router.reload()
    }
  }


  return(
    <div style={{padding: "30px 40px"}}>
      <h1 style={{fontSize:"18px", fontWeight:"bold", marginBottom:"10px"}}>충전 요청 리스트</h1>
      <div className={styles.list_container}>
        {applicateList.map((item, index) => {
          return(
            <div key={index} className={styles.item}>
              <p>팀명: <strong>{item.teamName}</strong></p>
              <p>충전액: <strong>{item.chargePointAmount}</strong></p>
              <p>입금자명: <strong>{item.depositor}</strong></p>
         
              <p>신청일: <strong>{item.createdAt.toDate().toLocaleString('ko-kr')}</strong></p>
              
              {item.hasCharged ?
                <h3 className={styles.charged}>충전됨</h3>
                :
                <h3 className={styles.unCharged}>미충전</h3>
              }

              {item.hasCharged &&  <p style={{marginLeft:"30px"}}>충전일: <strong>{item.chargedAt.toDate().toLocaleString('ko-kr')}</strong></p>}


              {!item.hasCharged && <h1 onClick={()=>onChargeClick(item)}>충전하기</h1>}
              <h2 onClick={()=>onDeleteClick(item)}>X</h2>
            </div>
          )
        })}
      </div>

      <GivePoint />

      <Coupon />
      
      <Button
        variant="contained"
        onClick={()=>router.back()}
        sx={{mt:"20px"}}

      >
        {`< 뒤로가기`}
      </Button>
      <Button
        variant="contained"
        onClick={()=>setIsTeamListDialogOpen(true)}
        sx={{ml:"30px", mt:"20px"}}
      >
        팀 리스트 보기
      </Button>

      <Dialog
        open={isTeamListDialogOpen}
        onClose={()=>setIsTeamListDialogOpen(false)}
      >
        <TeamList />
      </Dialog>
    </div>
  )
}

export default Point