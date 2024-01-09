import styles from "./stepper.module.css"
import { useEffect, useState } from "react"
import { firestore as db } from "firebase/firebase"

/**
 * step={int} handleStep={setStep} data=[제목, 제목, 제목...]
 */
const Stepper = ({step, handleStep, data}) => {

  const onItemClick = (index) => {
    handleStep(index)
  }
  return(
    <div className={styles.stepper_container}>
      {data.map((item, index) => {
        return(
          <>
            <div className={styles.item_container} key={index} onClick={()=>onItemClick(index)}>
              <div className={step===index ? `${styles.circle} ${styles.active}`: styles.circle}>{index+1}</div>
              <h1 className={step===index ? `${styles.title} ${styles.active}` : styles.title}>{item}</h1>
            </div>
            {index!==data.length-1 && <div className={styles.border}></div>}
          </>
        )
      })}
    </div>
  )
}

export default Stepper