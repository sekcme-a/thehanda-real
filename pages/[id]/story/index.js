import { CircularProgress, Grid } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { filterObjByValueFromArrayOfObj } from "src/public/function/filter"
import Header from "src/story/index/Header"
import { FUNCTION } from "src/story/index/IndexFunction"
import ThumbnailCard from "src/story/index/ThumbnailCard"




const Story = () => {
  const router = useRouter()
  const {id} = router.query

  const [searchInput, setSearchInput] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const [stories, setStories] = useState([])

  const [filteredStories, setFilteredStories] = useState([])
  const [isSearchMode, setIsSearchMode] = useState(false)

  useEffect(()=> {
    const fetchData = async () => {
      const res = await FUNCTION.read_story(id)
      setStories(res)
      setFilteredStories(res)
      setIsLoading(false)
    }
    fetchData()
  },[])

  const onSearchClick = () => {
    setIsSearchMode(true)
    const res = filterObjByValueFromArrayOfObj(stories, searchInput)
    setFilteredStories(res)
  }
  useEffect(()=> {
    if(searchInput==="" && isSearchMode){
      setFilteredStories(stories)
      setIsSearchMode(false)
    }
  },[searchInput])


  return(
    <>
      <Header {...{searchInput, setSearchInput, onSearchClick}}/>
      {isLoading && <CircularProgress />}
      {!isLoading && filteredStories?.length===0 &&
        isSearchMode ? 
          <p style={{marginTop:"100px", textAlign:"center"}}>검색된 게시물이 없습니다.</p>
        :
        filteredStories?.length===0 &&
          <p style={{marginTop:"100px", textAlign:"center"}}>아직 게시물이 없습니다.</p>
      }
      <Grid container sx={{mt:"20px"}} spacing={1}>
        {
          filteredStories?.map((item, index) => {
            return(
              <Grid item key={index} xs={3}>
                <ThumbnailCard data={item} />
              </Grid>
            )
          })
        }
      </Grid>
    </>
  )
}

export default Story