

import { CircularProgress, Grid } from "@mui/material"
import { useRouter } from "next/router"
import { useState } from "react"
import { useEffect } from "react"
import UserViewLeft from "src/user/user/UserViewLeft"
import UserViewRight from "src/user/user/UserViewRight"

import { firestore as db } from "firebase/firebase"

const User = () => {
  const router = useRouter()
  const {uid} = router.query

  const [userData, setUserData] = useState()

  const [isLoading, setIsLoading] = useState(true)

  useEffect(()=> {
    const fetchData = async () => {
      const userDoc = await db.collection("user").doc(uid).get()
      if(userDoc.exists){
        setUserData({
          uid: userDoc.id,
          ...userDoc.data()
        })
        setIsLoading(false)
      }else {
        alert("해당 유저가 존재하지 않거나 탈퇴했습니다.")
        router.back()
      }
    }

    fetchData()
  },[uid])

  if(isLoading || !userData) return(<CircularProgress />)

  return(
    <>
    <Grid container spacing={2}>
      <Grid item xs={12} md={5} lg={4}>
        <UserViewLeft data={userData} />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <UserViewRight data={userData} setData={setUserData} />
      </Grid>
    </Grid>
   
   
    </>
  )

  
}

export default User