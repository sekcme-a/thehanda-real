import styles from "./Topbar.module.css"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import AvatarWithMenu from "./AvatarWithMenu"
import useUserData from "context/userData"
import useData from "context/data"
import { firestore as db } from "firebase/firebase"

const titleData = {
  "/dashboard": "대쉬보드",
  "/team/manageTeam" : "구성원 관리",
  "/user/userList" : "구성원 관리",
  "/user/[uid]" : "유저 정보",
  "/user/category" : "그룹 관리",
  "/post/[type]" : "게시물 관리",
  "/section/[type]": "섹션 관리",
  "/post/edit/[type]/[postId]": "게시물 편집",
  "/post/edit/announcements/[postId]": "공지사항 편집",
  "/chat": "한다챗",
  "/result/[type]/[docId]" : "결과보기",
  "/comment/[docId]" : "프로그램 후기 작성"
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
      setTitle(titleData[router.pathname.slice(id.length)])
    // else
    //   setTitle(titleData)
    // console.log(router.pathname.slice(id.length))
  },[router.pathname])

  return(
    <div className={styles.main_container}>
      <h1>{title}</h1>
      <AvatarWithMenu photo={photo}  />
    </div>
  )
}

export default Topbar