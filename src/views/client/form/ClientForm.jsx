import { useEffect, useState } from 'react'

import { Grid, TextField, FormControl, Box, Button, Typography, Autocomplete } from '@mui/material'
import * as Yup from 'yup'
import { useFormik } from 'formik'

import CustomPhoneInput from '@/Components/Common/CustomPhoneInput'

const ClientForm = ({ mode = 'add', data, createData = () => {}, updateData = () => {}, singleId, viewData }) => {
  const [selectedValue, setSelectedValue] = useState(null)

  console.info(selectedValue)

  const menuItems = [
    { value: 'option1', leftText: 'Left 1', rightText: 'Right 1' },
    { value: 'option2', leftText: 'Left 2', rightText: 'Right 2' },
    { value: 'option3', leftText: 'Left 3', rightText: 'Right 3' }
  ]

  const handleChange = (event, newValue) => {
    setSelectedValue(newValue) // Store the entire object or a specific value
  }

  const clientForm = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone_no: ''
    },
    validationSchema: Yup.object().shape({
      first_name: Yup.string()
        .required('First name is required')
        .matches(/^[A-Za-z]+$/, 'First name should only contain letters')
        .min(2, 'First name must be at least 2 characters long')
        .max(50, 'First name must not exceed 50 characters'),

      last_name: Yup.string()
        .required('Last name is required')
        .matches(/^[A-Za-z]+$/, 'Last name should only contain letters')
        .min(2, 'Last name must be at least 2 characters long')
        .max(50, 'Last name must not exceed 50 characters'),

      email: Yup.string().required('Email is required').email('Invalid email format'),

      phone_no: Yup.string().required('Phone number is required')
    }),
    onSubmit: values => {
      alert('hello')
      console.info(values)
    }
  })

  useEffect(() => {
    if (singleId && mode === 'edit') {
      viewData(singleId).then(res => {
        clientForm.setValues({
          first_name: res?.data?.payload?.title,
          last_name: res?.data?.payload?.details,
          email: 'lakhwinder456@gmail.com',
          phone_no: '6283581345'
        })
      })
    }
  }, [singleId, mode])

  return (
    <form onSubmit={clientForm.handleSubmit}>
      <Grid container xs={12}>
        <Grid item xs={6} px={2} py={1}>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <TextField
              size='small'
              name='first_name'
              label='First Name'
              value={clientForm.values.first_name}
              onChange={e => clientForm.setFieldValue('first_name', e.target.value)}
              onBlur={clientForm.handleBlur}
              error={clientForm.touched.first_name && Boolean(clientForm.errors.first_name)}
              helperText={clientForm.touched.first_name && clientForm.errors.first_name}
              fullWidth
              margin='normal'
            />
          </FormControl>
        </Grid>
        <Grid item xs={6} px={2} py={1}>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <TextField
              size='small'
              name='last_name'
              label='Last Name'
              value={clientForm.values.last_name}
              onChange={e => clientForm.setFieldValue('last_name', e.target.value)}
              onBlur={clientForm.handleBlur}
              error={clientForm.touched.last_name && Boolean(clientForm.errors.last_name)}
              helperText={clientForm.touched.last_name && clientForm.errors.last_name}
              fullWidth
              margin='normal'
            />
          </FormControl>
        </Grid>
        <Grid item xs={6} px={2} py={1}>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <TextField
              size='small'
              name='email'
              label='Email'
              value={clientForm.values.email}
              onChange={e => clientForm.setFieldValue('email', e.target.value)}
              onBlur={clientForm.handleBlur}
              error={clientForm.touched.email && Boolean(clientForm.errors.email)}
              helperText={clientForm.touched.email && clientForm.errors.email}
              fullWidth
              margin='normal'
            />
          </FormControl>
        </Grid>
        <Grid item xs={6} px={2} py={1}>
          <CustomPhoneInput form={clientForm} />
        </Grid>
        <Grid item xs={12} px={2} py={1}>
          <Autocomplete
            fullWidth
            size='small'
            value={selectedValue}
            onChange={handleChange}
            options={menuItems}
            getOptionLabel={option => option.leftText}
            renderOption={(props, option) => (
              <li {...props}>
                <span style={{ marginRight: 'auto' }}>{option.leftText}</span>
                <Box
                  component='span'
                  borderRadius={0.5}
                  py={1}
                  px={3}
                  sx={{
                    background: '#e8e8e8'
                  }}
                >
                  <Typography fontSize={12}>{option.rightText}</Typography>
                </Box>
              </li>
            )}
            renderInput={params => <TextField {...params} label='Select Option' />}
          />
        </Grid>
        <Grid item xs={12} py={6}>
          <Box display='flex' justifyContent='flex-end' gap={4}>
            <Button variant='outlined' color='error' type='reset' onClick={() => clientForm.handleReset()}>
              Cancel
            </Button>
            <Button type='submit' variant='contained'>
              {mode === 'add' ? 'Create' : 'Save'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  )
}

export default ClientForm
