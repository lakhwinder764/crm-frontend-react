'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import TestListTable from './TestListTable'

import useCategoryApi from '@/api/useCategoryApi'

const CategoriesList = () => {
  const { data, addCategoryData } = useCategoryApi()

  return (
    <Grid container spacing={6}>
      {/* <Grid item xs={12}>
        <UserListCards />
      </Grid> */}
      <Grid item xs={12}>
        <TestListTable tableData={data} addCategoryData={addCategoryData} />
      </Grid>
    </Grid>
  )
}

export default CategoriesList
