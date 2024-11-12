import { useEffect } from 'react'

import { Grid, TextField, FormControl, InputLabel, Box, Button } from '@mui/material'
import * as Yup from 'yup'

import { useFormik } from 'formik'

import CustomPhoneInput from '@/Components/Common/CustomPhoneInput'
import TextEditor from '@/Components/Common/TextEditor'

const UserForm = ({ mode = 'add', data, createData = () => {}, updateData = () => {}, singleId, viewData }) => {
  const userForm = useFormik({
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

  console.info(userForm?.values)

  useEffect(() => {
    if (singleId && mode === 'edit') {
      viewData(singleId).then(res => {
        userForm.setValues({
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
            value={userForm.values.title}
            onChange={userForm.handleChange}
            onBlur={userForm.handleBlur}
            error={userForm.touched.title && Boolean(userForm.errors.title)}
            helperText={userForm.touched.title && userForm.errors.title}
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
            value={userForm.values.title}
            onChange={userForm.handleChange}
            onBlur={userForm.handleBlur}
            error={userForm.touched.title && Boolean(userForm.errors.title)}
            helperText={userForm.touched.title && userForm.errors.title}
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
          value={userForm.values.details}
          onChange={userForm.handleChange}
          autoFocus
          fullWidth
          width='22vw'
          quilleditor
          simpleeditor
          formikForm={userForm}
        />
      </Grid>
      <Grid item xs={12} py={6}>
        <Box display='flex' justifyContent='flex-end' gap={4}>
          <Button variant='outlined' color='error' type='reset' onClick={() => userForm.handleReset()}>
            Cancel
          </Button>
          <Button variant='contained' onClick={() => userForm.handleSubmit()}>
            {mode === 'add' ? 'Create' : 'Save'}
          </Button>
        </Box>
      </Grid>
    </Grid>
  )
}

export default UserForm
