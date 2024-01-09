import { Card, CardContent, CircularProgress } from "@mui/material"
import useData from "context/data"
import { useEffect } from "react"
import { useState } from "react"
import CSVTable from "src/result/CSVTable"
import UserCount from "src/user/userList/UserCount"
import UserListCompo from "src/user/userList/userList"

import { firestore as db } from "firebase/firebase"


const UserList = () => {
  const {team, userList, fetch_userList} = useData()

  const [isLoading, setIsLoading] = useState(true)



  useEffect(()=> {
    const fetchData = async () => {
      await fetch_userList(team.teamId, false)

      setIsLoading(false)
    }

    fetchData()
  },[])



  if(isLoading)return <CircularProgress />

  return(
    <>
      <h1 style={{fontSize:"20px", fontWeight:"bold", marginBottom:"10px"}}>사용자 현황</h1>
      <p style={{fontSize:"15px", marginBottom:"20px"}}> {`${team.teamName}의 컨텐츠를 1회 이상 사용한 사용자 현황입니다.`}</p>
      <UserCount count={userList.length}/>

      <h1 style={{fontSize:"20px", fontWeight:"bold", marginBottom:"10px", marginTop:"50px"}}>사용자 목록</h1>
      <p style={{fontSize:"15px", marginBottom:"40px"}}> {`${team.teamName} 사용자 목록입니다. 변경사항은 새로고침 시 표시됩니다.`}</p>
      <UserListCompo />

    </>
  )
}

export default UserList