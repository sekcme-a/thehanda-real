import { useEffect, useState } from "react";
import styles from "./Navbar.module.css"
import Image from "next/image";
import { useRouter } from "next/router";
import useData from "context/data";
import { firestore as db } from "firebase/firebase";

import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import GroupIcon from '@mui/icons-material/Group';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import EditNotificationsIcon from '@mui/icons-material/EditNotifications';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import BackupTableOutlinedIcon from '@mui/icons-material/BackupTableOutlined';
import SnippetFolderOutlinedIcon from '@mui/icons-material/SnippetFolderOutlined';
import RuleRoundedIcon from '@mui/icons-material/RuleRounded';
import EditNotificationsOutlinedIcon from '@mui/icons-material/EditNotificationsOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { CircularProgress } from "@mui/material";
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import EditIcon from '@mui/icons-material/Edit';
import AutoAwesomeMotionOutlinedIcon from '@mui/icons-material/AutoAwesomeMotionOutlined';
import CurrencyRubleIcon from '@mui/icons-material/CurrencyRuble';
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';

const Navbar = () => {
  const router = useRouter()
  const {id} = router.query
  const {team, fetch_team} = useData()
  const [isLoading, setIsLoading] = useState(true)

  const [openedItem, setOpenedItem] = useState(-1)


  useEffect(()=>{
    const fetch_data = async () => {
      if(!team)
        await fetch_team(id)
      setIsLoading(false)
    }
    fetch_data()
  },[])

  const handleItemClick = id => {
    if(openedItem===id)
      setOpenedItem(-1)
    else
      setOpenedItem(id)
  }

  const uppercase = (text) => {
    return text?.charAt(0).toUpperCase() + text?.slice(1)
  }

  const onClick = (loc) => {
    router.push(`/${team.teamId}/${loc}`)
  }

  return (
    <div className={styles.main_container}>
      <div className={styles.header}>
        {isLoading ? <CircularProgress /> : team &&
          <>
            <Image src={team.profile} width={45} height={45} alt="logo" />
            <div style={{marginLeft: "20px"}}>
              <h1>Admin Team </h1>
              <h2>{uppercase(team?.teamName)}</h2>
            </div>
          </>
        }
      </div>
   <List
      sx={{ width: '100%', maxWidth: 300, bgcolor: "rgba(255, 255, 255, 0.87)" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
        <ListItemButton onClick={()=>onClick("dashboard")}>
          <ListItemIcon>
            <DashboardRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="대쉬보드" />
        </ListItemButton>

        <ListItemButton onClick={()=>onClick("point")}>
          <ListItemIcon>
            <CurrencyRubleIcon />
          </ListItemIcon>
          <ListItemText primary="한다 포인트" />
        </ListItemButton>

      <ListItemButton onClick={()=>handleItemClick(1)}>
        <ListItemIcon>
          <GroupIcon />
        </ListItemIcon>
        <ListItemText primary="팀 관리" />
        {openedItem===1? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={openedItem===1} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }} onClick={()=>onClick("team/teamProfile")}>
            <ListItemIcon>
              <AccountBoxOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="팀 프로필" />
          </ListItemButton>
        </List>


        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }} onClick={()=>onClick("team/manageTeam")}>
            <ListItemIcon>
              <Diversity3Icon />
            </ListItemIcon>
            <ListItemText primary="구성원 관리" />
          </ListItemButton>
        </List>

      </Collapse>


      <ListItemButton onClick={()=>handleItemClick(0)}>
        <ListItemIcon>
          <PersonOutlineIcon />
        </ListItemIcon>
        <ListItemText primary="사용자 관리" />
        {openedItem===0? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={openedItem===0} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }} onClick={()=>onClick("user/userList")}>
            <ListItemIcon>
              <BallotOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="사용자 목록" />
          </ListItemButton>
        </List>


        {/* <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }} onClick={()=>onClick("user/category")}>
            <ListItemIcon>
              <CategoryOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="그룹 관리" />
          </ListItemButton>
        </List> */}

      </Collapse>



      <ListItemButton onClick={()=>handleItemClick(2)}>
        <ListItemIcon>
          <PostAddOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="게시물 관리" />
        {openedItem===2 ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openedItem===2} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={()=>onClick("post/programs")}>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText primary="프로그램 관리" />
            </ListItemButton>
          </List>


          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={()=>onClick("post/surveys")}>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText primary="설문조사 관리" />
            </ListItemButton>
          </List>

          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={()=>onClick("post/announcements")}>
              <ListItemIcon>
                <CampaignOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="공지사항 관리" />
            </ListItemButton>
          </List>

        </Collapse>











        <ListItemButton onClick={()=>handleItemClick(3)}>
        <ListItemIcon>
          <AutoAwesomeMotionOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="유형 관리" />
        {openedItem===3 ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openedItem===3} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={()=>onClick("section/programs")}>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText primary="프로그램 유형" />
            </ListItemButton>
          </List>


          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={()=>onClick("section/surveys")}>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText primary="설문조사 유형" />
            </ListItemButton>
          </List>

          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={()=>onClick("section/announcements")}>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText primary="공지사항 유형" />
            </ListItemButton>
          </List>

        </Collapse>












        <ListItemButton onClick={()=>onClick("chat")}>
          <ListItemIcon>
            <ChatOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="한다챗" />
        </ListItemButton>


        <ListItemButton onClick={()=>onClick("contact")}>
          <ListItemIcon>
            <HelpOutlineIcon />
          </ListItemIcon>
          <ListItemText primary="센터문의 관리" />
        </ListItemButton>
    </List>
    </div>
  )
}

export default Navbar