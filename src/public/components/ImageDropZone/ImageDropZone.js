// ** React Imports
import { Fragment, useEffect, useRef, useState } from 'react'
import styles from "./ImageDropZone.module.css"

import { handleProfileImage } from "src/public/hooks/handleProfileImage"

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import FileDocumentOutline from 'mdi-material-ui/FileDocumentOutline'

// ** Third Party Components
import toast from 'react-hot-toast'
import { useDropzone } from 'react-dropzone'
import { Grid } from '@mui/material'
import { useRouter } from 'next/router'
import Image from 'next/image'
import SortableComponent from '../SortableComponent'
import { v4 as uuidv4 } from 'uuid';


const ImageDropZone = ({
  /*
  필수 []혹은 [{url: 문서url, path: 문서의 storage path}]
  새로 추가되는 이미지들은 [{data: {File}, id: uuid}] 형식으로 추가됨.
  */
  files, setFiles, 
  deletedFiles, setDeletedFiles, //** 필수 storage에서 삭제되어야 할 file 배열. path 로 보내짐*/
  style,
  imgStyle={maxWidth:"200px", maxHeight:"200px"},
  recommandSize, //권장 사이즈 문구를 원할때 사용 출력: 권장 사이즈 {recommandSize}
  maxImgCount = 9, //최대 이미지 갯수
  //컴포넌트 출력방식을 바꾸고 싶으면 사용 (권장X)
  renderComponent = (file, index,setSelectedDeleteImg) => {
    return(
      <div key={index} style={{margin:"10px", position:"relative"}}>
        <div style={{position:"absolute", top:"5px", right:"5px", color:"red", cursor:"pointer", fontWeight:"bold"}}
          onClick={()=>setSelectedDeleteImg(file)}
        >
          X
        </div>
        <a href={file.url ? file.url : URL.createObjectURL(file.data)} target='_blank' rel="noreferrer">
          <img
            src={file.url ? file.url : URL.createObjectURL(file.data)}
            alt="이미지"
            style={imgStyle}
          />
        </a>
      </div>
    )
  }
}) => 
{

  
  // ** State
  const [components, setComponents] = useState([])
  const [selectedDeleteImg, setSelectedDeleteImg] = useState()

  // **ref
  const inputRef = useRef() //<input />을 안보이게 하고 button을 눌렀을때 input 기능 사용을 위함


  // ** Hooks useDropzone 설정. 
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 9,
    maxSize: 10000000,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: acceptedFiles => {
      if(files.length+acceptedFiles.length >maxImgCount)
        alert(`최대 ${maxImgCount}개의 이미지를 업로드하실 수 있습니다.`)
      else {
        const newFiles = acceptedFiles.map((file) => ({data: Object.assign(file), id: `${uuidv4()}`}))
        setFiles(prev => ([...prev, ...newFiles]))

        // let temp = []
        // newFiles.map((file, index) => {
        //   temp.push(renderComponent(file, index, setSelectedDeleteImg))
        // })
        // setComponents(prev => ([...prev, ...temp]))
      }
    },
    onDropRejected: () => {
      // toast.error('10MB이하의 이미지를 최대 9개 업로드할 수 있습니다.', {
      //   duration: 2000
      // })
      alert(`이미지만 업로드 하실 수 있으며, 10MB이하의 이미지를 최대 ${maxImgCount}개 업로드할 수 있습니다.`)
    },
    noClick: true, //클릭으로 파일 업로드 제외
  })
   

  //처음 받은 files 핸들
  useEffect(()=> {
    let temp = []
    files.map((file, index) => {
      temp.push(renderComponent(file, index, setSelectedDeleteImg))
    })
    setComponents(temp)
  },[files])
  
  //삭제 핸들
  useEffect(()=> {
    if(selectedDeleteImg){

      //storage 에 저장되어있는 경로를 통해 파일이 존재하는지 확인
      let selectedFile = undefined
      if(selectedDeleteImg.path){
        selectedFile = files.find(file =>  file.path === selectedDeleteImg.path);
        //storage에 있던 파일이라면 삭제해야될 파일 배열에 추가
        setDeletedFiles(prev => ([...prev, selectedFile.path]))
      }
      else 
        selectedFile = files.find(file => file.id === selectedDeleteImg.id )

      if(selectedFile){
        const deleteResult = files.map(file => {
          if(file!==selectedFile) return file
        }).filter(Boolean)
        setFiles(deleteResult)

        // let temp = []
        // deleteResult.map((file, index) => {
        //   temp.push(renderComponent(file, index, setSelectedDeleteImg))
        // })
        // setComponents(temp)

      } else alert("해당 이미지를 삭제하는데 오류가 발생했습니다. 새로고침하시거나 다시 시도해주세요.")

    }
  },[selectedDeleteImg])


  const onImgChange = (e) => {
    if(!e.target.files) alert("이미지 업로드 중 오류가 발생했습니다. 다시 시도해주세요.")
    const newImgs = Object.values(e.target.files)
    if(files.length + newImgs.length >  maxImgCount)
      alert(`최대 ${maxImgCount}개의 이미지를 업로드하실 수 있습니다.`)
    else {
      const addUuidAtFile = newImgs.map(img => ({data: img, id: uuidv4()}))

      setFiles(prevFiles => ([...prevFiles, ...addUuidAtFile]))

      // let temp = []
      // addUuidAtFile.map((file, index) => {
      //   temp.push(renderComponent(file, index, setSelectedDeleteImg))
      // })
      // console.log(temp)
      // setComponents(prev => ([...prev, ...temp]))
    }
  }


  return (
    <div className={styles.image_container} style={style}>

        <div {...getRootProps({ className: 'dropzone' })}> {/*드래그로 이미지 업로드 활성화 */}

          <div className={styles.dropzone_container}>


              {/* 이미지 업로드 결과 출력 */}

              {files.length>0 && <SortableComponent items={files} setItems={setFiles} {...{components, setComponents}}
                pressDelay={150} ulStyle={{width:"100%", display:"flex", flexWrap:"wrap"}} mode="x"
              />
            } 

              {/* 이미지 드래그로 업로드 안내 + 클릭으로 파일업로드 구현 */}
                <div className={styles.img_info}>
                  <p>이곳으로 이미지 드래그 혹은</p>
                  <input
                    type="file" name="selectedImg[]" onChange={onImgChange} accept="image/*"
                    style={{display:"none"}} ref={inputRef} multiple
                  />
                  <Button onClick={()=>inputRef.current.click()}>파일 업로드</Button>
                </div>

            <input {...getInputProps()} />

          </div>
          {recommandSize && <p style={{marginTop:"7px", fontWeight:"bold", }}>권장 사이즈 {recommandSize}</p>}
        </div>
      {/* </div> */}
    </div>
  )
}

export default ImageDropZone
