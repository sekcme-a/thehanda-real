import { Button } from "@mui/material"
import { useRouter } from "next/router"



const Home = () => {
  const router = useRouter()

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
    
    
    </div>
  )
}

export default Home