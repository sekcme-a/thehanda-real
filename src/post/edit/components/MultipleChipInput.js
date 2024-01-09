import { useEffect, useState } from "react"

import SelectMultipleChip from "./SelectMultipleChip"
import { useRouter } from "next/router"

import { firestore as db } from "firebase/firebase"

const MultipleChipInput = ({postValues, setPostValues, type}) => {
  const router = useRouter()
  const {id} = router.query
  const [sections, setSections] = useState([])
  const [sectionItems, setSectionItems] = useState([])
  const [selectedSections, setSelectedSections] = useState([])


  useEffect(()=>{

    const fetchSection = async() => {
      const sectionDoc = await db.collection("team").doc(id).collection("sections").doc(type).get()
      if(sectionDoc.exists)
        setSections(sectionDoc.data().data)
      else{
        alert("섹션을 1개이상 생성해주세요.")
        router.push(`/${id}/section/${type}`)
        return
      }
      const sectionsNameArray = sectionDoc.data().data.map(section=>section.name)
      setSectionItems(sectionsNameArray)
      
      if(postValues.selectedSections){
        const selectedSectionNameArray = await Promise.all(postValues.selectedSections.map(section => {
          if (sectionDoc.data().data.some(item => item.id === section.id)) {
            return section.name;
          }
        }).filter(Boolean));
        console.log(selectedSectionNameArray)
        if(selectedSectionNameArray[0])
          setSelectedSections(selectedSectionNameArray)
      }
    }
    fetchSection()
  },[])

  //Handle section_select value************
  useEffect(()=>{
    const selected = sections.map(item => {
      for (const selectedSection of selectedSections) {
        if (selectedSection === item.name) {
          return {name: item.name, id: item.id}
        }
      }
    }).filter(Boolean);
    setPostValues(prevValues => ({...prevValues, selectedSections: selected}))
  },[selectedSections])



  return(
    <div style={CHECKBOXSTYLE}>
      <SelectMultipleChip title="섹션선택" items={sectionItems} selectedItems={selectedSections} setSelectedItems={setSelectedSections}/>

    </div>
  )
}

const CHECKBOXSTYLE = {
  display:"flex",
  alignItems:"center",
  marginRight:"15px"
}

export default MultipleChipInput