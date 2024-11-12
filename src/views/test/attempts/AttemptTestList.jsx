'use client'

// MUI Imports
import { useState } from 'react'

import Grid from '@mui/material/Grid'

// Component Imports
import { TabContext, TabList, TabPanel } from '@mui/lab'

import { Tab } from '@mui/material'

import useTestApi from '@/api/test/useTestApi'
import AttemptTestListTable from './AttemptTestListTable'
import FilterHeader from '@/components/globals/FilterHeader'
import AttemptGroupTestListTable from './AttemptGroupTestListTable'

const AttemptTestList = () => {
  const { addTestData, updateTestData, deleteTestData, data, testData, viewTest, getCategories, categories } =
    useTestApi()

  const [value, setValue] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <>
      <FilterHeader title='Attempts' subtitle='Mathematics Test' />
      <TabContext value={value}>
        <TabList onChange={handleChange} aria-label='simple tabs example'>
          <Tab value='1' label='Students' />
          <Tab value='2' label='Group of Students' />
        </TabList>
        <TabPanel value='1'>
          <AttemptTestListTable
            tableData={data}
            addUserData={addTestData}
            deleteUserData={deleteTestData}
            categories={categories}
            getCategories={getCategories}
          />
        </TabPanel>
        <TabPanel value='2'>
          <AttemptGroupTestListTable
            tableData={data}
            addUserData={addTestData}
            deleteUserData={deleteTestData}
            categories={categories}
            getCategories={getCategories}
          />
        </TabPanel>
      </TabContext>
    </>

    // <Grid container spacing={6}>
    //   <Grid item xs={12}>
    //     <AttemptTestListTable
    //       tableData={data}
    //       addUserData={addTestData}
    //       deleteUserData={deleteTestData}
    //       categories={categories}
    //       getCategories={getCategories}
    //     />
    //   </Grid>
    // </Grid>
  )
}

export default AttemptTestList
