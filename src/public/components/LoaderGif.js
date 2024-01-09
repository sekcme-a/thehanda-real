import Image from "next/image"
// import loader from "public/loader_multiculture.gif"

const LoaderGif = (props) => {

  const container={
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "fixed",
    top: "0",
    left: "0",
    backgroundColor: "white",
    zIndex: "99999999"
  }
  return (
    <div style={container}>
      <Image src="/images/loader_multiculture.gif" alt="loader" width={400} height={300}/>
    </div>
  )
}

export default LoaderGif