import { useEffect } from "react"
import styles from "./Coupon.module.css"

import { firestore as db } from "firebase/firebase"
import { useState } from "react"
import { Button, Dialog, TextField } from "@mui/material"
import { Router } from "mdi-material-ui"
import { useRouter } from "next/router"

const Coupon = () => {
  const router = useRouter()

  const [couponList, setCouponList] = useState([])

  const [title, setTitle] = useState("")
  const [point, setPoint] = useState("")
  const [reason, setReason] = useState("")

  const [isOpenDialog, setIsOpenDialog] = useState(false)
  const [dialogData, setDialogData] = useState({})

  useEffect(()=> {
    const fetchData = async () => {
      const snapShot = await db.collection("coupon").orderBy("createdAt", "desc").get()
      if(!snapShot.empty){
        const list = snapShot.docs.map((doc) => ({id: doc.id, ...doc.data()}))
        setCouponList(list)
      } 
      
    }

    fetchData()
  },[])

  const onPointChange = (e) => {
    const inputValue = e.target.value.replace(/[^0-9]/g, '');
    setPoint(inputValue);
  }

  const onCouponClick = async () => {
    const randomDoc = await db.collection("coupon").doc().get()
    await db.collection("coupon").doc(randomDoc.id).set({
      createdAt: new Date(),
      title: title,
      point: point,
      reason: reason,
      isUsed: false,
    })
    alert(`쿠폰이 발급되었습니다.
쿠폰번호: ${randomDoc.id}`)
    router.reload()
  }

  const onDeleteCouponClick = async (id) => {
    if(confirm("쿠폰을 삭제하시겠습니까?")){
      await db.collection("coupon").doc(id).delete()
      alert("삭제되었습니다.")
    }
  }

  const openDialog = (item) => {
    setIsOpenDialog(true)
    setDialogData(item)
  }

  return(
    <div className={styles.main_container}>
      <h1>쿠폰 리스트</h1>
      <div className={styles.list_container}>
        {couponList.map((item, index) => {
          return(
            <div className={styles.item} key={index}>
              <p>쿠폰명: <strong>{item.title}</strong></p>
              <p>쿠폰번호: <strong>{item.id}</strong></p>
              <p>발급일 : <strong>{item.createdAt.toDate().toLocaleString("ko-kr")}</strong></p>
              <p>포인트: <strong>{item.point}</strong></p>
              <p onClick={()=>openDialog(item)} style={{cursor:"pointer"}}>발급사유 보기</p>
              {item.isUsed ?
              <p style={{color:"blue"}}>사용함</p>
              :
              <p style={{color:"purple"}}>미사용</p>
              }
              <p style={{color:"red", cursor:"pointer"}} onClick={()=>onDeleteCouponClick(item.id)}>쿠폰 삭제</p>
            </div>  
          )
        })}
      </div>
      
      <h1 style={{marginTop:"35px"}}>쿠폰 발급</h1>

      <div className={styles.input_container}>
        <TextField
          label="쿠폰명"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          size="small"
          sx={{mr:"15px"}}
        />
        <TextField
          label="충전 포인트"
          value={point}
          onChange={onPointChange}
          size="small"
          sx={{mr:"15px"}}
        />
        <TextField
          label="발급 사유"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          size="small"
        />
        <Button
          variant="contained"
          size="small"
          margin="dense"
          sx={{ml:"15px"}}
          onClick={onCouponClick}
        >
          쿠폰 발급
        </Button>
      </div>

      <Dialog
        open={isOpenDialog}
        onClose={()=>setIsOpenDialog(false)}
      >
        <div className={styles.dialog_container}>
          사유: {dialogData.reason}
        </div>
      </Dialog>
    </div>
  )
}

export default Coupon