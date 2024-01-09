import { useState, useEffect } from "react";

import { Button, TextField, FormControl, Input, InputAdornment, Dialog, Grid } from "@mui/material"
import styles from "src/user/category/Category.module.css"

import AddGroupDialog from "src/user/category/AddGroupDialog"
import GroupCard from "src/user/category/GroupCard"

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

import { firestore as db } from "firebase/firebase";
import useData from "context/data";
import useUserData from "context/userData";

const Category = () => {
  const {team} = useData()

  const [searchInput, setSearchInput] = useState("")

  const [openDialog, setOpenDialog] = useState("")

  const [groupList, setGroupList] = useState([])

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await db.collection("team_admin").doc(team.teamId).collection("groups").orderBy("savedAt", "desc").get()
      if(!querySnapshot.empty){
        const list = querySnapshot.docs.map((doc) => {
          return({id: doc.id, ...doc.data()})
        })
        setGroupList(list)
      }
      setIsLoading(false)
    } 
    fetchData()
  },[])



  const handleSearchInput = (e) => {
    setSearchInput(e.target.value)
  }

  return(
    <div className={styles.main_container}>
      <h1>그룹 목록</h1>
      <div className={styles.header_container}>
        <FormControl letiant="standard">
          <Input
            id="standard-adornment-amount"
            size="small"
            value={searchInput}
            onChange={handleSearchInput}
            startAdornment={<InputAdornment position="start"><SearchRoundedIcon /></InputAdornment>}
          />
        </FormControl>
        <Button
          variant="contained"
          size="small"
          onClick={()=>setOpenDialog("addGroup")}
          sx={{mt: '15px', ml:"15px"}}
        >
          + 그룹 생성
        </Button>
      </div>
      <div className={styles.border} />

      <Grid container rowSpacing={3} columnSpacing={1} sx={{mt:"10px"}}>
        {groupList.map((item, index) => {
          return(
            <GroupCard key={index} data={item}/>
          )
        })}
      </Grid>
      

      <AddGroupDialog {...{openDialog, setOpenDialog}}/>



    </div>
  )
}

export default Category