
import { useEffect } from "react"
import styles from "./List.module.css"

import { firestore as db } from "firebase/firebase"
import { useState } from "react"
import { getYMDFromTimestamp } from "src/public/hooks/getDate"
import { useRouter } from "next/router"

const List = () => {
  const router = useRouter()
  const [notificationList, setNotificationList] = useState([])

  useEffect(()=> {
    const fetchData = async () => {
      const snapShot = await db.collection("admin_notification").orderBy("savedAt", "desc").get()
      if(!snapShot.empty){
        const list = snapShot.docs.map((doc) => ({id: doc.id, ...doc.data()}))
        setNotificationList(list)
      }
    }
    fetchData()
  },[])

  return(
    <div className={styles.list_container}>
      {notificationList.map((item, index) => (
        <li className={styles.item} key={index} onClick={()=>router.push(`/super_admin/notification/${item.id}`)}>
          <p>제목: <strong>{item.title}</strong></p>
          <p>저장일: <strong>{getYMDFromTimestamp(item.savedAt)}</strong></p>
          <p>상태: <strong>{item.condition}</strong></p>
        </li>
      ))}
    </div>
  )
}

export default List