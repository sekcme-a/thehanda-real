import { useRouter } from "next/router"
import DropperImage from "src/public/components/DropperImage"
import { useState } from "react"

import { CircularProgress } from "@mui/material"
import Image from "next/image"

const ThumbnailInput = ({postValues, setPostValues}) =>{
  const router = useRouter()
  const {id, postId} = router.query

  const [isImgURLLoading, setIsImgURLLoading] = useState(false)

  const handleThumbnailURL = (url) => {
    setPostValues(prevValues => ({
      ...prevValues,
      thumbnailURL: url
    }))
  }
  

  return(
    <>

      <div style={{display:"flex", alignItems:"center", margin:"0px 0"}}>
        <h1 style={{fontSize:"15px", width: "123px"}}>썸네일 업로드</h1>
        <DropperImage 
          setImgURL={handleThumbnailURL}
          path={`contents/${id}/${postId}/thumbnail/${Date.now()}`}
          imgURL={postValues.thumbnailURL}
          setLoading={setIsImgURLLoading}
          recommandSize="1850*1300"
        />
        
        {isImgURLLoading ? 
          <CircularProgress /> :  
          postValues.thumbnailURL && 
          <a href={postValues.thumbnailURL} target="_blank" rel="noreferrer">
            <Image src={postValues.thumbnailURL} 
              width={150} height={150} alt="썸네일 사진"
              style={{cursor:"pointer"}} 
            />
          </a>
        }
        
      </div>
     
    </>
  )
}

export default ThumbnailInput