import { Card } from "@mui/material"
import useData from "context/data"
import { useEffect } from "react"




const Commercial = ({id, style, imgStyle}) => {
  const {commercial} = useData()

  useEffect(() => {
    console.log(commercial[id])
  },[])
  
  if(commercial[id]?.link && commercial[id]?.link!=="")
  return(
    <Card style={{width:'100%', height:"100%", cursor:"pointer", ...style}}>
      <a target="_blank" href={commercial[id]?.link} rel="noreferrer">
        <img src={commercial[id]?.url} alt="광고" 
          style={{width:'100%', height:"100%", objectFit:"contain", ...imgStyle}}
        /> 
      </a>
    </Card>
  )
  else return (
    <img src={commercial[id]?.url} alt="광고" 
      style={{width:'100%', height:"100%", objectFit:"fill", borderRadius:"10px", ...style}}
    /> 
  )

}

export default Commercial