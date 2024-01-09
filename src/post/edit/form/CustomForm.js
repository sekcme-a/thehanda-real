import { useState, useEffect } from "react";
import styles from "./customForm.module.css"

import AddSetting from "./AddSetting"
import AddDialog from "./AddDialog"
import AddProfileFormDialog from "./AddProfileFormDialog"
// import SortableComponent from "src/components/admin/public/SortableComponent";
import SortableComponent from "src/public/components/SortableComponent"
  
import Dialog from '@mui/material/Dialog';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

import { arrayMoveImmutable } from 'array-move';


const CustomForm = ({formData, setFormData, teamName, contentMode, id}) => {
  const [openDialog, setOpenDialog] = useState(false)
  const handleCloseDialog = () => { setOpenDialog(false); };
  const [openProfileFormDialog, setOpenProfileFormDialog] = useState(false)
  const handleCloseProfileFormDialog = () => {setOpenProfileFormDialog(false)}
  const onAddClick = () => { setOpenDialog(true) }
  // const [formData, setFormData] = useState([])
  const onAddProfileFormClick = () => {setOpenProfileFormDialog(true)}

  const [componentData, setComponentData] = useState([])
  const [triggerDelete, setTriggerDelete] = useState("")


  const addFormData = (data) => {
    setFormData([...formData, data])
    // formDataNote= [...formData, data] 
    setComponentData([...componentData, renderComponent(data)])
    // componentDataNote= [...componentDataNote, renderComponent(data)] 
  }
  useEffect(() => {
    let temp = []
    for (let i = 0; i < formData.length; i++){
      temp.push(renderComponent(formData[i]))
    }
    setComponentData(temp)
  }, [])
  
  const onEditClick = (title) => {
    alert("아직 추가되지 않은 기능입니다.")
    //need update
  }
  const onDeleteClick = (docId) => {
    setTriggerDelete(docId)
  }

  useEffect(() => {
    for (let i = 0; i < formData.length; i++){
      if (triggerDelete === formData[i].id) {
        const temp = arrayMoveImmutable(formData, i, formData.length - 1)
        temp.pop()
        setFormData(temp)
        
        const temp2 = arrayMoveImmutable(componentData, i, componentData.length - 1)
        temp2.pop()
        setComponentData(temp2)
      }
    }
    console.log(teamName)
    console.log(triggerDelete)
    // firebaseHooks.delete_form_item_from_profile_settings(teamName, triggerDelete)
    console.log("triggerdelete")
  },[triggerDelete])

  const renderComponent = (data) => {
    return(
      <div className={`${styles.component_container} ${styles.single_checkbox_container}`}>
        {data.profile && <h1><strong>[프로필 데이터]</strong></h1>}
        <h1><strong>{data.typeText}</strong></h1>
        {data.type !== "text_area" && <h2>제목 : {data.title}</h2>}
        {data.subtitle!=="" && <h2>부가내용 : {data.subtitle}</h2>}
        {console.log(data.text)}
        {(data.text!=="" && data.text!==undefined) && data.type!=="text_area" && <h2>추가 문구 : </h2>}
        


        {typeof (data.items) === "object" && data.items.length!==0 &&
          <h3>
            옵션 :
            <ul>
              {data.items.map((item, index) => (
                <li key={index}>{`${item},`}</li>
              ))}
            </ul>
          </h3>
        }
        {data.isRequired && <h1>필수 항목</h1>}
        {/* <div>
          {data.type === "single_checkbox" && 
            <>

            </>
          }
        </div> */}
        <div className={styles.component_button_container} >
          {/* <EditRoundedIcon sx={{ mr: "2px" }} onClick={()=>onEditClick(data.title)} /> */}
          <DeleteRoundedIcon onClick={()=>onDeleteClick(data.id)} />
        </div>
      </div>
    )
  }
  
  return (
    <>
      <SortableComponent items={formData} setItems={setFormData}
        components={componentData} setComponents={setComponentData} mode="y" ulStyle={{ width: "100%" }} pressDelay={150} />
      <AddSetting onAddClick={onAddClick} />
      <div style={{marginTop: "10px", width:"100%"}}> </div>
      {/* {contentMode && <AddSetting onAddClick={onAddProfileFormClick} text="프로필에서 추가"/>} */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth={"lg"} >
        <AddDialog addFormData={addFormData} handleCloseDialog={handleCloseDialog} formData={formData} teamName={teamName} contentMode={contentMode} id={id} />
      </Dialog>
      <Dialog open={openProfileFormDialog} onClose={handleCloseProfileFormDialog} maxWidth={"lg"} >
        <AddProfileFormDialog addFormData={addFormData} handleCloseDialog={handleCloseProfileFormDialog} formData={formData} teamName={teamName} />
      </Dialog>
    </>
  )
}
export default CustomForm