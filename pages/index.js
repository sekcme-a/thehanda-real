import { useEffect, useState } from "react";
import useUserData from "context/userData"
import { useRouter } from "next/router";

const Home = () => {
  const {user, userData} = useUserData
  const router = useRouter()

  useEffect(()=>{
    if(!user)
      router.push("/auth/login")
    else
      router.push("/auth/hallway")
  },[])
  
  return(
    <>
    
    </>
  )
}

export default Home