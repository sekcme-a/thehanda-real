
import { Card, Grid, Box, Typography, CardContent, Button } from "@mui/material"


//mode ="title || button"
//mode 가 title 이면, title, content 만 작성
//button이면, button, content 만 작성
const CardContentCompo = ({mode="title", title="", buttonText="", buttonColor="primary", content="", handleClick}) => {

  if(mode==="title"){
    return(
      <>
        <Grid item xs={14} sm={6} lg={6}>
          <Card sx={{ cursor: 'pointer', height: "125px" }}>
            <Grid container sx={{height: '100%'}}>

              <Grid item xs={5}>
                <Box sx={{height: "100%", display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                  <img width={65} height={120} alt='david' src='/images/david_standing.png' />
                </Box>
              </Grid>

              <Grid item xs={7}>
                <CardContent>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography style={{wordBreak: "keep-all"}}>{title}</Typography>
                    </Box>
                    <Box sx={{textAlign:'right', mt: "10px"}}>
                      <h1 style={{fontSize:"30px"}}>{content}</h1>
                    </Box>
                  </CardContent>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </>
    )
  }
  if (mode==="button"){
    return(
      <>
        <Grid item xs={14} sm={6} lg={6}>
          <Card
            sx={{ cursor: 'pointer', height: "125px" }}
          >
            <Grid container sx={{ height: '100%' }}>
              <Grid item xs={5}>
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                  <img width={65} height={120} alt='add-role' src='/images/john_standing.png' />
                </Box>
              </Grid>
              <Grid item xs={7}>
                <CardContent>
                  <Box sx={{ textAlign: 'right' }}>
                    <Button
                      variant='contained'
                      sx={{ mb: 1, whiteSpace: 'nowrap' }}
                      color={buttonColor}
                      onClick={() => {
                        handleClick()
                      }}
                    >
                      {buttonText}
                    </Button>
                    <Typography style={{wordBreak: "keep-all"}}>{content}</Typography>
                  </Box>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </>
    )
  }
}

export default CardContentCompo