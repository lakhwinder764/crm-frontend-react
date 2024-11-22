'use client'
import React, { useEffect, useState } from 'react'

import { useSearchParams } from 'next/navigation'

import {
  TextField,
  Typography,
  Box,
  Grid,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
  CardContent
} from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useTheme } from '@mui/material/styles'

import FilterHeader from '@/components/globals/FilterHeader'
import WorkflowStepper from '@/Components/Common/WorkFlowStepper'

const AddEditWorkFlow = () => {
  const theme = useTheme()
  const searchParams = useSearchParams()
  const mode = searchParams?.get('mode')

  console.info(mode === 'add')

  const [steps, setSteps] = useState([])

  const formik = useFormik({
    initialValues: {
      textField: '',
      radioButton: 'all_offices'
    },
    validationSchema: Yup.object({
      textField: Yup.string().required('This field is required'),
      radioButton: Yup.string().required('You must select an option')
    }),
    onSubmit: values => {
      console.log('Form values:', values)
    }
  })

  useEffect(() => {
    if (mode === 'add') {
      setSteps([
        { label: 'Steps 1', description: '' },
        { label: 'Steps2', description: '' }
      ])
    } else {
      setSteps([
        { label: 'Edit Step', description: '' },
        { label: 'Edit Step34', description: '' }
      ])
      formik.setValues({
        textField: 'Edit Textfields',
        radioButton: 'selected_offices'
      })
    }
  }, [mode])

  return (
    <>
      <FilterHeader title={mode === 'add' ? 'Add Workflow' : 'Edit Workflow'} />
      <Card>
        <CardContent>
          <Grid container xs={12}>
            <Grid item xs={12} py={2}>
              <Typography fontWeight='bold'>
                Workflow Name <span style={{ color: theme?.palette?.error?.main }}>*</span>
              </Typography>
              <TextField
                size='small'
                name='textField'
                value={formik.values.textField}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.textField && Boolean(formik.errors.textField)}
                helperText={formik.touched.textField && formik.errors.textField}
                fullWidth
                margin='normal'
              />
            </Grid>
            <Grid item xs={12} py={2}>
              <FormControl
                component='fieldset'
                error={formik.touched.radioButton && Boolean(formik.errors.radioButton)}
              >
                <FormLabel component='legend'>
                  <Typography fontWeight='bold'>
                    Workflow is accessible to <span style={{ color: theme?.palette?.error?.main }}>*</span>
                  </Typography>
                </FormLabel>
                <RadioGroup
                  aria-label='options'
                  name='radioButton'
                  value={formik.values.radioButton}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <FormControlLabel value='all_offices' control={<Radio />} label='All Offices' />
                  <FormControlLabel value='selected_offices' control={<Radio />} label='Selected Offices' />
                </RadioGroup>
                {formik.touched.radioButton && formik.errors.radioButton && (
                  <div style={{ color: 'red', fontSize: '0.875rem' }}>{formik.errors.radioButton}</div>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={6} py={3}>
              <Box display='flex' flexDirection='column' justifyContent='center' flexGrow={1}>
                <Typography fontWeight='bold'>
                  Workflow Stages <span style={{ color: theme?.palette?.error?.main }}>*</span>
                </Typography>
                <WorkflowStepper readOnly={false} steps={steps} setSteps={setSteps} />
              </Box>
            </Grid>
            <Grid item xs={12} display='flex' justifyContent='flex-end' alignItems='center' gap={3}>
              <Button
                onClick={() => {
                  formik.handleReset()
                  setSteps([
                    { label: '', description: '' },
                    { label: '', description: '' }
                  ])
                }}
                variant='outlined'
                color='error'
              >
                Reset
              </Button>
              <Button onClick={() => formik.handleSubmit()} variant='contained' color='primary'>
                Submit
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

export default AddEditWorkFlow
