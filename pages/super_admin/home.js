import { Button } from "@mui/material"
import useUserData from "context/userData"
import { useRouter } from "next/router"
import { useEffect } from "react"


const Home = () => {
  const router = useRouter()
  const {userData} = useUserData()

  useEffect(()=> {
    if(!userData.roles.includes("super_admin")){
      alert("권한이 없습니다.")
      router.push("/")
    }
  },[])

  const BUTTON_STYLE = {
    variant:"contained",
    margin:"dense",
    size:"small",
    sx:{m:"10px"}
  }


  return(
    <div style={{padding: "50px"}}>
      <Button {...BUTTON_STYLE} onClick={()=>router.push("/super_admin/addTeam")}>
        팀 생성
      </Button>
      <Button {...BUTTON_STYLE} onClick={()=>router.push("/super_admin/point")}>
        포인트 관리
      </Button>
      <Button {...BUTTON_STYLE} onClick={()=>router.push("/super_admin/notification/list")}>
        전체공지 관리
      </Button>
      <Button {...BUTTON_STYLE} onClick={()=>router.push("/super_admin/commerce/admin")}>
        관리자페이지 광고 관리
      </Button>
    
      <Button {...BUTTON_STYLE} onClick={()=>router.push("/super_admin/commerce/app")}>
        어플 광고 관리
      </Button>
    
    
    </div>
  )
}

export default Home