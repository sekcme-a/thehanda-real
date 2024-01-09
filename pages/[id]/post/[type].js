import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import Header from "src/post/id/Header"
import { firestore as db } from "firebase/firebase"
import { CircularProgress, Grid } from "@mui/material"

import ThumbnailCard from "src/post/id/ThumbnailCard"


const Post = () => {
  const router = useRouter()
  const {id, type} = router.query
  const [sections, setSections] = useState([])
  const [selectedSection, setSelectedSection] = useState('all')

  const [thumbnails, setThumbnails] = useState([])

  const [isLoading, setIsLoading] = useState(true)

  useEffect(()=>{
    const fetchData = async () => {
      setIsLoading(true)
      setSelectedSection("all")
      setThumbnails([])
      const doc = await db.collection("team").doc(id).collection("sections").doc(type).get()
      if(doc.exists){
        setSections(doc.data().data)
      } else{
        alert("섹션을 1개이상 생성해주세요.")
        router.push(`/${id}/section/${type}`)
        return
      }

      let thumbnailQuery = []

      if(type==="announcements")
        thumbnailQuery = await db.collection("team").doc(id).collection(`${type}`).orderBy("savedAt", "desc").get()
      else
        thumbnailQuery = await db.collection("team").doc(id).collection(`${type}_thumbnail`).orderBy("savedAt", "desc").get()
      if(!thumbnailQuery.empty){
        const thumbnailDocs = thumbnailQuery.docs.map((doc)=>{
          return({...doc.data(), id: doc.id})
        })
        setThumbnails([...thumbnailDocs])
      }
      setIsLoading(false)
    }
    fetchData()
  },[type])


  
  return(
    <>
      <Header {...{sections, selectedSection, setSelectedSection, type}} />
      {isLoading && <CircularProgress />}
      {!isLoading && thumbnails.length===0 && <p style={{marginTop:"100px", textAlign:"center"}}>아직 게시물이 없습니다.</p>}
      <Grid container sx={{mt:"20px"}} spacing={1}>
        {
          thumbnails.map((item, index) => {
            if(selectedSection==="all")
              return(
                <Grid item key={index} xs={3}>
                  <ThumbnailCard data={item} type={type}/>
                </Grid>
              )
            else if(item.selectedSections.some(item=>item.id === selectedSection))
              return(
                <Grid item key={index} xs={3}>
                  <ThumbnailCard data={item} type={type}/>
                </Grid>
              )
          })
        }
      
      </Grid>
    </>
  )
}

export default Post