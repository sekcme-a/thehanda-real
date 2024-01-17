import { Button, TextField } from "@mui/material"

import styles from "./ChargeDialog.module.css"
import { useState } from "react"
import { useEffect } from "react"

import { firestore as db } from "firebase/firebase"
import useData from "context/data"
import { getYYYYMM } from "src/public/hooks/getDate"


const ChargeDialog = ({remainPoints}) => {
  const [chargePointAmount, setChargePointAmount] = useState("0")
  const [chargetPointAmountHelperText, setChargePointAmountHelperText] = useState(remainPoints)

  const {team} = useData()

  const [depositor, setDepositor] = useState("")

  const [isLoading, setIsLoading] = useState(false)
  
  useEffect(()=> {

  },[])
  
  const onChargePointAmountChange = (e) => {
    const inputValue = e.target.value.replace(/[^0-9]/g, '');
    setChargePointAmount(inputValue);
    if(e.target.value==="") setChargePointAmountHelperText(remainPoints)
    else setChargePointAmountHelperText(parseInt(remainPoints)+parseInt(inputValue))
  }

  const onSubmitClick = async () => {
    if(chargePointAmount==="" || chargePointAmount===0){
      alert("충전할 포인트를 입력해주세요.")
      return
    }
    if(depositor===""){
      alert("입금자 명을 입력해주세요.")
      return
    }
    if(confirm(
`충전 포인트: ${chargePointAmount}p
충전 금액: ${chargePointAmount}원
입금자 명: ${depositor}
충전 후 포인트: ${chargetPointAmountHelperText}p

입력한 입금자 명와 동일하게 입금해주시기 바랍니다.
영업일 기준 1~3일 이내 소요됩니다.`
    )){
      setIsLoading(true)
      const batch = db.batch()
      const YYYYMM = getYYYYMM()
      batch.set(db.collection("super_admin").doc("document").collection("point").doc(),{
        teamId: team.teamId,
        teamName: team.teamName,
        ...{chargePointAmount, depositor},
        createdAt: new Date(),
      })

      await batch.commit()
      alert("충전 신청이 완료되었습니다. 영업일 기준 1~3일 이내 소요됩니다.")
      setIsLoading(false)
    }
  }
  

  return(
    <div className={styles.main_container}>
      <h1>한다 포인트 충전</h1>
      <h2>잔여 포인트 <strong>{remainPoints}p</strong></h2>
      <TextField
        label="충전할 포인트를 입력해주세요."
        margin="dense"
        size="small"
        fullWidth
        value={chargePointAmount}
        onChange={onChargePointAmountChange}
        helperText={`충전 후 포인트: ${chargetPointAmountHelperText}p`}
        sx={{mt:"17px"}}
      />
      <TextField
        label="충전 금액 (원)"
        value={`${chargePointAmount}원`}
        margin="dense"
        size="small"
        fullWidth
        sx={{mt:"12px"}}
      />
      <TextField
        label="입금자 명"
        value={depositor}
        onChange={(e) => setDepositor(e.target.value)}
        margin="dense"
        size="small"
        fullWidth
        sx={{mt:"12px"}}
      />
      <p>입금 계좌: 국민 1234-1234-1234 더한다</p>

      <Button
        margin="dense"
        size="small"
        fullWidth
        variant="contained"
        sx={{mt:"20px"}}
        onClick={onSubmitClick}
        disabled={isLoading}
      >
        {isLoading ? "신청 중" : "충전신청"}
      </Button>
    </div>
  )
}

export default ChargeDialog