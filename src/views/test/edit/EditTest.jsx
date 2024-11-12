'use client'
import React, { useEffect, useState } from 'react'

import { useSearchParams, useRouter } from 'next/navigation'

import { useForm, Controller } from 'react-hook-form'

import { Box, Card, CardContent, FormControlLabel, Grid, IconButton, Radio, Tab, Typography } from '@mui/material'

import Select from '@mui/material/Select'
import * as Yup from 'yup'

import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import CircularProgress from '@mui/material/CircularProgress'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

import CustomTabList from '@core/components/mui/TabList'

import { useFormik } from 'formik'

import useTestApi from '@/api/test/useTestApi'
import FilterHeader from '@/components/globals/FilterHeader'
import QuestionGeneralSettings from '../manage/QuestionGeneralSettings'
import QuestionGeneralSettingsTimingSection from '../manage/QuestionGeneralSettingsTimerSection'
import QuestionResultSettings from '../manage/QuestionResultSettings'
import QuestionTestInstructions from '../manage/QuestionTestInstructions'
import WeightedMarksSettings from '../attempts/WeightedMarksSettings'

// API import

const EditTest = ({ isLoading = false }) => {
  const [types, setTypes] = useState(null)
  const [activeTab, setActiveTab] = useState('edit_details') // Ensure activeTab is initialized properly

  const searchParams = useSearchParams()
  const guid = searchParams.get('guid')
  const router = useRouter()

  //   const [data, setData] = useState(null)

  // useForm hook
  const editTestForm = useFormik({
    initialValues: {
      title: '',
      details: ''
    },
    validationSchema: Yup.object({
      title: Yup.string().required('This field is required'),
      details: Yup.string().required('This field is required')
    }),
    onSubmit: values => {
      updateTestData(guid, values)
    }
  })

  const { viewTest, updateTestData } = useTestApi()

  // Fetch data and populate form on component mount
  useEffect(() => {
    if (guid) {
      viewTest(guid).then(res => {
        setTypes(String(res?.data?.payload?.type))
        editTestForm.setValues({
          title: res?.data?.payload?.title,
          type: res?.data?.payload?.type
        })
      })
    }
  }, [guid])

  return (
    <>
      <FilterHeader title='Test Settings' subtitle='Mathematics Test' />
      <Grid container xs={12}>
        <Grid item xs={12}>
          <Grid container spacing={5} xs={12}>
            <Grid item xs={12}>
              <Card
                sx={{
                  paddingTop: 5,
                  paddingBottom: 5
                }}
              >
                <CardContent>
                  <Grid item xs={12} py={1}>
                    <FormControl fullWidth sx={{ mb: 6 }}>
                      <InputLabel shrink id='title'>
                        Title
                      </InputLabel>
                      <TextField
                        size='small'
                        name='title'
                        value={editTestForm.values.title}
                        onChange={editTestForm.handleChange}
                        onBlur={editTestForm.handleBlur}
                        error={editTestForm.touched.title && Boolean(editTestForm.errors.title)}
                        helperText={editTestForm.touched.title && editTestForm.errors.title}
                        fullWidth
                        margin='normal'
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} py={2}>
                    <FormControl fullWidth sx={{ mb: 6 }}>
                      <InputLabel shrink id='details'>
                        Description
                      </InputLabel>
                      <TextField
                        size='small'
                        name='details'
                        multiline
                        rows={4}
                        value={editTestForm.values.details}
                        onChange={editTestForm.handleChange}
                        onBlur={editTestForm.handleBlur}
                        error={editTestForm.touched.details && Boolean(editTestForm.errors.details)}
                        helperText={editTestForm.touched.details && editTestForm.errors.details}
                        fullWidth
                        margin='normal'
                      />
                    </FormControl>
                  </Grid>
                </CardContent>
              </Card>
              <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }} py={3}>
                <Button
                  size='small'
                  onClick={() => editTestForm.handleSubmit()}
                  variant='contained'
                  disabled={isLoading}
                  sx={{ mr: 2 }}
                >
                  {isLoading && <CircularProgress color='inherit' size={20} sx={{ mr: 2 }} />}
                  Save Changes
                </Button>
                {/* <Button size='large' variant='outlined' color='secondary' onClick={() => {}}>
              Cancel
            </Button> */}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default EditTest
