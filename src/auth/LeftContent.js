import Image from "next/image"
import styles from "./LeftContent.module.css"

const LeftContent = () => {
  return(
    <>
      <div className={styles.logo_container}>
        <div className={styles.logo_image}><Image src="/images/logo.png" alt="로고" objectFit="contain" fill/></div>
        <h1>2Z Soft</h1>
      </div>
      <div className={styles.img_container}>
        <Image src="/images/login_bg.png" alt="배경화면" objectFit="contain" fill/>
        {/* <img src="/images/login_bg.png" alt="배경화면" /> */}
      </div>
    </>
  )
}

export default LeftContent