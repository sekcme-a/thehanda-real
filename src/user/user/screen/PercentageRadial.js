// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

import dynamic from 'next/dynamic'
// ** Custom Components Imports
const ReactApexcharts = dynamic(() => import('react-apexcharts'), { ssr: false })


/*
  data={
    percentage: int,
    title: 상단 제목,
    subtitle: 하단 제목,
  }
*/
const EcommerceTotalSalesRadial = ({data}) => {
  // ** Hook
  const theme = useTheme()

  const options = {
    chart: {
      sparkline: { enabled: true }
    },
    stroke: { lineCap: 'round' },
    colors: [theme.palette.info.main],
    plotOptions: {
      radialBar: {
        endAngle: 90,
        startAngle: -90,
        hollow: { size: '60%' },
        // track: { background: theme.palette.customColors.trackBg },
        dataLabels: {
          name: { show: false },
          value: {
            offsetY: 0,
            fontWeight: 500,
            fontSize: '1.25rem',
            color: theme.palette.text.secondary
          }
        }
      }
    }
  }

  return (
    <Card>
      <CardContent>
        <Typography variant='h6' sx={{ mb: 1, textAlign:"center", wordBreak:"keep-all", fontSize:"15px"}}>
          {data.title}
        </Typography>
        <div style={{display:"flex", justifyContent:"center"}}>
        <ReactApexcharts type='radialBar' height={103} options={options} series={[data.percentage]} />
        </div>
        <Typography variant='body2' sx={{ mt: 3.5, fontWeight: 600, textAlign: 'center', color: 'text.primary' }}>
          {data.subtitle}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default EcommerceTotalSalesRadial
