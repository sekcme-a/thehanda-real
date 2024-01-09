// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import AvatarGroup from '@mui/material/AvatarGroup'
import CardContent from '@mui/material/CardContent'
import Dialog from '@mui/material/Dialog'

// import DialogEditUser from "./DialogEditUser"

import useData from 'context/data'
import { HumanMaleBoardPoll } from 'mdi-material-ui'

const ControlTeamUser = (props) => {
  const [cardData, setCardData] = useState([])
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState("")
  const handleOpen = () => {setOpen(true)}
  const handleClose = () => {setOpen(false)}
  const {userData} = useData()

  useEffect(() => {
    setCardData(props.cardData)
  }, [props.cardData])
  
  const onAddUserClick = () => {
    handleOpen()
    setMode("add")
  }
  const onDeleteUserClick = () => {
    handleOpen()
    setMode("delete")
  }
  const onSuperClick = () => {
    handleOpen()
    setMode("super")
  }
  const onHighClick = () => {
    handleOpen()
    setMode("high")
  }
  const onCommonClick = () => {
    handleOpen()
    setMode("common")
  }

  const renderCards = () =>
    cardData.map((item, index) => (
      <Grid item xs={12} sm={6} lg={6} key={index}>
        <Card>
          <CardContent>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant='body2'>Total {item.totalUsers} users</Typography>
              <AvatarGroup
                max={4}
                sx={{
                  '& .MuiAvatarGroup-avatar': { fontSize: '.875rem' },
                  '& .MuiAvatar-root, & .MuiAvatarGroup-avatar': { width: 32, height: 32 },
                }}
              >
                {item.avatars.map((img, index) => (
                  <Avatar key={index} alt={item.title} src={`${img}`} />
                ))}
              </AvatarGroup>
            </Box>
            <Box>
              <Typography variant='h6'>{item.title}</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ))
  if(userData?.roles[1]==="super" || userData?.roles[1]==="high")
    return (
      <>
        <Grid container spacing={3} className='match-height'>
          {renderCards()}
          <Grid item xs={14} sm={6} lg={6}>
            <Card
              sx={{ cursor: 'pointer', height: "125px" }}
              onClick={() => {
                onAddUserClick()
              }}
            >
              <Grid container sx={{ height: '100%' }}>
                <Grid item xs={5}>
                  <Box sx={{ height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <img width={65} height={120} alt='add-role' src='/john_standing.png' />
                  </Box>
                </Grid>
                <Grid item xs={7}>
                  <CardContent>
                    <Box sx={{ textAlign: 'right' }}>
                      <Button
                        variant='contained'
                        sx={{ mb: 1, whiteSpace: 'nowrap' }}
                        onClick={() => {
                          onAddUserClick()
                        }}
                      >
                        구성원 추가
                      </Button>
                      <Typography style={{wordBreak: "keep-all"}}>코드를 통해 구성원을 추가하세요!</Typography>
                    </Box>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          </Grid>


          <Grid item xs={14} sm={6} lg={6}>
            <Card
              sx={{ cursor: 'pointer', height: "125px" }}
              onClick={() => {
                onDeleteUserClick()
              }}
            >
              <Grid container sx={{ height: '100%' }}>
                <Grid item xs={5}>
                  <Box sx={{ height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <img width={65} height={120} alt='add-role' src='/david_standing.png' />
                  </Box>
                </Grid>
                <Grid item xs={7}>
                  <CardContent>
                    <Box sx={{ textAlign: 'right' }}>
                      <Button
                        variant='contained'
                        sx={{ mb: 1, whiteSpace: 'nowrap', backgroundColor:'orangeRed' }}
                        onClick={() => {
                          onDeleteUserClick()
                        }}
                      >
                        구성원 삭제
                      </Button>
                      <Typography style={{wordBreak: "keep-all"}}>코드를 통해 구성원을 삭제하세요!</Typography>
                    </Box>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          </Grid>


        </Grid>


        {/* <Dialog open={open} onClose={handleClose} maxWidth="lg">
          <DialogEditUser mode={mode} />
        </Dialog> */}
      </>
    )

    
  
  return (
      <>
        <Grid container spacing={3} className='match-height'>
          {renderCards()}
        </Grid>
      </>
  )
}
export default ControlTeamUser;