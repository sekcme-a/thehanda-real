import { Button, TextField } from "@mui/material"
import styles from "./CouponDialog.module.css"
import { useState } from "react"

import { firestore as db } from "firebase/firebase"
import { addPointUsingCoupon } from "src/public/hooks/handlePoints"
import useData from "context/data"
import { Router } from "mdi-material-ui"
import { useRouter } from "next/router"

const CouponDialog = ({remainPoints}) => {
  const {team} = useData()
  const router = useRouter()

  const [couponId, setCouponId] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState("")

  const [couponTitle, setCouponTitle]= useState("")
  const [couponPoint, setCouponPoint] = useState("")
  
  const onSearchClick = async () => {
    setCouponTitle(""); setCouponPoint("")
    const doc = await db.collection("coupon").doc(couponId).get()
    if(doc.exists){
      if(doc.data().isUsed){alert("이미 사용한 쿠폰입니다.");}
      else{
        setCouponPoint(doc.data().point)
        setCouponTitle(doc.data().title)
      }
      
    }else {
      setError("유효하지 않은 쿠폰 번호입니다.")
    }
    setIsSearching(false)

  }

  const onCouponIdChange = (e) => {
    setCouponId(e.target.value)
    setError("")
  }

  const onUseCouponClick = async () => {
    try{
      const doc = await db.collection("coupon").doc(couponId).get()
      if(doc.exists){
        if(doc.data().isUsed){alert("이미 사용한 쿠폰입니다.");}
        await addPointUsingCoupon(team.teamId, couponId, "포인트 충전 (쿠폰)", doc.data().title, doc.data().point)
        alert("포인트가 충전되셨습니다.")
        router.reload()
      }else {
        setError("유효하지 않은 쿠폰 번호입니다.")
      }
    }catch(e){
      console.log(e)
      alert("쿠폰을 사용하실 수 없습니다. 관리자에게 문의하세요.")
    }
  }


  return(
    <div className={styles.main_container}>
      <h1>한다 쿠폰 사용</h1>
      <TextField
        label="쿠폰 번호를 입력해주세요."
        error={error!==""}
        helperText={error}
        margin="dense"
        size="small"
        fullWidth
        value={couponId}
        onChange={onCouponIdChange}
        sx={{mt:"17px"}}
      />
      <Button
        margin="dense"
        size="small"
        fullWidth
        variant="contained"
        sx={{mt:"20px", mb:"30px"}}
        onClick={onSearchClick}
        disabled={isSearching}
      >
        {isSearching ? "쿠폰 검색중" : "쿠폰 검색"}
      </Button>


      <h2>잔여 포인트 <strong>{remainPoints}p</strong></h2>
      {couponPoint!=="" && 
        <>
          <h2 style={{backgroundColor:"rgb(236, 220, 255)"}}>쿠폰 명 <strong>{couponTitle}</strong></h2>
          <h2 style={{backgroundColor:"rgb(236, 220, 255)"}}>쿠폰 포인트 <strong>{couponPoint}p</strong></h2>
          <h2 style={{backgroundColor:"rgb(221, 220, 255)"}}>사용 후 포인트 <strong>{parseInt(couponPoint)+parseInt(remainPoints)}p</strong></h2>
          <Button
            margin="dense"
            size="small"
            fullWidth
            variant="contained"
            sx={{mt:"10px", mb:"30px"}}
            onClick={onUseCouponClick}
            disabled={isSearching}
          >
            쿠폰 사용
          </Button>
        </>
      }
    </div>
  )
}


export default CouponDialog