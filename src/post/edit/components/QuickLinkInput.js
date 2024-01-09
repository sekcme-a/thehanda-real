import { TextField, Button, Grid } from "@mui/material"
import styles from "./index.module.css"


const QuickLinkInput = ({postValues, setPostValues}) => {

  const onQuickLinkChange = (index, type, value) => {
    const changedValue = postValues.quickLink.map((item, i) => i === index ? { ...item, [type]: value } : item)
    setPostValues(prevValues => ({...prevValues, quickLink: [...changedValue]}))
  }

  const onAddQuickLinkClick = () => {
    setPostValues(prevValues => ({
      ...prevValues,
      quickLink: [...prevValues.quickLink, {title:"", text:""}]
    }))
  }

  const onDeleteQuickLinkClick = (n) => {
    const temp = postValues.quickLink.map((item, index) => index!==n && item ).filter(Boolean)
    setPostValues(prevValues => ({
      ...prevValues,
      quickLink: [...temp]
    }))
  }


  return(
    <div className={styles.info_container} style={{marginTop:"25px"}}>
      <h1>바로가기 작성</h1>
      <div className={styles.info_item_container}>
        {postValues.quickLink?.map((item,index) => {
          return(
            <Grid container key={index} style={{marginBottom:"15px"}} columnSpacing={1}>
              <Grid item xs={3}>
                <TextField value={item.title} size="small" label="바로가기 제목"
                   onChange={(e)=>onQuickLinkChange(index, "title", e.target.value)}
                 />
              </Grid>
              <Grid item xs={8}>
                <TextField value={item.text} size="small" label="링크" fullWidth multiline
                   onChange={(e)=>onQuickLinkChange(index, "text", e.target.value)}
                   placeholder="https:// 혹은 http://가 포함된 전체주소를 입력해주세요."
                 />
              </Grid>
              <Grid item xs={1}>
                <Button color="error" variant="contained" size="small"
                  onClick={()=>onDeleteQuickLinkClick(index)}>
                  삭제
                </Button>
              </Grid>
            </Grid>
          )
        })}
        <Button variant="contained" size="small" onClick={onAddQuickLinkClick}>정보 추가 +</Button>
      </div>
    </div>
  )
}

export default QuickLinkInput