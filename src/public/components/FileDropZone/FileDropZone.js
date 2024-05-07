import { useRef, useState, useEffect } from "react"
import styles from "./FileDropZone.module.css"

import SortableComponent from "../SortableComponent"


import { Button } from "@mui/material"

import { useDropzone } from "react-dropzone"
import { v4 as uuidv4 } from "uuid"


const FileDropZone = ({
  /*
  files, setFiles 필수 []혹은 [{url: 문서url, path: 문서의 storage path}]
  새로 추가되는 이미지들은 [{data: {File}, id: uuid}] 형식으로 추가됨.
  */
  files, setFiles,
  setDeletedFiles,  //** 필수 storage에서 삭제되어야 할 file 배열. path 로 보내짐*/
  style, fileStyle,
  maxSize, //MB
  maxFiles,
  //컴포넌트 출력방식을 바꾸고 싶으면 사용 (권장X)
  renderComponent = (file, index, setSelectedDeleteFile) => {
    return (
      // <div key={index} style={{margin:"10px", position:"relative"}}>
      //   <div style={{position:"absolute", top:"5px", right:"5px", color:"red", cursor:"pointer", fontWeight:"bold"}}
      //     onClick={()=>setSelectedDeleteFile(file)}
      //   >
      //     X
      //   </div>
      //   <a href={file.url ? file.url : URL.createObjectURL(file.data)} target='_blank' rel="noreferrer">
      //     <img
      //       src={file.url ? file.url : URL.createObjectURL(file.data)}
      //       alt="이미지"
      //       style={fileStyle}
      //     />
      //   </a>
      // </div>
      <div key={index} className={styles.item}>
        <h6>{file?.data?.name ?? file.path.split("/")[4]}</h6>
        <p onClick={()=>setSelectedDeleteFile(file)}>삭제</p>
      </div>
    )
  }
  
}) => {

  const [components, setComponents] = useState([])
  const [selectedDeleteFile, setSelectedDeleteFile] = useState("")

  const [dragOver, setDragOver] = useState(false) //파일 구역안으로 드래그 시 hover event

  const inputRef = useRef()


  //처음 받은 files 핸들
  useEffect(()=>{
    let temp = []
    files.map((file, index) => {
      temp.push(renderComponent(file, index, setSelectedDeleteFile))
    })
    setComponents(temp)
  },[files])



  //삭제 핸들
  useEffect(()=> {
    if(selectedDeleteFile){

      //storage 에 저장되어있는 경로를 통해 파일이 존재하는지 확인
      let selectedFile = undefined
      if(selectedDeleteFile.path){
        selectedFile = files.find(file =>  file.path === selectedDeleteFile.path);
        //storage에 있던 파일이라면 삭제해야될 파일 배열에 추가
        setDeletedFiles(prev => ([...prev, selectedFile.path]))
      }
      else 
        selectedFile = files.find(file => file.id === selectedDeleteFile.id )

      if(selectedFile){
        const deleteResult = files.map(file => {
          if(file!==selectedFile) return file
        }).filter(Boolean)
        setFiles(deleteResult)
      } else alert("해당 파일을 삭제하는데 오류가 발생했습니다. 새로고침하시거나 다시 시도해주세요.")

    }
  },[selectedDeleteFile])


  // ** Hooks useDropzone 설정. 
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: maxFiles,
    maxSize: maxSize*1000000,
    accept: '*/*', 
    onDragEnter: () => {
      if(!dragOver) setDragOver(true)
    },
    onDragLeave: () => {
      if(dragOver) setDragOver(false)
    },
    onDrop: acceptedFiles => {
      setDragOver(false)
      if(files.length+acceptedFiles.length > maxFiles)
        alert(`최대 ${maxFiles}개의 파일을 업로드하실 수 있습니다.`)
      else {
        const newFiles = acceptedFiles.map((file) => ({data: Object.assign(file), id: `${uuidv4()}`}))
        setFiles(prev => ([...prev, ...newFiles]))
      }
    },
    onDropRejected: () => {
      alert(`${maxSize}MB이하의 파일을 최대 ${maxFiles}개 업로드할 수 있습니다.`)
    },
    noClick: true, //클릭으로 파일 업로드 제외  
  })







  const onFileChange = (e) => {
    if(!e.target.files) alert("이미지 업로드 중 오류가 발생했습니다. 다시 시도해주세요.")
    const newFiles = Object.values(e.target.files)
    if(files.length + newFiles.length > maxFiles)
      alert(`최대 ${maxFiles}개의 이미지를 업로드하실 수 있습니다.`)
    else {
      const addUuidAtFile = newFiles.map(file => {
        console.log(file)
        if(file.size >maxSize*1000000)
          alert(`${maxSize}MB 이상의 파일은 올리실 수 없습니다.\n파일명: ${file.name}`)
        else if(file.name.includes("/"))
          alert(`파일명에 '/'를 포함할 수 없습니다.`)
        else return {data: file, id: uuidv4()}
      }).filter(Boolean)

      setFiles(prevFiles => ([...prevFiles, ...addUuidAtFile]))
    }
  }
  

  return(
    <div className={styles.fileDropZone_container} style={style}>
      <div {...getRootProps({ className: 'dropzone' })}>{/*드래그로 파일 업로드 활성화 */}
        <div
          className={dragOver ? `${styles.dropzone_container} ${styles.drag_over}` : styles.dropzone_container}
        >
          {files.length>0 &&  
            <SortableComponent
              items={files} setItems={setFiles}
              {...{components, setComponents}}
              pressDelay={150}
              ulStyle={{width:"100%", maxHeight:"150px", overflow:"scroll"}}
              mode="y"
            />
          }

          {/* 이미지 드래그로 업로드 안내 + 클릭으로 파일업로드 구현 */}
          <div className={styles.file_info}>
            <p>이곳으로 파일 드래그 혹은</p>
            <input
              type="file" name="selectedImg[]" onChange={onFileChange} 
              style={{display:"none"}} ref={inputRef} multiple
            />
            <Button onClick={()=>inputRef.current.click()}>파일 업로드</Button>
          </div>

          <input {...getInputProps()} />
        </div>
      </div>
    </div>
  )
}

export default FileDropZone