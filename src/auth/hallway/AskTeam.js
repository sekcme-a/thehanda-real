import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import styles from "./AskTeam.module.css"
import { firestore as db, auth } from "firebase/firebase"

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import FilledInput from '@mui/material/FilledInput';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';

import useUserData from "context/userData"
import useData from "context/data"
import { CircularProgress } from "@mui/material"
import Image from "next/image"


// Styled Grid component
const StyledGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    order: -1,
    display: 'flex',
    justifyContent: 'center'
  }
}))

// Styled component for the image
const Img = styled('img')(({ theme }) => ({
  right: 13,
  bottom: 0,
  height: 185,
  position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    height: 165,
    position: 'static'
  }
}))



const AskTeam = (props) => {
  const { user, userData } = useUserData()
  const {teamList, fetch_team_list} = useData()
  const router = useRouter()
  const [team, setTeam] = useState("")
  const [isLoading, setIsLoading]= useState(true)

  const [clickCount, setClickCount] = useState(0)
  const handleChange = (event) => {
    setTeam(event.target.value);
  };

  //quick style
  const CARD_WIDTH = 800
  const TITLE_WIDTH = 10
  const TITLE_MARGIN_BOTTOM = 2

  useEffect(() => {
    const fetchData = async () => {
      if(!teamList)
        await fetch_team_list()
      setIsLoading(false)
    }
    fetchData()
  },[])


  const onJoinClick = async () => {
    if (team !== "") {
      router.push(`/${team}/home`)
    }
  }

  const onLogoutClick = () => {
    auth.signOut()
  }

  const handleOnKeyPress = (e) => {
    if (e.key === "Enter") {
      onJoinClick()
    }
  } 

  const onTeamClick = (id) => {
    router.push(`/${id}/dashboard`)
  }


  const onAdminButtonClick = () => {
    setClickCount(prevCount => prevCount+1)
    if(clickCount>=7) router.push("/super_admin/home")
    setTimeout(()=> {
      setClickCount(prevCount=>prevCount-1)
    },3000)
  }

  
  if(userData)
  return (
    <Card sx={{ position: 'relative', overflow: 'visible', mt: { xs: 0, sm: 7.5, md: 0 }, width:`${CARD_WIDTH}px` }}>
      <div style={{display:"flex",  justifyContent:"flex-end", padding:"5px 15px 0 0", zIndex:"999"}}>
        <Button
          variant="text"
          onClick={onLogoutClick}
          sx={{zIndex:"999"}}
        >
          로그아웃
        </Button>
      </div>
      <CardContent sx={{ p: theme => `${theme.spacing(2.25, 7.5, 3.25, 7.5)} !important` }}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={TITLE_WIDTH}>
            <Typography variant='h5' sx={{ mb: TITLE_MARGIN_BOTTOM }}>
              들어갈 팀을 선택해주세요{' '}
              <Box component='span' sx={{ fontWeight: 'bold' }}>
                {userData.name}님
              </Box>
              ! 🎉
            </Typography>
            {isLoading ? <CircularProgress /> : 
              <ul style={{display: "flex", alignItems:"center"}} className={styles.team_list}>
                {teamList?.map((team, index)=> (
                  <li key={index} onClick={()=>onTeamClick(team.id)}>
                    <Image src={team.profile} width={30} height={30} alt="프로필" />
                    <h1>{team.teamName}</h1>
                  </li>
                ))}
              </ul>
            }
            <Typography variant='body2'>어드민 TEAM을 이용해 컨텐츠를 관리하세요.</Typography>
          </Grid>
          <StyledGrid item xs={12} sm={6}>
            <Img alt='Congratulations John' src="/images/illustration_john.png" />
          </StyledGrid>
        </Grid>
      </CardContent>
      <div style={{width:"10px", height:"10px", position:"absolute", right:"-10px", bottom:"-10px"}} onClick={onAdminButtonClick}/>
    </Card>
  )
}

export default AskTeam


