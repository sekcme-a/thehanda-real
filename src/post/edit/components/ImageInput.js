
import MuiButton from "src/public/mui/MuiButton"
import styles from "./index.module.css"
import { Dialog, Grid } from "@mui/material"
import { compressImages, getFilesData, readImageAsDataURL, uploadFilesToStorage, useCompressImage } from "src/public/hooks/handleFiles"
import { useEffect, useState } from "react"
import SortableComponent from "src/public/components/SortableComponent"

const ImageInput = ({selectedImageList, setSelectedImageList}) => {
  const [renderComponents, setRenderComponents] = useState([])
  const [imageDialog, setImageDialog] = useState("")

  useEffect(()=> {
    const list = selectedImageList.map((image, index) => {

      return(
        <div key={index} className={styles.image_container}>
          <div className={styles.delete_image} onClick={()=>onDeleteImage(image)}>x</div>
          <img className={styles.image} src={image} onClick={()=>setImageDialog(image)}/>
        </div>
      )
    })
    setRenderComponents(list)
  },[selectedImageList])

  const onImageAddClick = async () => {
    try{
      const newImageList = await getFilesData("onlyImage","multipleSelect")
      
      //최대 6개의 이미지
      if(newImageList.length+selectedImageList.length>6){
        alert("최대 6개의 이미지를 넣을 수 있습니다.")
        return
      }
      
      if(newImageList.length>0){
        const compressedImageList = await compressImages(newImageList, 1)
        const urls = [];
        for (const file of compressedImageList) {
          console.log(file)
          const url = await readImageAsDataURL(file);
          urls.push(url);
        }
        setSelectedImageList(prev=>([
          ...urls,  
          ...prev,
        ]))
      }
    }catch(e){
      console.error("Error:", e);
    }
  }

  const onDeleteImage = (img) => {
    const filteredList = selectedImageList.filter(item => item!==img)
    setSelectedImageList(filteredList)
  }

  return(
    <div className={styles.info_container} style={{marginTop:"25px"}}>
      <h1>이미지 첨부</h1>
      <div className={styles.info_item_container}>

        <Grid container style={{marginBottom:"15px"}} columnSpacing={1}>

          <Grid item xs={3}>
            <MuiButton small label="이미지 추가 +" onClick={onImageAddClick} />
          </Grid>
          <Grid item xs={8}>
            <p style={{fontSize:"14px", marginBottom:"10px"}}>이미지를 잠시동안 누른 후 드래그를 통해 순서를 바꾸실 수 있습니다.</p>
            <div style={{width:'100%'}}>
              <SortableComponent
                items={selectedImageList} setItems={setSelectedImageList}
                components={renderComponents} setComponents={setRenderComponents}
                mode="xy"
                pressDelay={150}
                ulStyle={{width:'100%', display:"flex", flexWrap:'wrap'}}
              />
            </div>
            {/* <Grid container columnSpacing={3} sx={{mt:"15px"}}>
              {
                selectedImageList?.map((item, index) => {
                  console.log(item)
                  // if(typeof item === "object")
                    return(
                      <Grid item xs={3} key={index}>
                        <img src={item} className={styles.image}/>
                      </Grid>
                    )
                  
                })
              }
            </Grid> */}
          </Grid>
        </Grid>
       

      </div>


      <Dialog open={imageDialog!==""} onClose={()=>setImageDialog("")}>
        <img src={imageDialog} className={styles.image_dialog}/>
      </Dialog>

    </div>
  )
}

export default ImageInput