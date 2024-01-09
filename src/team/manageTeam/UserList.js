// ** React Imports
import { useEffect, useCallback, useState } from 'react'

// ** Next Images
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box';
import { DataGrid,GridToolbarQuickFilter  } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
// ** Icons Imports


// ** Styled component for the link for the avatar with image
const AvatarWithImageLink = styled(Link)(({ theme }) => ({
  marginRight: theme.spacing(3)
}))

// ** Styled component for the link for the avatar without image
const AvatarWithoutImageLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  marginRight: theme.spacing(3)
}))

const UserList = (props) => {
  // ** State
  const [pageSize, setPageSize] = useState(10)

  function QuickSearchToolbar() {
  return (
    <Box
      sx={{
        pt: 2,
        pl: 2,
        pb:1,
      }}
    >
      <GridToolbarQuickFilter />
    </Box>
  );
}

  
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <DataGrid
            autoHeight
            pagination
            rows={props.data}
            columns={props.columns}
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 50]}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            components={{ Toolbar: QuickSearchToolbar }}
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default UserList
