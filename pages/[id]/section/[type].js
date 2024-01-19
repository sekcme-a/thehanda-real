
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import useData from "context/data"

import PageHeader from "src/public/components/PageHeader"
import CardContent from "src/section/CardContent"
import AddDialog from "src/section/AddDialog"
import DeleteDialog from "src/section/DeleteDialog"
import EditDialog from "src/section/EditDialog"

import SortableComponent from "src/public/components/SortableComponent"

import { Card, Grid, Box, Typography, Dialog, CircularProgress, Button } from "@mui/material"

import { firestore as db } from "firebase/firebase"

const Section = () => {
  const router = useRouter()
  const {id, type} = router.query
  const [sections, setSections] = useState([])

  const [text, setText] = useState("")

  const [isOpenDialog, setIsOpenDialog] = useState(false)
  const [dialogMode, setDialogMode] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [components, setComponents] = useState([])

  useEffect(()=> {
    if(type==="program") setText("프로그램")
    else if(type==="survey") setText("설문조사")
    else if(type==="announcement") setText("공지사항")

    const fetchData = async () => {
      let tempItems = []

      const doc = await db.collection("team").doc(id).collection("sections").doc(type).get()
      if(doc.exists){
        setSections(doc.data().data)
        tempItems=doc.data().data
      } else{
        setSections([])
      }
      let temp = []
      for (let i =0 ; i<tempItems.length; i++){
        temp.push(renderComponent(tempItems[i]))
      }
      setComponents([...temp])
      setIsLoading(false) 
    }
    fetchData()
  },[type])


  const onButtonClick = (mode) => {
    setIsOpenDialog(true)
    setDialogMode(mode)
  }
  

  const onSubmitClick = () => {
    if(confirm("해당 내용을 적용하시겠습니까? (적용 즉시 어플에 적용됩니다.)")){
      db.collection("team").doc(id).collection("sections").doc(type).set({
        data: sections
      }).then(()=>{
        alert("적용되었습니다.")
      })
    }
  }

  const renderComponent = (data) => {
    return(
      <div style={styles.item}>
        <h1 style={{color:"black"}}>{data.name}</h1>
        <p style={{color: "#333", fontSize:"12px"}}>등록일 : {data.createdAt}</p>
      </div>
    )
  }
  const styles={
    item: {
      padding: "10px 15px",
      backgroundColor: "white",
      borderRadius: "5px",
      border: "1px solid #999",
      marginBottom: "10px",
      display:"flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
  }


  if(isLoading) return <CircularProgress />

  return(
    <>
      <PageHeader title={`${text} 유형 관리`} subtitle={`${text} 유형을 추가/삭제하거나 순서를 변경하실 수 있습니다.\n적용 버튼을 눌러야 적용됩니다.`}/>
    
      <Grid container spacing={3} className='match-height'>
        <CardContent mode="title" title="현재 유형 갯수" content={`${sections.length}개`}/>
        <CardContent mode="button" buttonText="유형 추가" content="유형을 추가합니다." handleClick={()=>onButtonClick("add")}/>
        <CardContent mode="button" buttonColor="error" buttonText="유형 삭제" content="유형을 삭제합니다." handleClick={()=>onButtonClick("delete")}/>
        <CardContent mode="button" buttonColor="secondary" buttonText="유형명 편집" content="유형명을 편집합니다." handleClick={()=>onButtonClick("edit")}/>
      </Grid>


      <PageHeader title={`${text} 유형`}/>


      <SortableComponent items={sections} setItems={setSections}
        components={components} setComponents={setComponents} mode="y" ulStyle={{ width: "100%" }} pressDelay={150} />

      <div style={{display:"flex", justifyContent:"center"}}>
        <Button variant="contained" onClick={onSubmitClick}>적용</Button>
      </div>


      <Dialog open={isOpenDialog} onClose={()=> {setIsOpenDialog(false)}}>
        {dialogMode==="add" && <AddDialog {...{sections, setSections, setComponents, renderComponent, setIsOpenDialog}}/>}
        {dialogMode==="delete" && <DeleteDialog {...{sections, setSections, setComponents, renderComponent, setIsOpenDialog}}/>}
        {dialogMode==="edit" && <EditDialog {...{sections, setSections, setComponents, renderComponent, setIsOpenDialog}}/>}


      </Dialog>
    
    </>
  )
}

export default Section