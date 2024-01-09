// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { useEffect } from 'react'

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

const EcommerceCongratulations = ({remainPoints}) => {

  return (
    <Card sx={{ position: 'relative', overflow: 'visible', mt: { xs: 0, sm: 7.5, md: 0 } }}>
      <CardContent sx={{ p: theme => `${theme.spacing(4.25, 4.5, 2.25, 4.5)} !important` }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant='h5' sx={{ mb: 1.5 }}>
              한다 Point
            </Typography>
            <Typography variant='h5' sx={{ mb: 3.5 }}>
              잔여 포인트: {remainPoints}p
            </Typography>
            <Typography variant='body2'>포인트를 통해 사용자들에게 알림을 보내실 수 있습니다.</Typography>
            <Typography variant='body2'>해당 알림은 알림을 꺼놓은 상대에게는 보내지지 않으며, 포인트가 차감되지 않습니다.</Typography>
          </Grid>
          <StyledGrid item xs={12} sm={6}>
            <Img alt='Congratulations John' src='/images/illustration-john-2.png' />
          </StyledGrid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default EcommerceCongratulations
