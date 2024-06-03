import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { firestore as db } from "firebase/firebase"
import styles from "./customForm.module.css"

import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import SortableComponent from "src/public/components/SortableComponent"
import { Coffee } from "mdi-material-ui"
import { arrayMoveImmutable } from "array-move"
import FileDropZone from "src/public/components/FileDropZone/FileDropZone"



const AddDialog = ({addFormData,editFormData, handleCloseDialog, formData, teamName, contentMode, id}) => {
  const [type, setType] = useState('')
  const [typeText, setTypeText] = useState('')
  const [titleValue, setTitleValue] = useState({
    value: "",
    helperText: "",
    isError: false,
  })
  const [subtitleValue, setSubtitleValue] = useState({
    value: "",
    helperText: "",
    isError: false,
  })

  const [textInput, setTextInput] = useState("")
  const [helperText, setHelperText] = useState('')
  const [isRequired, setIsRequired] = useState(false)

  const [textFieldHelperText, setTextFieldHelperText] = useState("드래그를 통해 옵션들의 순서를 변경할 수 있습니다.")
  const [isTextFieldHelperTextError, setIsTextFieldHelperTextError] = useState(false)

  //for SortableComponents.js
  const [items, setItems] = useState([])
  const [components, setComponents] = useState([])
  const [triggerDelete, setTriggerDelete] = useState("")
  
  //for filesDropZone
  const [files, setFiles] = useState([])
  const [deletedFiles, setDeletedFiles] = useState([])
  const MAX_FILE_SIZE = 20 //mb
  const MAX_FILE_COUNT = 9

  useEffect(()=> {
    if(id && id!==""){
      const foundObj = formData.find(obj => obj.id === id)
      if(foundObj){
        console.log(foundObj)
        setType(foundObj.type)
        setTypeText(foundObj.typeText)
        setIsRequired(foundObj.isRequired)
        setTitleValue(prev => ({...prev, value: foundObj.title}))
        setSubtitleValue(prev => ({...prev, value: foundObj.subtitle}))
        setItems(prev => ([...prev, ...foundObj.items]))
        if(foundObj.files)
          setFiles(foundObj.files)
        
        const tempComponentData = foundObj.items.map((item) => {
          return renderComponent(item)
        })
        setComponents(tempComponentData)
      }else{
        alert(`해당 폼을 찾을 수 없습니다.\nError: 101AspefaD`)
      }
    }
  },[])


  
  const onTextInputChange = (e) => {
    setTextInput(e.target.value)
    setTextFieldHelperText("드래그를 통해 옵션들의 순서를 변경할 수 있습니다.")
    setIsTextFieldHelperTextError(false)
  }
  const onTitleChange = e => setTitleValue({ ...titleValue, value: e.target.value, helperText: "", isError: false })
  const onSubtitleChange = e => setSubtitleValue({ ...subtitleValue, value: e.target.value, helperText: "", isError: false })


  const handleChange = event => {
    
    if (event.target.value === "text_area") {
      setHelperText("원하는 문구를 추가할 수 있습니다.")
      setTypeText("문구 추가")
      setIsRequired(false)
    }
    else if (event.target.value === "single_checkbox") {
      setHelperText("체크박스 형태로, 보기들 중 한개의 보기만 선택할 수 있습니다.")
      setTypeText("단일 선택형")
    }
    else if (event.target.value === "multiple_checkbox") {
      setHelperText("체크박스 형태로, 보기들 중 여러개의 보기를 선택할 수 있습니다.")
      setTypeText("복수 선택형")
    }
    else if (event.target.value === "list_select") {
      setHelperText("위와 같은 목록 형태로, 보기들 중 한개의 보기를 선택할 수 있습니다.")
      setTypeText("목록 선택형")
    }
    else if (event.target.value === "number_select") {
      setItems([])
      setComponents([])
      setHelperText("1,000,000,00자리 이하 숫자를 입력할 수 있습니다.")
      setTypeText("숫자 입력형")
    }
    else if (event.target.value === "small_input") {
      setItems([])
      setComponents([])
      setHelperText("100자 이하를 입력할 수 있습니다.")
      setTypeText("주관식 단답형")
    }
    else if (event.target.value === "free_input") {
      setItems([])
      setComponents([])
      setHelperText("1000자 이하를 입력할 수 있습니다.")
      setTypeText("주관식 서술형")
    }
    else if (event.target.value === "date_time") {
      setItems([])
      setComponents([])
      setHelperText("날짜나 시간 혹은 둘다 입력할 수 있습니다.")
      setTypeText("날짜/시간")
    }
    else if (event.target.value === "phone_number") {
      setItems([])
      setComponents([])
      setHelperText("전화번호를 입력할 수 있습니다.")
      setTypeText("전화번호")
    }
    else if (event.target.value === "address") {
      setItems([])
      setComponents([])
      setHelperText("우편번호와 주소를 입력할 수 있습니다.")
      setTypeText("주소")
    }
    else if (event.target.value === "image") {
      setItems([])
      setComponents([])
      setHelperText("이미지를 첨부할 수 있습니다. 1MB이상 이미지는 자동 압축됩니다.")
      setTypeText("이미지")
    }
    else if (event.target.value === "file") {
      if(formData.some(obj => Object.is(obj.type, "file"))){
        alert(`'파일' 형식은 한 프로그램 당 1개만 존재할 수 있습니다.`)
        return
      }
      setItems([])
      setComponents([])
      setHelperText("20MB이하의 파일을 최대 9개 첨부할 수 있습니다.")
      setTypeText("파일")
    }
    setType(event.target.value)
  }

  const onItemDeleteClick = (data) => {
    if(confirm(`해당 옵션을 삭제하시겠습니까?\n내용: ${data}`)){
      setTriggerDelete(data)
    }
  }
  useEffect(()=> {
    if(triggerDelete!==""){
      for (let i=0; i<items.length;i++){
        if(triggerDelete === items[i]){
          const temp = arrayMoveImmutable(items, i, items.length-1)
          temp.pop()
          setItems(temp)

          const temp2 = arrayMoveImmutable(components, i, components.length-1)
          temp2.pop()
          setComponents(temp2)
        }
      }
    }
  },[triggerDelete])

  const renderComponent = (text) => (
    <div key={text}
      style={{display:"flex", width:"350px", padding: "7px 10px", marginBottom:"5px",
      justifyContent:"space-between",alignItems:"center", cursor:"pointer",
      border:"1px solid #888", borderRadius:"5px"}}>
      <p>{ text }</p>
      <p onClick={()=>onItemDeleteClick(text)}
        style={{color:"rgb(201, 28, 28)", fontSize:"12px", fontWeight:"bold", cursor:"pointer"}}>X</p>
    </div> 
  )

  const onAddClick = () => {
    if (items.includes(textInput)) {
      setTextFieldHelperText("이미 있는 옵션입니다.")
      setIsTextFieldHelperTextError(true)
    }
    else if (textInput==="" || textInput===" "){
      setTextFieldHelperText("공백을 옵션으로 줄 수 없습니다.")
      setIsTextFieldHelperTextError(true)
    }
    else {
      setItems([...items, textInput])
      setComponents(
        [
          ...components,
          renderComponent(textInput)
        ]
      )
      // setComponents([...components, {value: textInput, component:<p>{ textInput }</p> }])
      setTextInput("")
    }
  }

  // const handleOnKeyPress = (e) => {
  //   if (e.key === "Enter") {
  //     onAddClick()
  //   }
  // }

  const onItemChange = (e)=>{setItems(e.target.value)}

  const onSubmitClick = async() => {
    if (isCanSubmit()) {
      if(id && id!==""){
        //이미 작성한 폼의 편집일 경우
        editFormData(
          {
            id: id,
            type: type,
            typeText: typeText,
            title: titleValue.value,
            subtitle: subtitleValue.value,
            items: items,
            isRequired: isRequired,
            ...(files && { files: files }),
            ...(deletedFiles?.length>0 && { deletedFiles: deletedFiles })
          }
        )
        handleCloseDialog()
      }else {
        try {
          const randomId = await db.collection("user").doc().id
          addFormData(
            {
              id:randomId, 
              type: type, 
              typeText: typeText, 
              title: titleValue.value, 
              subtitle: subtitleValue.value, 
              items: items, 
              isRequired: isRequired,
              ...(files && { files: files }),
              ...(deletedFiles?.length>0 && { deletedFiles: deletedFiles })
            })
          handleCloseDialog()
        } catch (e) {
          alert(e)
          console.log(e)
        }
      }
    }
  }
  const isCanSubmit = () => {
    if (type === "")
      alert("입력 타입이 지정되지 않았습니다.")
    else if(type==="text_area")
      return true;
    else if(titleValue.value==="")
      setTitleValue({ ...titleValue, helperText: "제목은 빈칸일 수 없습니다.", isError: true })
    else if(id && id!=="") return true //이미 작성한 폼 수정일 경우 제목 검사 필요 X
    else if (isTitleAlreadyExist())
      setTitleValue({...titleValue, helperText: "이미 존재하는 제목입니다.", isError: true })
    else return true;
    
    return false
  }
  const isTitleAlreadyExist = () => {
    for (let i = 0; i < formData.length; i++){
      if(formData[i].title===titleValue.value)
        return true
    }
    return false
  }
  return (
    <div className={styles.add_dialog_container}>
      <div className={styles.content_container}>
        <h3>추가할 데이터를 만드세요.</h3>
        <div className={styles.form_control_container}>
          <FormControl variant='standard' className={styles.form_control}>
            <InputLabel id='demo-simple-select-label'>입력 타입</InputLabel>
            <Select label='Age' labelId='demo-simple-select-label' id='demo-simple-select' onChange={handleChange} defaultValue='' value={type}>
              {contentMode && <MenuItem value="text_area">문구 추가</MenuItem>}
              <MenuItem value="single_checkbox">단일 선택형</MenuItem>
              <MenuItem value="multiple_checkbox">복수 선택형</MenuItem>
              {/* <MenuItem value="list_select">목록 선택형</MenuItem> */}
              {/* <MenuItem value="list_select">선호도형</MenuItem> */}
              <MenuItem value="number_select">숫자 입력형</MenuItem>
              <MenuItem value="small_input">주관식 단답형</MenuItem>
              <MenuItem value="free_input">주관식 서술형</MenuItem>
              {/* <MenuItem value="date_time">날짜/시간</MenuItem> */}
              <MenuItem value="phone_number">전화번호</MenuItem>
              <MenuItem value="address">주소</MenuItem>
              {/* <MenuItem value="file">파일</MenuItem> */}
              {/* <MenuItem value="image">이미지</MenuItem>
              <MenuItem value="file">파일</MenuItem> */}
            </Select>
            <FormHelperText style={{color: "blue", width:"400px"}}>{helperText}</FormHelperText>
          </FormControl>
        </div>
        {/* <div className={styles.form_control_container_2}>
          <FormControl variant='standard' className={styles.form_control}>
            <InputLabel id='demo-simple-select-label'>위치</InputLabel>
            <Select label='Age' labelId='demo-simple-select-label' id='demo-simple-select' onChange={handleLocationChange} defaultValue='' value={locationValue.value}>
              <MenuItem value="main">메인정보</MenuItem>
              <MenuItem value="sub">추가정보</MenuItem>
            </Select>
            <FormHelperText style={{ color: locationValue.isError ? "red" : "blue", width:"400px"}} >{locationValue.helperText}</FormHelperText>
          </FormControl>
        </div> */}
        

        {/* {type !== "text_area" && */}
          <TextField id="standard-basic" label="제목" variant='standard'
            value={titleValue.value} onChange={onTitleChange} helperText={titleValue.helperText}
            error={titleValue.isError} />
            {/* } */}
        <div style={{width:"100%", marginTop:"5px"}}>
          <TextField id="standard-basic" label="부가내용" variant='standard' fullWidth multiline maxRows={3}
            value={subtitleValue.value} onChange={onSubtitleChange} helperText={subtitleValue.helperText}
            error={subtitleValue.isError}
          />
        </div>

        {type.includes('file') &&
          <>
            <p style={{marginTop:"30px"}}>첨부파일</p>
            <FileDropZone
              {...{files, setFiles, setDeletedFiles}}
              maxSize={MAX_FILE_SIZE} maxFiles={MAX_FILE_COUNT}
              style={{marginTop:"10px"}}
            />
          </>
        }
        

        {(type.includes("single") || type.includes("multiple") || type==="list_select") &&
          <>
            <div className={styles.input_container}>
            <TextField id='standard-basic' label='옵션 추가'
              variant='standard'
              value={textInput} onChange={onTextInputChange}
              helperText={textFieldHelperText}
              error={isTextFieldHelperTextError}
            />
            <Button variant="text" sx={{mt: 1.5}} onClick={onAddClick}>추가</Button>
          </div>

          <SortableComponent items={items} setItems={setItems} components={components} setComponents={setComponents} mode="y" ulStyle={{ display: "flex", maxWidth:"400px", flexWrap:"wrap" }} pressDelay={150} />
            
          </>
        }
        {type.includes("date_time") && 
          <>
          <FormControl style={{width:"100%", marginTop:"20px"}}>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={items}
              onChange={onItemChange}
            >
              <FormControlLabel value="date" control={<Radio />} label="날짜" />
              <FormControlLabel value="time" control={<Radio />} label="시간" />
              <FormControlLabel value="date_time" control={<Radio />} label="날짜 및 시간" />

            </RadioGroup>
          </FormControl>
          </>
        }
        {(contentMode && type!=="text_area") &&
          <div style={{width:"100%"}}>
            <FormControlLabel control={<Checkbox />} label="필수 항목" checked={isRequired} onChange={(e) => setIsRequired(e.target.checked)} />
          </div>
        }

        <div className={styles.submit_button_container}>
          <Button variant="outlined" onClick={onSubmitClick} style={{ padding: "3px 10px" }}
            disabled={(type === "single_checkbox" || type === "multiple_checkbox" || type === "list_select") ?
              items.length === 0 || titleValue.value==="" : 
              type==="" ? true :
              titleValue.value === ""} >데이터 {id&&id!=="" ? "편집" : "삽입"}</Button>
        </div>
      </div>
      <div className={styles.image_container}>
        <Image src="/images/david_standing.png" width={200} height={350}/>
      </div>
    </div>
  )
}
export default AddDialog