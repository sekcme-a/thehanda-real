import { useEffect, useState } from "react";
import useUserData from "context/userData";
import useData from "context/data";
import { useRouter } from "next/router";
import { Card, CircularProgress, Grid } from "@mui/material";
import CardStatsCharacter from "src/dashboard/CardStatsCharacter";

import { firestore as db } from "firebase/firebase";
import CrmTransactions from "src/dashboard/CrmTransactions";
import EcommerceCongratulations from "src/dashboard/EcommerceCongratulations";
import CardStatsSmall from "src/dashboard/CardStatsSmall";

import PointHistory from "src/dashboard/PointHistory"
import AdminNotification from "src/public/components/layout/notification/AdminNotification";

const Dashboard = () => {
  const {user, userData} = useUserData
  const {team, userList, fetch_userList} = useData()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)

  const [adminUsers, setAdminUsers] = useState(0)

  const [programCount, setProgramCount] = useState({
    all: 0,
    isWaitingForConfirm: 0,
    isMain: 0,
  })

  const [remainPoints, setRemainPoints] = useState(0)

  useEffect(()=> {
    const fetchData = async () => {
      //유저 수
      await fetch_userList(team.teamId, false)

      //팀원 수
      const doc = await db.collection("team").doc(team.teamId).get()
      if(doc.exists && doc.data().adminUsers){
        setAdminUsers(doc.data().adminUsers.length)
      } 


      //프로그램 썸네일
      const programQuery = await db.collection("team").doc(team.teamId).collection(`programs_thumbnail`).get()
      if(!programQuery.empty){
        let all = 0
        let isWaitingForConfirm=0
        let isMain = 0
        programQuery.docs.map((doc) => {
          all++
          if(doc.data().condition === "waitingForConfirm") isWaitingForConfirm++
          if(doc.data().isMain && doc.data().condition==="confirm") isMain++
        })
        setProgramCount({
          all: all,
          isMain: isMain,
          isWaitingForConfirm: isWaitingForConfirm
        })
      }


      //잔여 포인트
      const pointDoc = await db.collection("team_admin").doc(team.teamId).collection("points").doc("data").get()
      if(pointDoc.exists)
        setRemainPoints(pointDoc.data().remainPoint)

      setIsLoading(false)
    }

    if(team && team.teamId)
      fetchData()
  },[team])

  
  if(isLoading) return( <CircularProgress />)

  return(
    <>
       {/* <AdminNotification /> */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3} sx={{ pt: theme => `${theme.spacing(6.25)} !important` }}>
          <CardStatsCharacter 
            data={{
              stats: `총 ${userList.length}명`,
              title: "이용자 수",
              url: "/user/userList",
              src:"/images/pose_f9.png"
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ pt: theme => `${theme.spacing(6.25)} !important` }}>
          <CardStatsCharacter 
            data={{
              stats: `총 ${adminUsers}명`,
              title: "팀원 수",
              url:"/team/manageTeam",
              src:"/images/pose_m18.png"
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          
        </Grid>

        
        <Grid item xs={12} md={6} sx={{ order: 0, alignSelf: 'flex-end' }}>
          <EcommerceCongratulations remainPoints={remainPoints}/>
        </Grid>

        <Grid item xs={12} md={6}>
          <CrmTransactions 
            data={[
              {title:"게재중인 메인프로그램 수", stats: `총 ${programCount.isMain}개`},
              {title:"승인대기 프로그램 수", stats:`총 ${programCount.isWaitingForConfirm}개` },
              {title:'전체 프로그램 수', stats: `총 ${programCount.all}개`}
            ]}
          />
        </Grid>

        {/* <Grid item xs={12} sm={6} md={2} sx={{ order: 0 }}>
          <CardStatsSmall
            stats='1.2k'
            color='info'
            trendNumber='+38%'
            title='Transactions'
            subtitle='Daily Transactions'
            // icon={<Icon icon='mdi:trending-up' />}
          />
        </Grid> */}


        <Grid item xs={12} >
          <PointHistory />
        </Grid>

      </Grid>


      {/* 썸네일 useData로 뽑아서 사용하게 바꿔야됨 */}

      {/* transactions 게재중 프로그램 / 미게제 프로그램  / 전체프로그램 수 */}

      {/* Activity Timeline (나중) */}
      {/* 대신에 프로그램 수 / 설문조사 수 / 공지사항 수 */}

      {/* 국적 */}

      {/* 포인트 */}
    
    </>
  )
}

export default Dashboard