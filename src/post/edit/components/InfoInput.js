import { TextField, Button, Grid } from "@mui/material"
import styles from "./index.module.css"
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { arrayMoveImmutable } from "array-move";

const InfoInput = ({postValues, setPostValues}) => {

  const onInfoChange = (index, type, value) => {
    const changedValue = postValues.info.map((item, i) => i === index ? { ...item, [type]: value } : item)
    setPostValues(prevValues => ({...prevValues, info: [...changedValue]}))
  }

  const onAddInfoClick = () => {
    setPostValues(prevValues => ({
      ...prevValues,
      info: [...prevValues.info, {title:"", text:""}]
    }))
  }

  const onDeleteInfoClick = (n) => {
    const temp = postValues.info.map((item, index) => index!==n && item ).filter(Boolean)
    setPostValues(prevValues => ({
      ...prevValues,
      info: [...temp]
    }))
  }

  const onUpClick = (index) => {
    const sortedResult = arrayMoveImmutable(postValues.info, index, index-1)
    setPostValues(prevValues => ({
      ...prevValues,
      info: sortedResult
    }))
  }
  const onDownClick = (index) => {
    const sortedResult = arrayMoveImmutable(postValues.info, index, index+1)
    setPostValues(prevValues => ({
      ...prevValues,
      info: sortedResult
    }))
  }


  return(
    <div className={styles.info_container} style={{marginTop:"25px"}}>
      <h1>정보창 작성</h1>
      <div className={styles.info_item_container}>
        {postValues.info?.map((item,index) => {
          return(
            <Grid container key={index} style={{marginBottom:"15px"}} columnSpacing={1}>
              <Grid item xs={3}>
                <TextField value={item.title} size="small" label="제목"
                   onChange={(e)=>onInfoChange(index, "title", e.target.value)}
                 />
              </Grid>
              <Grid item xs={8}>
                <TextField value={item.text} size="small" label="내용" fullWidth multiline
                   onChange={(e)=>onInfoChange(index, "text", e.target.value)}
                 />
              </Grid>
              <Grid item xs={1}>
                <Button color="error" variant="contained" size="small"
                  onClick={()=>onDeleteInfoClick(index)}>
                  삭제
                </Button>
                <Button sx={{mt: "10px"}} variant="contained" size="small" color="success"
                  onClick={()=>onUpClick(index)}>
                  <KeyboardArrowUpRoundedIcon sx={{fontSize:"15px"}}/>
                </Button>
                <Button sx={{mt:"4px"}} variant="contained" size="small" color="success"
                  onClick={()=>onDownClick(index)}>
                  <KeyboardArrowDownRoundedIcon sx={{fontSize:"15px"}} />
                </Button>
              </Grid>
            </Grid>
          )
        })}
        <Button variant="contained" size="small" onClick={onAddInfoClick}>정보 추가 +</Button>
      </div>
    </div>
  )
}

export default InfoInput