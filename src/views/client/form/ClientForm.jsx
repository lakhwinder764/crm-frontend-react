import { useEffect } from 'react'

import { Grid, TextField, FormControl, InputLabel, Box, Button } from '@mui/material'
import * as Yup from 'yup'

import { useFormik } from 'formik'

import CustomPhoneInput from '@/Components/Common/CustomPhoneInput'
import TextEditor from '@/Components/Common/TextEditor'

const ClientForm = ({ mode = 'add', data, createData = () => {}, updateData = () => {}, singleId, viewData }) => {
  const clientForm = useFormik({
    initialValues: {
      title: '',
      details: '',
      type: '',
      category: ''
    },
    validationSchema: Yup.object({
      title: Yup.string().required('This field is required'),
      details: Yup.string().required('This field is required')
    }),
    onSubmit: values => {
      mode === 'add' ? createData(values) : updateData(singleId, values)
    }
  })

  console.info(clientForm?.values)

  useEffect(() => {
    if (singleId && mode === 'edit') {
      viewData(singleId).then(res => {
        clientForm.setValues({
          title: res?.data?.payload?.title,
          details: res?.data?.payload?.details
        })
      })
    }
  }, [singleId, mode])

  return (
    <Grid container xs={12}>
      <Grid item xs={6} px={2} py={1}>
        <FormControl fullWidth sx={{ mb: 6 }}>
          <InputLabel shrink id='title'>
            Title
          </InputLabel>
          <TextField
            size='small'
            name='title'
            value={clientForm.values.title}
            onChange={clientForm.handleChange}
            onBlur={clientForm.handleBlur}
            error={clientForm.touched.title && Boolean(clientForm.errors.title)}
            helperText={clientForm.touched.title && clientForm.errors.title}
            fullWidth
            margin='normal'
          />
        </FormControl>
      </Grid>
      <Grid item xs={6} px={2} py={1}>
        <FormControl fullWidth sx={{ mb: 6 }}>
          <InputLabel shrink id='title'>
            Title
          </InputLabel>
          <TextField
            size='small'
            name='title'
            value={clientForm.values.title}
            onChange={clientForm.handleChange}
            onBlur={clientForm.handleBlur}
            error={clientForm.touched.title && Boolean(clientForm.errors.title)}
            helperText={clientForm.touched.title && clientForm.errors.title}
            fullWidth
            margin='normal'
          />
        </FormControl>
      </Grid>
      <Grid item xs={6} px={2} py={2}>
        <CustomPhoneInput />
      </Grid>
      <Grid item xs={12} px={2} py={3}>
        <TextEditor
          size='small'
          value={clientForm.values.details}
          onChange={clientForm.handleChange}
          autoFocus
          fullWidth
          width='22vw'
          quilleditor
          simpleeditor
          formikForm={clientForm}
        />
      </Grid>
      <Grid item xs={12} py={6}>
        <Box display='flex' justifyContent='flex-end' gap={4}>
          <Button variant='outlined' color='error' type='reset' onClick={() => clientForm.handleReset()}>
            Cancel
          </Button>
          <Button variant='contained' onClick={() => clientForm.handleSubmit()}>
            {mode === 'add' ? 'Create' : 'Save'}
          </Button>
        </Box>
      </Grid>
    </Grid>
  )
}

export default ClientForm
