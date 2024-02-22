
import { useState } from "react"
import CSVTable from "src/public/components/CSVTable"

import styles from "src/point/point.module.css"
import { useEffect } from "react"

import { firestore as db } from "firebase/firebase"
import useData from "context/data"
import { getYYYYMM, getYYYYMMList, getYYYYMMWithSlash } from "src/public/hooks/getDate"
import { useRouter } from "next/router"
import { Button, Grid, TextField } from "@mui/material"
import EcommerceCongratulations from "src/dashboard/EcommerceCongratulations"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const Point = () => {
  const router = useRouter()
  const [list, setList] = useState([])
  const [YYYYMMWithSlash, setYYYYMMWithSlash] = useState("")

  const [remainPoints, setRemainPoints] = useState(0)

  const [sortStartDate, setSortStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [sortEndDate, setSortEndDate] = useState(new Date())

  const {team} = useData()

  const HEADERS = [
    {key:"title", label:"알림제목"},
    {key:"author", label:"사용자"},
    {key:"date", label:"사용일"},
    {key:"point", label:"포인트"},
    {key:"remainPoint", label:"잔여 포인트"}
  ]

  useEffect(()=> {
    const fetchData = async () => {
      const YYYYMM = getYYYYMM()
      setYYYYMMWithSlash(getYYYYMMWithSlash())
      const remainPointDoc = await db.collection("team_admin").doc(team.teamId).collection("points").doc("data").get()
      if(remainPointDoc.exists)
        setRemainPoints(remainPointDoc.data().remainPoint)

      // const pointDoc = await db.collection("team_admin").doc(team.teamId).collection("points").doc(YYYYMM).get()
      // if(pointDoc.exists){
      //   const tempList = pointDoc.data().history.map((item) => {
      //     return {...item, date: item.date.toDate().toLocaleString('ko-kr')}
      //   })
      //   setList(tempList)
      //   console.log(tempList)
      // }
      onDateSearchClick()
    }

    fetchData()
  },[])


  const onDateSearchClick = async () => {
    const YYYYMMList = getYYYYMMList(sortStartDate, sortEndDate)
    console.log(YYYYMMList)
    let historyList = []
    await Promise.all(YYYYMMList.map(async (YYYYMM) => {
      const historyDoc = await db.collection("team_admin").doc(team.teamId).collection("points").doc(YYYYMM.toString()).get();
    
      if (historyDoc.exists) {
        const tempList = historyDoc.data().history.map((item) => {
          historyList.push({ ...item, date: item.date.toDate().toLocaleString('ko-kr'), timeStamp: item.date.toDate() })
        });
    
        // return [...tempList];  // Return the tempList if historyDoc exists
      }
      console.log(historyList)
    }));

    let endDate = sortEndDate
    endDate.setHours(23)
    endDate.setMinutes(59)
    endDate.setSeconds(59)
    const sortedList = historyList.map((item) => {
      if(item.timeStamp>=sortStartDate && item.timeStamp <= endDate) return item
    }).filter(Boolean)
    setList(sortedList)
  }

  return(
    <>
      <Grid item xs={12} md={12} sx={{ order: 0, alignSelf: 'flex-end',mb:"20px" }}>
        <EcommerceCongratulations remainPoints={remainPoints}/>
      </Grid>

      <div  className={styles.main_container}>

        <div className={styles.date_container}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="검색 기간"
              value={sortStartDate}
              onChange={(e)=>setSortStartDate(e)}
              renderInput={params => <TextField {...params} variant="standard" style={{marginTop:"5px"}}/>}
            />
          </LocalizationProvider>
          <h3>~</h3>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label=" "
              value={sortEndDate}
              onChange={(e)=>setSortEndDate(e)}
              renderInput={params => <TextField {...params} variant="standard" style={{marginTop:"5px"}}/>}
            />
          </LocalizationProvider>
          <Button
            size="small"
            variant="contained"
            sx={{ml:"15px", mt:"15px"}}
            onClick={onDateSearchClick}
          >
            검색
          </Button>
        </div>
        
        <CSVTable
          title={`${YYYYMMWithSlash} 포인트 사용 현황`}
          headers={HEADERS}
          data={list}
          style={{width:"50%"}}
          onItemClick={()=>{}}
        />
      </div>
      
    </>
  )
}

export default Point