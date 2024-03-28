
import useUserData from "context/userData"
import { useRouter } from "next/router"
import List from "src/super_admin/notification/List"
import ListControl from "src/super_admin/notification/ListControl"
import { useEffect } from "react"

const NotificationList = () => {
  const router = useRouter()
  const {userData} = useUserData()

  useEffect(()=> {
    if(!userData.roles.includes("super_admin")){
      alert("권한이 없습니다.")
      router.push("/")
    }
  },[])

  return(
    <div style={{padding: "30px"}}>
      <h1 style={{fontWeight:"bold", marginBottom:"15px"}}>공지 리스트</h1>
      <List />
      <ListControl />
    
    </div>
  )
}
export default NotificationList