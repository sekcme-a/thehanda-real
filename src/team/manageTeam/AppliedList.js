import { useEffect, useState } from "react";
import useUserData from "context/userData"
import { useRouter } from "next/router";
import styles from "./AppliedList.module.css"
import {FUNCTION} from "./AppliedListFunction"

import { Button } from "@mui/material";

const AppliedList = ({appliedList, setAppliedList}) => {
  // const {user, userData} = useUserData()
  const router = useRouter()
  const {id} = router.query

  useEffect(()=>{

  },[])

  const onAcceptClick = async(user) => {
    if(confirm(`이름: ${user.name}\n전화번호: ${user.phoneNumber}\n해당 유저에게 관리자 권한을 부여하겠습니까?`)){
      await FUNCTION.give_authority(id, user.id)
      const list = appliedList.map((item) =>{
        if(item.id!==user.id) return item
      }).filter(Boolean)
      setAppliedList(list)
      alert("성공적으로 부여했습니다.")
    }
  }

  const onDeclineClick = async(user) =>{
    if(confirm(`이름: ${user.name}\n전화번호: ${user.phoneNumber}\n해당 유저의 권한신청을 거절하겠습니까?`)){
      await FUNCTION.decline_authority(id, user.id)
      const list = appliedList.map((item) =>{
        if(item.id!==user.id) return item
      }).filter(Boolean)
      setAppliedList(list)
      alert("권한신청을 거절했습니다.")
    }
  }
  
  return(
    <ul className={styles.main_container}>
      {appliedList.length===0 && <p style={{textAlign:"center"}}>신청자가 없습니다.</p>}
      {appliedList.map((user, index) => {
        return(
          <li key={`${user.id}_${index}`}>
            <h1>{user.name}</h1>
            <p>{user.phoneNumber}</p>
            <Button
              variant="contained"
              onClick={()=>onAcceptClick(user)}
              sx={{mr:"15px"}}
            >
              수락
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={()=>onDeclineClick(user)}
            >
              거절
            </Button>
          </li>
        )
      })}
    </ul>
  )
}

export default AppliedList