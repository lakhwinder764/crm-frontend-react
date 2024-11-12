'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import TestListTable from './TestListTable'
import useTestApi from '@/api/test/useTestApi'

const UserList = () => {
  const { addTestData, updateTestData, deleteTestData, data, testData, viewTest, getCategories, categories } =
    useTestApi()

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TestListTable
          headingTitle='All Users'
          subtitle='list of users'
          initialColumns={[
            'select',
            'title',
            'created_by',
            'questions',
            'enrolment',
            'submission',
            'type',
            'status',
            'action'
          ]}
          tableData={data}
          addUserData={addTestData}
          deleteUserData={deleteTestData}
          categories={categories}
          getCategories={getCategories}
          title='Add new User'
        />
      </Grid>
    </Grid>
  )
}

export default UserList
