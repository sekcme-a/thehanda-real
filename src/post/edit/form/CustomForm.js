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
import { STORAGE } from "src/public/hooks/storageCRUD";
import useData from "context/data";


const CustomForm = ({formData, setFormData, teamName, contentMode, id, docId}) => {

  const {team} = useData()
  const [openDialog, setOpenDialog] = useState(false)
  const handleCloseDialog = () => { setOpenDialog(false); };
  const onAddClick = () => { setSelectedFormId("") ; setOpenDialog(true) }

  const [componentData, setComponentData] = useState([])
  const [triggerDelete, setTriggerDelete] = useState("")

  const [triggerCopy, setTriggerCopy] = useState("")

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
    if(selectedIndex===null){
      alert(`편집한 폼을 찾을 수 없습니다.\nError: 101AspefCFeditFormData`)
      return
    }
    setFormData([...tempFormData])
    const tempComponentData = componentData?.map((compo, index) => {
      if(selectedIndex === index){
        return(renderComponent(data))
      } else return compo
    })
    setComponentData([...tempComponentData])
  }


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

  useEffect(()=> {
    if(triggerCopy!=="") {
      let selectedIndex = null
      formData?.map((form, index) => {
        if(form.id === triggerCopy) {
          selectedIndex = index
        }
      })
      if(selectedIndex===null) {
        alert(`편집한 폼을 찾을 수 없습니다.\nError: 101AspefCFcopyForm`); return
      }
      const tempFormData = [...formData, {...formData[selectedIndex], id: `${formData[selectedIndex].id}_copy`}]
      const tempCompoData = [...componentData, renderComponent({...formData[selectedIndex], id: `${formData[selectedIndex].id}_copy`})]
      setFormData(tempFormData)
      setComponentData(tempCompoData)
    }

  },[triggerCopy])

  const onMenuClick =async  (id,mode, type) => {
    if(mode==="삭제"){
      if(type==="file"){
        if(confirm("해당 폼을 삭제하시겠습니까? 파일 폼을 삭제하실 경우 기존에 업로드되었던 파일들이 모두 삭제됩니다.")){
          await STORAGE.deleteFolderAndChildFolder(`contents/${team.id}/${docId}/result_files`)
          // setTriggerDelete(id)
        }
      }else {
        if(confirm("해당 폼을 삭제하시겠습니까?")){
          setTriggerDelete(id)
        }
      }
    }
    else if(mode==="복사"){
      setTriggerCopy(id)
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
        <h1><strong>{data.typeText || "가족구성원 선택"}</strong>{data.isRequired && "(필수)"}</h1>
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
        {data.type!=='family' &&
          <div className={styles.component_button_container} >
            <IconMenu
              handleMenuClick={(mode) => onMenuClick(data.id, mode, data.type)}
            />
          </div>
        }
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