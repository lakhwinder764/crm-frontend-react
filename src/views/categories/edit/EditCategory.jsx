'use client'
import React, { useEffect, useState } from 'react'

import { useSearchParams, useRouter } from 'next/navigation'

import { useForm, Controller } from 'react-hook-form'

import { Box, Card, CardContent, FormControlLabel, Grid, IconButton, Radio, Typography } from '@mui/material'

import Select from '@mui/material/Select'

import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import CircularProgress from '@mui/material/CircularProgress'

import useCategoryApi from '@/api/useCategoryApi'

// API import

const EditCategory = ({ isLoading = false }) => {
  const [types, setTypes] = useState(null)
  const [parentCategories, setParentCategories] = useState([])
  const searchParams = useSearchParams()
  const guid = searchParams?.get('guid')
  const router = useRouter()
  const [routing, setRouting] = useState(false)

  //   const [data, setData] = useState(null)

  // useForm hook
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm()

  const { data, viewCategory, updateCategoryData } = useCategoryApi()


  // Fetch data and populate form on component mount
  useEffect(() => {
    if (guid) {
      viewCategory(guid).then(res => {
        setTypes(res?.data?.payload?.parent_guid)
        reset({
          title: res?.data?.payload?.title,

          // type: res?.data?.payload?.type,
          // details: res?.data?.payload?.details,
          parent_guid: res?.data?.payload?.parent_guid
        })
        console.log(res?.data?.payload?.type, 'sss')
      })
    }

    const parentCategories = Object.values(data)?.filter(category => category?.parent_guid === null)

    setParentCategories(parentCategories) // Set the filtered parent categories
    // setTypes(String(payload.type)) // Set the type from the payload
  }, [guid, reset, data])
  console.log(parentCategories, 'ss')

  const handleFormSubmit = async data => {
    updateCategoryData(guid, { ...data, type: types })
    setRouting(true)

    // router.push('/categories/list')
  }

  if (routing) {
    router.push('/categories/list')
  }

  console.log(types, 'cccc')
  
return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container spacing={5} xs={12}>
          <Grid item xs={12} display='flex' alignItems='center'>
            <IconButton onClick={() => router.push('/test/list')}>
              <i class='ri-arrow-left-line'></i>
            </IconButton>
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: 18
              }}
            >
              Edit Category
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Card
              sx={{
                paddingTop: 5,
                paddingBottom: 10
              }}
            >
              <CardContent>
                <Grid item xs={12} py={3}>
                  <Controller
                    name='title'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        label='Title'
                        InputLabelProps={{
                          shrink: true
                        }}
                        {...field}
                        error={Boolean(errors.title)}
                        helperText={errors.title ? errors.title.message : ''}
                      />
                    )}
                  />

                  {/* <FormControl fullWidth>
                    <label>Title</label>
                    <Controller
                      name='title'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          error={Boolean(errors.title)}
                          helperText={errors.title ? errors.title.message : ''}
                        />
                      )}
                    />
                  </FormControl> */}
                </Grid>
                {/* <Grid item xs={12} py={3}>
                  <FormControl fullWidth sx={{ mb: 6 }}>
                    <InputLabel shrink id='typeLabel'>
                      Parent Category
                    </InputLabel>
                    <Controller
                      name='parent_guid' // Make sure this matches the form data
                      control={control}
                      render={({ field }) => (
                        <TextField
                          fullWidth
                          select
                          label='Parent Category'
                          labelId='typeLabel'
                          {...field} // Spread field to connect to react-hook-form
                          error={Boolean(errors.parent_guid)}
                        >
                          <MenuItem value=''>
                            <em>None</em>
                          </MenuItem>
                          {parentCategories.map(category => (
                            <MenuItem key={category.guid} value={category.guid}>
                              {category.title}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                    {errors.parent_guid && <Typography color='error'>{errors.parent_guid.message}</Typography>}
                  </FormControl>
                </Grid> */}
                <Grid item xs={12} py={3}>
                  <FormControl fullWidth sx={{ mb: 6 }}>
                    <label>Description</label>
                    <Controller
                      name='details'
                      control={control}
                      render={({ field }) => (
                        <TextField

                          // {...field}
                          multiline
                          rows={4}
                          error={Boolean(errors.details)}
                          helperText={errors.details ? errors.details.message : ''}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} py={3}>
                  <FormControl fullWidth sx={{ mb: 6 }}>
                    <InputLabel shrink id='parentCategoryLabel'>
                      Parent Category
                    </InputLabel>
                    <Controller
                      name='parent_guid' // Make sure this matches the form data
                      control={control}
                      render={({ field }) => (
                        <TextField
                          fullWidth
                          select

                          // label='Parent Category'
                          labelId='parentCategoryLabel'
                          {...field}
                          error={Boolean(errors.parent_guid)}
                          value={field.value || types} // Use types as the default value
                        >
                          {parentCategories?.map(category => (
                            <MenuItem key={category?.guid} value={category?.guid}>
                              {category?.title}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                    {errors.parent_guid && <Typography color='error'>{errors.parent_guid.message}</Typography>}
                  </FormControl>
                </Grid>
                {/* <Grid item xs={12} py={3}>
                  <Controller
                    name='type'
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Radio
                            {...field}
                            size='medium'
                            value={field?.type}
                            // eslint-disable-next-line lines-around-comment
                            // checked={field.choice}
                            checked={field?.type === 'evaluated' ? true : false}
                          />
                        }
                        label='Evaluated'
                      />
                    )}
                  />
                </Grid> */}
                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }} py={3}>
                  <Button size='large' type='submit' variant='contained' disabled={isLoading} sx={{ mr: 2 }}>
                    {isLoading && <CircularProgress color='inherit' size={20} sx={{ mr: 2 }} />}
                    Save Changes
                  </Button>
                  {/* <Button size='large' variant='outlined' color='secondary' onClick={() => {}}>
              Cancel
            </Button> */}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </>
  )
}

export default EditCategory
