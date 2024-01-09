import { useEffect, useState } from "react";
import useUserData from "context/userData"
import { useRouter } from "next/router";

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import AvatarGroup from '@mui/material/AvatarGroup'
import CardContent from '@mui/material/CardContent'

const Home = ({cardData, button}) => {
  const {user, userData} = useUserData
  const router = useRouter()

  useEffect(()=>{

  },[])
  
  return(
    <>
      <Card sx={{height:"120px"}}>
        <CardContent>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant='body2'>Total {cardData.totalUsers} users</Typography>
            <AvatarGroup
              max={4}
              sx={{
                '& .MuiAvatarGroup-avatar': { fontSize: '.875rem' },
                '& .MuiAvatar-root, & .MuiAvatarGroup-avatar': { width: 32, height: 32 },
              }}
            >
              {cardData.avatars.map((img, index) => (
                <Avatar key={index} alt={cardData.title} src={`${img}`} />
              ))}
            </AvatarGroup>
          </Box>
          <Box sx={{display:"flex", justifyContent:"space-between"}}>
            <Typography variant='h6'>{cardData.title}</Typography>
            {button && button()}
          </Box>
        </CardContent>
      </Card>
    </>
  )
}

export default Home