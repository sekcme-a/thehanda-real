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
import EditIcon from '@mui/icons-material/Edit';

import { arrayMoveImmutable } from 'array-move';
import IconMenu from "src/public/mui/IconMenu";


const CustomForm = ({formData, setFormData, teamName, contentMode, id}) => {
  const [openDialog, setOpenDialog] = useState(false)
  const handleCloseDialog = () => { setOpenDialog(false); };
  const onAddClick = () => { setSelectedFormId("") ; setOpenDialog(true) }

  const [componentData, setComponentData] = useState([])
  const [triggerDelete, setTriggerDelete] = useState("")

  const [selectedFormId, setSelectedFormId] = useState("")


  const addFormData = (data) => {
    setFormData([...formData, data])
    setComponentData([...componentData, renderComponent(data)])
  }

  const editFormData = (data) => {
    let selectedIndex = null
    const tempFormData = formData?.map((form, index) => {
      if(form.id === data.id) {
        selectedIndex = index
        return data
      }
      else return form
    })
    if(selectedIndex===null) alert(`편집한 폼을 찾을 수 없습니다.\nError: 101AspefCF`)
    setFormData([...tempFormData])
    const tempComponentData = componentData?.map((compo, index) => {
      if(selectedIndex === index){
        return(renderComponent(data))
      } else return compo
    })
    setComponentData([...tempComponentData])
  }

  useEffect(() => {
    console.log(formData)
  },[formData])

  useEffect(() => {
    let temp = []
    for (let i = 0; i < formData.length; i++){
      temp.push(renderComponent(formData[i]))
    }
    setComponentData(temp)
  }, [])
  

  //폼 삭제
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
  },[triggerDelete])

  const onMenuClick = (id,mode) => {
    if(mode==="삭제"){
      if(confirm("해당 폼을 삭제하시겠습니까?")){
        setTriggerDelete(id)
      }
    }
    else if (mode === "편집"){
      setSelectedFormId(id)
      setOpenDialog(true)
    }
  }

  const renderComponent = (data) => {
    return(
      <div className={`${styles.component_container} ${styles.single_checkbox_container}`}>
        {data.profile && <h1><strong>[프로필 데이터]</strong></h1>}
        <h1><strong>{data.typeText}</strong></h1>
        <h2>제목 : {data.title}</h2>
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
          <IconMenu
            handleMenuClick={(mode) => onMenuClick(data.id, mode)}
          />
          {/* <EditIcon style={{color:"rgb(135, 135, 135)"}}/> */}
          {/* <EditRoundedIcon sx={{ mr: "2px" }} onClick={()=>onEditClick(data.title)} /> */}
          {/* <DeleteRoundedIcon onClick={()=>onDeleteClick(data.id)} /> */}
        </div>
      </div>
    )
  }
  
  return (
    <>
      <SortableComponent items={formData} setItems={setFormData}
        components={componentData} setComponents={setComponentData}
        mode="y" ulStyle={{ width: "100%" }} pressDelay={150}
      />
      <AddSetting onAddClick={onAddClick} />
      <div style={{marginTop: "10px", width:"100%"}}> </div>
      {/* {contentMode && <AddSetting onAddClick={onAddProfileFormClick} text="프로필에서 추가"/>} */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth={"lg"} >
        <AddDialog addFormData={addFormData} handleCloseDialog={handleCloseDialog}
          formData={formData} editFormData={editFormData} teamName={teamName} contentMode={contentMode} id={selectedFormId} />
      </Dialog>
    </>
  )
}
export default CustomForm