


// ** React Imports
import { useState, useEffect } from 'react'
import { firestore as db } from 'firebase/firebase'
import useData from 'context/data'
// ** MUI Imports
import Box from '@mui/material/Box'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab from '@mui/material/Tab'
import Card from '@mui/material/Card'


import Button from '@mui/material/Button';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';

import AddAlertIcon from '@mui/icons-material/AddAlert';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';

// ** Icons Imports
import AccountOutline from 'mdi-material-ui/AccountOutline'
import TimelineIcon from '@mui/icons-material/Timeline';


import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

import Overview from './screen/Overview'
// import Group from './screen/Group'
import Chat from './screen/Chat'
import Family from './screen/Family'
import Comments from './screen/Comments'
import Memo from './screen/Memo'
import Timeline from './screen/Timeline'
// import Comments from './Comments'
// import Family from "./Family"
// import Memo from "./Memo"
// import ChatView from "./ChatView"
// import AlarmSetting from "./AlarmSetting"
// import Timeline from "./Timeline"

// ** Styled Tab component
const Tab = styled(MuiTab)(({ theme }) => ({
  minHeight: 48,
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(3)
  }
}))

const UserViewRight = ({data, setData}) => {
  const [value, setValue] = useState('overview')
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <TabContext value={value} >
      <TabList
        variant='scrollable'
        scrollButtons='auto'
        onChange={handleChange}
        aria-label='forced scroll tabs example'
      >
        <Tab value='overview' label='Overview' icon={<AccountOutline />} />
        {/* <Tab value='group' label='Group' icon={<CategoryOutlinedIcon />} /> */}
        <Tab value='chat' label="Chat" icon={<ChatOutlinedIcon />} />
        <Tab value='family' label='Family' icon={<FamilyRestroomIcon />} />
        <Tab value='timeline' label='Timeline' icon={<TimelineIcon />} />
        <Tab value='comments' label="Comments" icon={<SummarizeOutlinedIcon />} />
        <Tab value='memo' label="Memo" icon={<DriveFileRenameOutlineIcon />} />
        
        {/* <Tab value='security' label='Security' icon={<LockOutline />} />
        <Tab value='billing-plan' label='Billing & Plan' icon={<BookmarkOutline />} />
        <Tab value='notification' label='Notification' icon={<BellOutline />} />
        <Tab value='connection' label='Connection' icon={<LinkVariant />} /> */}
      </TabList>
      <Box sx={{ mt: 2 }} >
        {/* <TabPanel sx={{ p: 0 }} value='overview' > */}
          <Card style={value!=="overview" ? {display:"none"}: {padding: '30px 20px'}}>
            <Overview data={data} setData={setData}/>
          </Card>
          <Card style={value!=="chat" ? {display:"none"}: {padding: '30px 20px'}}>
            <Chat data={data} />
          </Card>
          <Card style={value!=="family" ? {display:"none"}: {padding: '30px 20px'}}>
            <Family data={data} />
          </Card>
          <Card style={value!=="comments" ? {display:"none"}: {padding: '30px 20px'}}>
            <Comments data={data} />
          </Card>
          <Card style={value!=="memo" ? {display:"none"}: {padding: '30px 20px'}}>
            <Memo data={data} />
          </Card>
          <Card style={value!=="timeline" ? {display:"none"}: {padding: '30px 20px'}}>
            <Timeline data={data} />
          </Card>
        {/* </TabPanel> */}
        {/* <TabPanel sx={{ p: 0 }} value='group' >
          <Card>
            <Group data={data} setData={setData} />
          </Card>
        </TabPanel> */}
        {/* <TabPanel sx={{ p: 0 }} value='chat' >
          <Card>
            <Chat data={data}/>
          </Card>
        </TabPanel> */}
        {/* <TabPanel sx={{ p: 0 }} value='chat'>
          <Card sx={{padding: "10px 20px"}}>
            <ChatView uid={props.uid} teamId={teamId} userName={props.userData.realName} />
          </Card>
        </TabPanel>


        <TabPanel sx={{ p: 0 }} value='timeline'>
          <Card sx={{padding: "10px 20px"}}>
            <Timeline
              timeline={timeline} uid={props.uid} />
          </Card>
        </TabPanel>


        <TabPanel sx={{ p: 0 }} value='family'>
          <Card sx={{padding: "10px 20px"}}>
            <Family uid={props.uid} />
          </Card>
        </TabPanel>


        <TabPanel sx={{ p: 0 }} value='memo'>
          <Card sx={{padding: "10px 20px"}}>
            <Memo memo={memo} uid={props.uid}/>
          </Card>
        </TabPanel>


        <TabPanel sx={{ p: 0 }} value='comments'>
          <Comments uid={props.uid}/>
        </TabPanel> */}

      </Box>
    </TabContext>
  )
}

export default UserViewRight
