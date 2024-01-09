// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import InputAdornment from '@mui/material/InputAdornment'
import LinearProgress from '@mui/material/LinearProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import DialogContentText from '@mui/material/DialogContentText'
import Avatar from "@mui/material/Avatar"
import DoneAllIcon from '@mui/icons-material/DoneAll';

// ** Icons Imports
import Check from 'mdi-material-ui/Check'
import Circle from 'mdi-material-ui/Circle'
import BriefcaseVariantOutline from 'mdi-material-ui/BriefcaseVariantOutline'



// ** Styled <sup> component
const Sup = styled('sup')(({ theme }) => ({
  top: '0.2rem',
  left: '-0.6rem',
  position: 'absolute',
  color: theme.palette.primary.main
}))

// ** Styled <sub> component
const Sub = styled('sub')({
  fontWeight: 300,
  fontSize: '1rem',
  alignSelf: 'flex-end'
})

const roleColors = {
  admin: 'error',
  editor: 'info',
  author: 'warning',
  maintainer: 'success',
  subscriber: 'primary'
}

const statusColors = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

const UserViewLeft = ({ data }) => {
  // ** States
  const [openEdit, setOpenEdit] = useState(false)
  const [openPlans, setOpenPlans] = useState(false)

  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true)
  const handleEditClose = () => setOpenEdit(false)

  // Handle Upgrade Plan dialog
  const handlePlansClickOpen = () => setOpenPlans(true)
  const handlePlansClose = () => setOpenPlans(false)

  const renderUserAvatar = () => {
    if (data) {
      if (data.basicProfile.photoUrl) {
        return (
          <Avatar src={data.basicProfile.photoUrl} sx={{ width: 200, height: 200 }} variant="rounded"/>
        )
      } else {
        return (
          <Avatar src={data.basicProfile.photoUrl} sx={{ width: 120, height: 120 }} variant="rounded"/>
        )
      }
    } else {
      return null
    }
  }
  if (data) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ pt: 2, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              {renderUserAvatar()}
              <Typography variant='h6' sx={{ mt: 2 ,}} textTransform="capitalize">
                {data.basicProfile.displayName}
              </Typography>
            </CardContent>

            <CardContent sx={{pt:0}}>
              <Typography variant='h6'>Details</Typography>
              <Divider />
              <Box sx={{ pt: 2, pb: 2 }}>
                <Box sx={{ display: 'flex', mb: 1.5, alignItems:"center" }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '1rem' }}>닉네임:</Typography>
                  <Typography variant='body5'>{data.basicProfile.displayName}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 1.5, alignItems:"center" }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '1rem' }}>실명:</Typography>
                  <Typography variant='body5'>{data.basicProfile.realName}</Typography>
                </Box>
                <Box sx={{  mb: 1.5, alignItems:"center", display:'flex' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '1rem' }}>전화번호:</Typography>
                  <Typography variant='body5' >
                    {data.basicProfile.phoneNumber || "-"}
                  </Typography>
                  {/* <Typography variant='body4' sx={{ textTransform: 'capitalize' }}>
                    <div style={{display: "flex", alignItems:"center"}}>
                      {data.basicProfile.phoneNumber}
                      {data.basicProfile.phoneVerified===true && 
                        <>
                          <DoneAllIcon fontSize="24px" style={{marginLeft: "5px", color: "rgb(42, 42, 231)"}}/>
                          <p style={{color: "rgb(42, 42, 231)", fontSize:"12px"}}>인증됨</p>
                        </>
                      }
                    </div>
                  </Typography> */}
                </Box>
                

                <Box sx={{ display: 'flex', mb: 1.5, alignItems:"center" }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '1rem' }}>국적:</Typography>
                  <Typography variant='body5'>{data.basicProfile.country.flag} {data.basicProfile.country.text}</Typography>
                </Box>

                <Box sx={{ display: 'flex', mb: 1.5, alignItems:"center" }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '1rem' }}>성별:</Typography>
                  <Typography variant='body5'>{data.basicProfile.gender==="male" ? "남" : data.basicProfile.gender==="female" ? "여" : "기타"}</Typography>
                </Box>

                <Box sx={{ display: 'flex', mb: 1.5, alignItems:"center" }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '1rem' }}>다문화 여부:</Typography>
                  <Typography variant='body5'>{data.basicProfile.country.isMulticulture ? "예" : "아니요"}</Typography>
                </Box>

                <Box sx={{ display: 'flex', mb: 1.5, alignItems:"center" }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '1rem' }}>생년월일:</Typography>
                  <Typography variant='body5'>{data.basicProfile.birth.toDate().toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </Typography>
                </Box>



                <Box sx={{ display: 'flex', mb: 1.5, alignItems:"center" }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '1rem' }}>이메일:</Typography>
                  <Typography variant='body5'>{data.email || "-"}</Typography>
                </Box>

                <Box sx={{ display: 'flex', mb: 1.5, alignItems:"center" }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '1rem' }}>로그인 경로:</Typography>
                  <Typography variant='body5' >
                    {data.basicProfile.providerId || "이메일"}
                  </Typography>
                </Box>
                <Box sx={{  mb: 1.5, alignItems:"center", display:"flex" }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '1rem' }}>유저 코드:</Typography>
                  <div style={{fontSize:"13px"}}>
                    {data.uid}
                  </div>
                </Box>
 
              </Box>
            </CardContent>

            {/* <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant='contained' sx={{ mr: 3 }} onClick={handleEditClickOpen}>
                Edit
              </Button>
              <Button color='error' variant='outlined'>
                Suspend
              </Button>
            </CardActions> */}

            <Dialog
              open={openEdit}
              onClose={handleEditClose}
              aria-labelledby='user-view-edit'
              sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650, p: [2, 10] } }}
              aria-describedby='user-view-edit-description'
            >
              <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
                Edit User Information
              </DialogTitle>
              <DialogContent>
                <DialogContentText variant='body5' id='user-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
                  Updating user details will receive a privacy audit.
                </DialogContentText>
                <form>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label='Full Name' defaultValue={data.basicProfile.fullName} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label='Username'
                        defaultValue={data.basicProfile.username}
                        InputProps={{ startAdornment: <InputAdornment position='start'>@</InputAdornment> }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth type='email' label='Billing Email' defaultValue={data.basicProfile.email} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id='user-view-status-label'>Status</InputLabel>
                        <Select
                          label='Status'
                          defaultValue={data.basicProfile.status}
                          id='user-view-status'
                          labelId='user-view-status-label'
                        >
                          <MenuItem value='pending'>Pending</MenuItem>
                          <MenuItem value='active'>Active</MenuItem>
                          <MenuItem value='inactive'>Inactive</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label='TAX ID' defaultValue='Tax-8894' />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label='Contact' defaultValue={`+1 ${data.basicProfile.contact}`} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id='user-view-language-label'>Language</InputLabel>
                        <Select
                          label='Language'
                          defaultValue='English'
                          id='user-view-language'
                          labelId='user-view-language-label'
                        >
                          <MenuItem value='English'>English</MenuItem>
                          <MenuItem value='Spanish'>Spanish</MenuItem>
                          <MenuItem value='Portuguese'>Portuguese</MenuItem>
                          <MenuItem value='Russian'>Russian</MenuItem>
                          <MenuItem value='French'>French</MenuItem>
                          <MenuItem value='German'>German</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id='user-view-country-label'>Country</InputLabel>
                        <Select
                          label='Country'
                          defaultValue='USA'
                          id='user-view-country'
                          labelId='user-view-country-label'
                        >
                          <MenuItem value='USA'>USA</MenuItem>
                          <MenuItem value='UK'>UK</MenuItem>
                          <MenuItem value='Spain'>Spain</MenuItem>
                          <MenuItem value='Russia'>Russia</MenuItem>
                          <MenuItem value='France'>France</MenuItem>
                          <MenuItem value='Germany'>Germany</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        label='Use as a billing address?'
                        control={<Switch defaultChecked />}
                        sx={{ '& .MuiTypography-root': { fontWeight: 500 } }}
                      />
                    </Grid>
                  </Grid>
                </form>
              </DialogContent>
              <DialogActions sx={{ justifyContent: 'center' }}>
                <Button variant='contained' sx={{ mr: 1 }} onClick={handleEditClose}>
                  Submit
                </Button>
                <Button variant='outlined' color='secondary' onClick={handleEditClose}>
                  Discard
                </Button>
              </DialogActions>
            </Dialog>
          </Card>
        </Grid>

      </Grid>
    )
  } else {
    return null
  }
}

export default UserViewLeft
