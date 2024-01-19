
import { useEffect, useState } from "react"
import styles from "./VerticalSmallSwiper.module.css"
import { useRouter } from "next/router"

const VerticalSmallSwiper = ({list, delay, handleClick}) => {
  const router = useRouter()
  const [number, setNumber] = useState(0)
  const [isShow, setIsShow] = useState(true)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsShow(false)
      setTimeout(()=> {
        setNumber((prevNumber) => (prevNumber + 1) % list.length);
      },500)
      setTimeout(()=> {
        setIsShow(true)
      },1000)
    }, delay);

    // Clear the interval on component unmount to avoid memory leaks
    return () => clearInterval(intervalId);
  }, [list]);


  return(
    <div className={styles.swiper_container}>
      {list.map((item, index) => {
        if(index===number)
        return(
          <div className={`${styles.item} ${isShow ? styles.isShow : styles.isHide}`} key={index}
            onClick={()=>handleClick(item)}
          >
            <p>{item.title}</p>
          </div>
        )
      })}
    </div>
  )
}

export default VerticalSmallSwiper