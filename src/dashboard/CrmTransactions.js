// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import useData from 'context/data'

// ** Icon Imports
// import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
// import OptionsMenu from 'src/@core/components/option-menu'
// import CustomAvatar from 'src/@core/components/mui/avatar'

const salesData = [
  {
    stats: '245k',
    title: 'Sales',
    color: 'primary',
    icon: 'mdi:trending-up'
  },
  {
    stats: '12.5k',
    color: 'success',
    title: 'Customers',
    icon: 'mdi:account-outline'
  },
  {
    stats: '1.54k',
    color: 'warning',
    title: 'Products',
    icon: 'mdi:cellphone-link'
  }
]

const renderStats = ({data}) => {


  return data.map((item, index) => (
    <Grid item xs={12} sm={4} key={index}>
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        {/* <CustomAvatar variant='rounded' color={item.color} sx={{ mr: 3, boxShadow: 3, width: 44, height: 44 }}> */}
          {/* <Icon icon={item.icon} fontSize='1.75rem' /> */}
        {/* </CustomAvatar> */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='caption'>{item.title}</Typography>
          <Typography variant='h6'>{item.stats}</Typography>
        </Box>
      </Box>
    </Grid>
  ))
}

const CrmTransactions = ({data}) => {
  const {team} = useData()
  return (
    <Card style={{height:"100%"}}>
      <CardHeader
        title='프로그램'
        // action={
        //   <OptionsMenu
        //     options={['Refresh', 'Share', 'Update']}
        //     iconButtonProps={{ size: 'small', className: 'card-more-options', sx: { color: 'text.secondary' } }}
        //   />
        // }
        subheader={
          <Typography variant='body1'>
            {team.teamName}의 프로그램 현황입니다.
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            mb: 1,
            lineHeight: '2rem !important',
            letterSpacing: '0.15px !important'
          }
        }}
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(0.8)} !important` }}>
        <Grid container spacing={[5, 0]}>

        {data.map((item, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
              {/* <CustomAvatar variant='rounded' color={item.color} sx={{ mr: 3, boxShadow: 3, width: 44, height: 44 }}> */}
                {/* <Icon icon={item.icon} fontSize='1.75rem' /> */}
              {/* </CustomAvatar> */}
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='caption' style={{fontSize:"14px"}}>{item.title}</Typography>
                <Typography variant='h6'>{item.stats}</Typography>
              </Box>
            </Box>
          </Grid>
        ))
        }
        </Grid>
      </CardContent>
    </Card>
  )
}

export default CrmTransactions
