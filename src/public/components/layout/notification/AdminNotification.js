import { useEffect,useState } from "react"
import VerticalSmallSwiper from "./VerticalSmallSwiper"
import NotificationDialog from "./NotificationDialog"

import { firestore as db } from "firebase/firebase"
import { Dialog } from "@mui/material"



const AdminNotification = () => {
  const [notificationList, setNotificationList] = useState([])
  const [isOpenDialog, setIsOpenDialog] = useState(false)
  const [notificationData, setNotificationData] = useState({})

  useEffect(() => {

    const fetchData = async () => {
      const snapShot = await db.collection("admin_notification").orderBy("savedAt", "desc").where("condition", "==","게재중").get()

      if(!snapShot.empty){
        const list = snapShot.docs.map(doc=> ({id: doc.id, ...doc.data()}))
        setNotificationList(list)
      }
      
    }

    fetchData()
  },[])

  const onNotificationClick = (data) => {
    setIsOpenDialog(true)
    setNotificationData(data)
  }


  if(notificationList.length!==0)
  return(
    <>
      <div style={{margin:"0 0 15px 0"}}>
        <VerticalSmallSwiper list={notificationList} delay={7000} handleClick={onNotificationClick}/>
      </div>
      
      <Dialog open={isOpenDialog} onClose={()=>setIsOpenDialog(false)}>
        <NotificationDialog data={notificationData} onClose={()=>setIsOpenDialog(false)} />
      </Dialog>
    </>
  )
  else return <></>
}

export default AdminNotification