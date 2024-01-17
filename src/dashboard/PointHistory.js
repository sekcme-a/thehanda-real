
import { useState } from "react"
import CSVTable from "src/public/components/CSVTable"

import styles from "./PointHistory.module.css"
import { useEffect } from "react"

import { firestore as db } from "firebase/firebase"
import useData from "context/data"
import { getYYYYMM, getYYYYMMWithSlash } from "src/public/hooks/getDate"
import { useRouter } from "next/router"

const PointHistory = () => {
  const router = useRouter()
  const [list, setList] = useState([])
  const [YYYYMMWithSlash, setYYYYMMWithSlash] = useState("")

  const {team} = useData()

  const HEADERS = [
    {key:"title", label:"알림제목"},
    {key:"author", label:"사용자"},
    {key:"date", label:"사용일"},
    {key:"point", label:"포인트"},
    {key:"remainPoint", label:"남은 포인트"}
  ]

  useEffect(()=> {
    const fetchData = async () => {
      const YYYYMM = getYYYYMM()
      setYYYYMMWithSlash(getYYYYMMWithSlash())
      const pointDoc = await db.collection("team_admin").doc(team.teamId).collection("points").doc(YYYYMM).get()
      if(pointDoc.exists){
        const tempList = pointDoc.data().history.map((item) => {
          return {...item, date: item.date.toDate().toLocaleString('ko-kr')}
        })
        setList(tempList)
      }
    }

    fetchData()
  },[])

  return(
    <div  className={styles.main_container}>
      <p>{`이번달 포인트 사용 현황 (${YYYYMMWithSlash})`} <strong onClick={()=>router.push(`/${team.teamId}/points`)}>자세히 보기</strong></p>
      <CSVTable
        title={`${YYYYMMWithSlash} 포인트 사용 현황`}
        headers={HEADERS}
        data={list}
        style={{width:"50%"}}
        onItemClick={()=>{}}
      />
      
    </div>
  )
}

export default PointHistory