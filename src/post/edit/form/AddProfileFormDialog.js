import { useState, useEffect } from "react"
import Image from "next/image"
import { firestore as db } from "firebase/firebase"
import styles from "./customForm.module.css"
import useData from "context/data"

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



const AddDialog = ({addFormData, handleCloseDialog}) => {
  const [type, setType] = useState('')
  const [typeText, setTypeText] = useState('')
  const {teamId} = useData()

  const [helperText, setHelperText] = useState('')

  const [items, setItems] = useState([])

  const [isRequired, setIsRequired] = useState(false)

  const onItemChange = (e) => { setItems(e.target.value) }
  
  useEffect(() => {
    db.collection("team").doc(teamId).collection("profileSettings").doc("main").get().then((doc) => {
      setItems([...doc.data()])
    })
  },[])

  const onSubmitClick = async() => {
      try {
        addFormData({
          id: items[type].id,
          type: items[type].type,
          typeText: items[type].typeText,
          title: items[type].title,
          items: items[type].items,
          profile: true,
          isRequired: isRequired
        })
        handleCloseDialog()
      } catch (e) {
        alert(e)
        console.log(e)
      }
  }

  const handleChange = event => {
    setType(event.target.value)
    const index = event.target.value
    setHelperText(`${items[index].typeText}
    ${items[index].items.length !== 0 && typeof(items[index].items)==="object" ?
      `: ${items[index].items.join()}`
      :
      ""
    }`)
  }

  return (
    <div className={styles.add_dialog_container}>
      <div className={styles.content_container}>
        <h3>추가할 프로필 내용을 선택하세요.</h3>
        <h4 style={{marginTop:"5px", fontSize:"14px"}}>사용자가 해당 프로필을 작성했을 경우 자동으로 답변이 채워집니다.</h4>
        <div className={styles.form_control_container}>
          <FormControl variant='standard' className={styles.form_control}>
            <InputLabel id='demo-simple-select-label'>입력 타입</InputLabel>
            <Select label='Age' labelId='demo-simple-select-label' id='demo-simple-select' onChange={handleChange} defaultValue='' value={type}>
              {items.map((item, index) => {
                return (
                  <MenuItem key={index} value={index}>{item.title}</MenuItem>
                )
              })}
            </Select>
            <FormHelperText style={{color: "blue", width:"400px"}}>{helperText}</FormHelperText>
          </FormControl>
        </div>
          <div style={{width:"100%"}}>
            <FormControlLabel control={<Checkbox />} label="필수 항목" checked={isRequired} onChange={(e) => setIsRequired(e.target.checked)} />
          </div>

        <div className={styles.submit_button_container}>
          <Button variant="outlined" onClick={onSubmitClick} style={{ padding: "3px 10px" }}
            disabled={type===""} >데이터 삽입</Button>
        </div>
      </div>
      <div className={styles.image_container}>
        <Image src="/david_standing.png" width={200} height={350}/>
      </div>
    </div>
  )
}
export default AddDialog