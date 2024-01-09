
import { Card, CardContent, Dialog } from "@mui/material"

import styles from "./GroupDetailsDialog.module.css"
import { useEffect, useState } from "react"

import { firestore as db } from "firebase/firebase"
import useData from "context/data"

const GroupDetailsDialog = ({isOpenDialog, setIsOpenDialog, groupData}) => {
  const {team, userList} = useData()
  const [groupUserList, setGroupUserList] = useState([])

  const [isLoading, setIsLoading] = useState(true)

  useEffect(()=> {
    const fetchData = async () => {
      const querySnapshot = await db.collection("team_admin").doc(team.teamId).collection("groups").doc(groupData.id).collection("memebers").orderBy("savedAt", "desc").get()

      if(!querySnapshot.empty){
        const list = await Promise.all(querySnapshot.docs.map(async(doc) => {
          if(userList[doc.id]){
            return({...userList[doc.id]})
          }else {
            const userDoc = await db.collection("user").doc(doc.id).get()
            if(userDoc.exists){
              return({uid: userDoc.id, ...userDoc.data()})
            }
          }
        })
        )
        setGroupUserList(list)
      }
      setIsLoading(false)
    }
    fetchData()
  },[])

  return(
    <Dialog
      open={isOpenDialog}
      onClose={()=>setIsOpenDialog(false)}
    >
      <Card className={styles.main_container}>
        <CardContent>
          <h1>{groupData.name}</h1>
          <h2>{groupData.explain}</h2>
          <h3>{`최초 생성일: ${groupData.createdAt.toDate().toLocaleString("ko-KR", {
            year: "numeric",
            month: "numeric",
            day: "numeric"
          })}`}
          </h3>
          <h4>생성자: {groupData.author}</h4>

          <h5>그룹 멤버</h5>
          
          <ul className={styles.userList}>
            {groupUserList.map((item, index) => {
              return(
                <div key={index}>
                  <h1>{item.title}</h1>
                </div>
              )
            })}

          </ul>
        </CardContent>
      </Card>
    </Dialog>
  )
}

export default GroupDetailsDialog