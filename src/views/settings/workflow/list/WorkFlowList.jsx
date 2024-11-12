'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import useTestApi from '@/api/test/useTestApi'
import TestListTable from '@/views/test/list/TestListTable'

const WorkFlowList = () => {
  const { addTestData, updateTestData, deleteTestData, data, testData, viewTest, getCategories, categories } =
    useTestApi()

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TestListTable
          headingTitle='Workflows'
          subtitle='Workflow List'
          initialColumns={['enrolment', 'submission', 'type', 'status', 'action']}
          tableData={data}
          addUserData={addTestData}
          deleteUserData={deleteTestData}
          categories={categories}
          getCategories={getCategories}
          workFlow={true}
          title='Add New WorkFlow'
        />
      </Grid>
    </Grid>
  )
}

export default WorkFlowList
