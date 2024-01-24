import styles from "./Topbar.module.css"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import AvatarWithMenu from "./AvatarWithMenu"
import useUserData from "context/userData"
import useData from "context/data"
import { firestore as db } from "firebase/firebase"

const titleData = {
  "/[id]/dashboard": "대쉬보드",
  "/[id]/point": "한다 포인트",
  "/[id]/profile": "내 프로필",
  "/[id]/team/manageTeam" : "구성원 관리",
  "/[id]/team/teamProfile": "팀 프로필",
  "/[id]/user/userList" : "구성원 관리",
  "/[id]/user/[uid]" : "유저 정보",
  "/[id]/user/category" : "그룹 관리",
  "/[id]/post/[type]" : "게시물 관리",
  "/[id]/section/[type]": "유형 관리",
  "/[id]/post/edit/[type]/[postId]": "게시물 편집",
  "/[id]/post/edit/announcements/[postId]": "공지사항 편집",
  "/[id]/chat": "한다챗",
  "/[id]/result/[type]/[docId]" : "결과보기",
  "/[id]/result/comments/[docId]" : "프로그램 후기",
  "/[id]/comment/[docId]" : "프로그램 후기 작성",
  "/[id]/schedule/programSchedule" : "프로그램 스케쥴",
  "/[id]/schedule/teamSchedule" : "팀 스케쥴",
  "/[id]/contact" : "센터문의 관리"
}

const Topbar = () => {
  const router = useRouter()
  const {id} = router.query
  const [title, setTitle] = useState("")
  const {user, userData} = useUserData()
  const {team} = useData()
  const photo = userData?.profile



  useEffect(()=>{
    if(id)
      setTitle(titleData[router.pathname.replace(id,"")])
    console.log(router.pathname.replace(id,""))
    // else
    //   setTitle(titleData)
    // console.log(router.pathname.slice(id.length))
  },[router])

  return(
    <div className={styles.main_container}>
      <h1>{title}</h1>
      <AvatarWithMenu photo={photo}  />
    </div>
  )
}

export default Topbar