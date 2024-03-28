import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import Header from "src/post/id/Header"
import { firestore as db } from "firebase/firebase"
import { CircularProgress, Grid } from "@mui/material"

import ThumbnailCard from "src/post/id/ThumbnailCard"
import useData from "context/data"
import { filterObjByValueFromArrayOfObj } from "src/public/function/filter"


const Post = () => {
  const router = useRouter()
  const {id, type} = router.query
  const {team, fetch_program_thumbnailList, programThumbnailList, fetch_survey_thumbnailList, surveyThumbnailList, fetch_announcementList} = useData()
  
  const [sections, setSections] = useState([])
  const [selectedSection, setSelectedSection] = useState('all')

  const [thumbnails, setThumbnails] = useState([])
  const [filteredThumbnails, setFilteredThumbnails] = useState([])

  const [isLoading, setIsLoading] = useState(true)

  //검색결과가 없습니다 표시를 위해.
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [searchInput, setSearchInput] = useState("")

  const [filterType, setFilterType] = useState("전체")

  useEffect(()=>{
    const fetchData = async () => {
      setIsLoading(true)
      setSearchInput("")
      setSelectedSection("all")
      setThumbnails([])
      const doc = await db.collection("team").doc(id).collection("sections").doc(type).get()
      if(doc.exists){
        setSections(doc.data().data)
      } else{
        alert("유형을 1개이상 생성해주세요.")
        router.push(`/${id}/section/${type}`)
        return
      }


      await fetchDataByType()

      setIsLoading(false)
    }
    fetchData()
  },[type])

  
  const fetchDataByType = async () => {
    if(type==="announcements"){
      const result = await fetch_announcementList(id)
      if(result)
        setThumbnails(result)
    }
    else if(type==="programs"){
      const result = await fetch_program_thumbnailList(id)
      if(result)
        setThumbnails(result)
    } else if(type==="surveys"){
      const result = await fetch_survey_thumbnailList(id)
      if(result)
        setThumbnails(result)
    }
  }

    //search input 이 공백이면 자동으로 검색기능 제외
    useEffect(() => {
      if(searchInput==="" && isSearchMode){
        setIsSearchMode(false)
        onSearchClick("")
      }
    },[searchInput])


    useEffect(()=> {
      if(filterType==="전체"){
        setFilteredThumbnails(thumbnails)
      } else if(filterType==="게재중"){
        const list = thumbnails.map(item => {
          if(item.condition === "confirm") return item
        }).filter(Boolean)
        setFilteredThumbnails([...list])
      } else if(filterType==="미게재"){
        const list = thumbnails.map(item => {
          if(item.condition !=="confirm") return item
        }).filter(Boolean)
        setFilteredThumbnails([...list])
      } else if (filterType==="예약접수"){
        const list = thumbnails.map(item => {
          if(item.hasReserve && new Date(item.startAt.seconds*1000) > new Date()) return item
        }).filter(Boolean)
        setFilteredThumbnails([...list])
      } else if(filterType ==="접수중"){
        const list = thumbnails.map(item => {
          if(item.condition==="confirm")
            if(!item.hasReserve || new Date(item.startAt.seconds*1000) < new Date())
              if(!item.hasDeadline || new Date(item.endAt.seconds*1000) > new Date())
                return item
        }).filter(Boolean)
        setFilteredThumbnails([...list])
      } else if (filterType === "마감"){
        const list = thumbnails.map(item => {
          if(item.condition === "confirm"){
            if(item.hasDeadline && new Date(item.endAt.seconds*1000) < new Date()) return item
          } 
        }).filter(Boolean)
        setFilteredThumbnails([...list])
      }
    },[filterType, thumbnails])



  const onSearchClick = async (input) => {
    if (input==="") {

      await fetchDataByType()
      setIsSearchMode(false)
    }
    else {
      setIsSearchMode(true)
      const query = await db.collection("team").doc(team.id).collection(`programs_thumbnail`).where("keyword", "array-contains", input).orderBy("savedAt", "desc").get()
      const list = query.docs.map(doc => ({...doc.data(), id: doc.id}))
      setThumbnails(list)
    }
  }

  
  return(
    <>
      <Header {...{searchInput, setSearchInput, sections, selectedSection, setSelectedSection, type, onSearchClick, filterType, setFilterType}} />
      {isLoading && <CircularProgress />}
      {!isLoading && thumbnails?.length===0 && 
        isSearchMode ? 
          <p style={{marginTop:"100px", textAlign:"center"}}>검색된 게시물이 없습니다.</p>
        :
        thumbnails?.length===0 && 
          <p style={{marginTop:"100px", textAlign:"center"}}>아직 게시물이 없습니다.</p>
      }
      <Grid container sx={{mt:"20px"}} spacing={1}>
        {
          filteredThumbnails?.map((item, index) => {
            if(selectedSection==="all"){
                return(
                  <Grid item key={index} xs={3}>
                    <ThumbnailCard data={item} type={type}/>
                  </Grid>
                )
              
            }
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