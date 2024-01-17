
import { useEffect } from "react"
import styles from "./TeamList.module.css"

import { firestore as db } from "firebase/firebase"
import { useState } from "react"


const TeamList = () => {

  const [list, setList] = useState([])

  useEffect(()=> {
    const fetchData = async () => {
      const snapshot = await db.collection("team").get()
      if(!snapshot.empty){
        const tempList = snapshot.docs.map((doc) => {
          return{...doc.data()}
        })
        setList(tempList)
      }
    }
    fetchData()
  },[])

  return(
    <div className={styles.main_container}>
      {list.map((item, index) => {
        return(
          <div className={styles.item} key={index}>
            <h1>{item.teamName} - {item.teamId}</h1>
          </div>
        )
      })}
    </div>
  )
}

export default TeamList