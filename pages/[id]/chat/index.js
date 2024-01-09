import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import useData from "context/data"
import useUserData from "context/userData"
import styles from "src/chat/index.module.css"
import { firestore as db } from "firebase/firebase"

import ChatView from "src/chat/ChatView"

const Chat = () => {
  const {team} = useData()
  const router = useRouter()
  const [messageList, setMessageList] = useState([])
  const [selectedUid, setSelectedUid] = useState("")
  const [selectedTitle, setSelectedTitle] = useState("")

  useEffect(()=>{
    const dbRef = db.collection("team").doc(team.teamId).collection("chat_thumbnail").orderBy("createdAt", "desc")
    const unsubscribe = dbRef.onSnapshot((query)=>{
      const temp = query.docs.map((doc)=>{
        return {...doc.data(), id:doc.id}
      }).filter(Boolean)
      setMessageList(temp)
      console.log(temp)
    })

    return () => {
      unsubscribe()
    }
  },[])

  function truncateString(str) {
    if (str.length <= 35) {
      return str;
    } else {
      return str.slice(0, 35) + '...';
    }
  }

  const onMessageClick = (id, title, unread) => {
    setSelectedUid(id)
    setSelectedTitle(title)
    if(unread){
      db.collection("team").doc(team.teamId).collection("chat_thumbnail").doc(id).update({
        unread: false
      })
    }
  }


  return(
    <div className={styles.main_container}>
      <div className={styles.left_container}>
        {messageList.map((item, index) => {
          return(
            <div key={index} className={selectedUid===item.id ? `${styles.item_container} ${styles.selected}`:styles.item_container} onClick={()=>{onMessageClick(item.id, item.displayName, item.unread)}}>
                <div className={styles.top_container}>
                  <h1>{item.displayName}</h1>
                  <h2>{item.createdAt.toDate().toLocaleString()}</h2>
                </div>
                <div className={styles.bottom_container}>
                  <p className={styles.message}>{truncateString(item.content)}</p>
                  {item.unread &&
                    <div className={styles.unread_container}>
                      {/* <p>{item.unread}</p> */}
                    </div>
                  }
                </div>
            </div>
          )
        })}
      </div>
      <div className={styles.right_container}>
        {selectedUid!=="" && <ChatView uid={selectedUid} userName={selectedTitle} />}
      </div>

    </div>
  )
}

export default Chat