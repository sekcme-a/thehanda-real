import { useEffect, useState } from "react"
import styles from "src/team/manageTeam/manageTeam.module.css"
import { useRouter } from "next/router"
import useUserData from "context/userData"

import LoaderGif from "src/public/components/LoaderGif"
// import PageHeader from "src/public/components/PageHeader"
import ControlTeamUser from "src/team/manageTeam/ControlTeamUser"
import CountCard from "src/team/manageTeam/CountCard"
import UserList from "src/team/manageTeam/UserList"
import AppliedList from "src/team/manageTeam/AppliedList"
import {FUNCTION} from "src/team/manageTeam/manageTeamFunction"
import PageHeader from "src/public/components/PageHeader"

import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import { Button, Grid, Dialog } from "@mui/material"

const ManageTeam = () => {
  const router = useRouter()
  const {id} = router.query
  const {userData} = useUserData()
  const [totalUser, setTotalUser] = useState({ totalUser: 0, title: "팀 구성원", avatars:['/default_avatar.png','/default_avatar.png','/default_avatar.png','/default_avatar.png']})
  const [appliedUser, setAppliedUser] = useState({ totalUser: 0, title: "권한 신청인", avatars:['/default_avatar.png','/default_avatar.png','/default_avatar.png','/default_avatar.png']})

  const [listData, setListData] = useState([
      //{ imgUrl: '/default_avatar.png', phoneNumber:"010-1243-1243", id: "1", roles:"Super",},
  ])



  const [appliedList, setAppliedList] = useState([])
  const [isLoading, setIsLoading] = useState(true)  
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [uidList, setUidList ] = useState([])
  
  const columns = [
  {
    flex: 0.09,
    minWidth: 180,
    field: 'fullName',
    headerName: '이름',
    renderCell: ({ row }) => {
      const { photoUrl, name } = row
      return (
        <div className={styles.user_container}>
          <Avatar src={photoUrl} />
          <p>{name}</p>
        </div>
      )
    }
  },
  {
    flex: 0.18,
    minWidth:170,
    field: 'phoneNumber',
    headerName: '연락처',
    renderCell: ({ row }) => {
      return (
        <Typography variant='body2' noWrap>
          {row.phoneNumber ? row.phoneNumber : "-"}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 100,
    headerName: '권한',
    field: 'roles',
    renderCell: ({ row }) => {
      let roleName = "Normal"
      if(row.roles.includes(`${id}_super_admin`)) roleName="Super"
      else if(row.roles.includes(`${id}_high_admin`)) roleName="High"

      return (
        <Typography noWrap sx={{ textTransform: 'capitalize' }}>
          {roleName}
        </Typography>
      )
    }
  },
  {
    flex: 0.25,
    minWidth:100,
    headerName: '관리',
    renderCell: ({row}) => {
      return(
        <>
          <Button
            variant="contained"
            onClick={()=>onCancelAuthorityClick(row.id)}
            size="small"
            disabled={!(userData?.roles?.includes("super_admin")||userData?.roles?.includes(`${id}_super_admin`))}
          >
            권한해제
          </Button>
            <Button
              variant="contained"
              onClick={()=>onLvUpClick(row)}
              sx={{ml:"10px"}}
              color="success"
              size="small"
              disabled={row.roles.includes(`${id}_super_admin`)||(!userData?.roles.includes("super_admin")&&(userData?.roles.includes(`${id}_high_admin`)||userData?.roles.includes(`${id}_admin`)))}
            >
              승 격
            </Button>
            <Button
              variant="contained"
              onClick={()=>onLvDownClick(row)}
              sx={{ml:"10px"}}
              color="error"
              size="small"
              disabled={row.roles.includes(`${id}_admin`)||(!userData?.roles.includes("super_admin")&&(userData?.roles.includes(`${id}_high_admin`)||userData?.roles.includes(`${id}_admin`)))}
            >
              강 등
            </Button>
        </>
      )
    }
  }
  ]

  //권한해제 클릭
  const onCancelAuthorityClick = async (uid) => {
    await FUNCTION.cancel_authority(id, uid)
    alert("권한해제되었습니다.")
    router.reload()
  }

  //승격 클릭
  const onLvUpClick = async (userData) => {
    await FUNCTION.level_up_authority(id, userData)
    const user_list = await FUNCTION.fetch_user_data_from_uid_list(uidList)
    setListData(user_list)
    alert("승격되었습니다.")
  }

  //강등 클릭
  const onLvDownClick = async (userData) => {
    await FUNCTION.level_down_authority(id, userData)
    const user_list = await FUNCTION.fetch_user_data_from_uid_list(uidList)
    setListData(user_list)
    alert("강등되었습니다.")
  }

  useEffect(() => {
    const fetchData = async () => {
      const uid_list = await FUNCTION.fetch_admin_user_list(id)
      setUidList(uid_list)
      if(uid_list){
        const user_list = await FUNCTION.fetch_user_data_from_uid_list(uid_list)
        setListData(user_list)
        const avatars = []
        user_list.forEach((user) => avatars.push(user.photoUrl))
        setTotalUser({totalUsers: user_list.length, title: "팀 구성원", avatars:avatars})
      }


      const applied_uid_list = await FUNCTION.applied_uid_list(id)
      if(applied_uid_list){
        const applied_user_list = await FUNCTION.fetch_user_data_from_uid_list(applied_uid_list)
        setAppliedList(applied_user_list)
        const appliedAvatars = []
        applied_user_list.forEach((user) => appliedAvatars.push(user.photoUrl))
        setAppliedUser({totalUsers: applied_uid_list.length, title: "권한 신청인", avatars: appliedAvatars})
      }
      setIsLoading(false)
    }
    fetchData()
  },[])

  //dialog 를 통해 appliedList 가 바뀌면 AppliedUser 도 바꿔줘야함.
  useEffect(()=>{
    if(appliedList){
      const appliedAvatars = []
      appliedList.forEach((user) => appliedAvatars.push(user.photoUrl))
      setAppliedUser({totalUsers: appliedList.length, title: "권한 신청인", avatars: appliedAvatars})
    }
  },[appliedList])

  const onAppliedButtonClick = () => {
    setIsDialogOpen(true)
  }
  const generateButton =()=>{return(
    <Button
      variant="contained"
      onClick={onAppliedButtonClick}
      size="small"
    >
      신청 목록
    </Button>
  )}

  if(isLoading) return <LoaderGif mode="background"/>
  
  return (
    <div>
      <PageHeader title="팀 구성원 현황" subtitle="코드를 통해 팀 구성원을 쉽게 관리하세요."/>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6} >
          <CountCard cardData={totalUser}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <CountCard cardData={appliedUser} button={generateButton}/>
        </Grid>
      </Grid>

      <PageHeader title="팀 구성원 목록" subtitle={`팀의 모든 구성원 목록입니다, 변경사항은 새로고침 시 표시됩니다.`} mt="40px" />
      <UserList data={listData} columns={columns} />

      <Dialog
        onClose={()=>setIsDialogOpen(false)}
        open={isDialogOpen}
      >
        <AppliedList {...{appliedList, setAppliedList}} />
      </Dialog>
    </div>
  )
}
export default ManageTeam;