// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { Checkbox, InputAdornment, ListItemText, TextField, Typography } from '@mui/material'

const TableFilters = ({ setData, tableData, globalFilter, setGlobalFilter, type }) => {
  // States
  const [types, setTypes] = useState([])
  const [status, setStatus] = useState([])

  useEffect(() => {
    const filteredData = tableData?.filter(user => {
      // Filter for parent categories where parent_guid is null
      if (user?.parent_guid !== null) return false

      // Find the title of the current user for status filtering
      const userStatusTitle = tableData?.find(item => item?.title === user?.title)

      // Log userStatusTitle to inspect its value

      // Filter by status (title) based on selected status
      if (status?.length > 0) {
        // If no userStatusTitle is found or if it doesn't match selected status, filter out the item
        if (!userStatusTitle || !status?.includes(userStatusTitle?.title)) {
          return false
        }
      }

      // Filter by types based on selected types
      if (types?.length > 0) {
        const userTypeTitle = tableData?.find(item => item?.type === user?.type)?.title

        // If no userTypeTitle is found or if it doesn't match selected types, filter out the item
        if (!userTypeTitle || !types?.includes(userTypeTitle)) {
          return false
        }
      }

      return true
    })

    setData(filteredData || [])
  }, [status, types, tableData, setData])

  const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
    // States
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])
    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value)
      }, debounce)

      return () => clearTimeout(timeout)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    return (
      <TextField
        {...props}
        size='small'
        value={value}
        onChange={e => setValue(e.target.value)}
        InputProps={{
          endAdornment: (
            <i
              class='ri-search-line'
              style={{
                color: '#B3B5BD'
              }}
            ></i>
          )
        }}
      />
    )
  }

  const handleTypeChange = event => {
    const {
      target: { value }
    } = event

    setTypes(typeof value === 'string' ? value.split(',') : value)
  }

  const handleStatusChange = event => {
    const {
      target: { value }
    } = event

    setStatus(typeof value === 'string' ? value.split(',') : value)
  }

  return (
    <CardContent>
      <Grid container spacing={5} xs={12} display='flex' alignItems='center' pr={0}>
        <Grid item container xs={12} display='flex' justifyContent='space-between'>
          <Grid item xs={3}>
            <Typography fontWeight='bold' fontSize={18}>
              Filter
            </Typography>
          </Grid>
          <Grid item xs={9} display='flex' justifyContent='flex-end'>
            <a
              style={{
                cursor: 'pointer',
                color: '#FF4D49',
                textDecoration: 'underline',
                fontWeight: 500,
                fontSize: 15,
                textUnderlineOffset: 3
              }}
              onClick={() => {
                setStatus([])
                setGlobalFilter('')
                setTypes([])
              }}
            >
              Reset Filter
            </a>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search Category'
              className='max-sm:is-full'
            />
          </FormControl>
        </Grid>
        {/* <Grid item xs={12} sm={6}>
          <FormControl
            fullWidth
            sx={{
              '& .MuiInputBase-root': {
                height: '40px',
                minHeight: 'auto'
              },
              '& .MuiInputLabel-root': {
                top: '-7px'
              }
            }}
          >
            <InputLabel id='type-select'>Filter by type</InputLabel>
            <Select
              fullWidth
              size='small'
              id='select-type'
              label='Filter by type'
              labelId='type-select'
              value={types}
              multiple
              onChange={handleTypeChange}
              renderValue={selected => selected.join(', ')}
            >
              <MenuItem key='evaluated' value='evaluated'>
                <Checkbox checked={types.indexOf('evaluated') > -1} />
                <ListItemText primary='Evaluated' />
              </MenuItem>
              <MenuItem key='practice' value='practice'>
                <Checkbox checked={types.indexOf('practice') > -1} />
                <ListItemText primary='Practice' />
              </MenuItem>
              <MenuItem key='quiz' value='quiz'>
                <Checkbox checked={types.indexOf('quiz') > -1} />
                <ListItemText primary='Quiz' />
              </MenuItem>
            </Select>
          </FormControl>
        </Grid> */}
        <Grid item xs={12} sm={6}>
          <FormControl
            fullWidth
            sx={{
              '& .MuiInputBase-root': {
                height: '40px',
                minHeight: 'auto'
              },
              '& .MuiInputLabel-root': {
                top: '-7px'
              }
            }}
          >
            <InputLabel id='status-select'>Parent Category</InputLabel>
            <Select
              fullWidth
              id='select-status'
              label='Filter by status'
              size='small'
              value={status}
              labelId='status-select'
              multiple
              onChange={handleStatusChange}
              renderValue={selected => selected.join(', ')}
            >
              {/* Only show parent categories with parent_guid as null */}
              {tableData
                .filter(item => item.parent_guid === null)
                .map(item => (
                  <MenuItem key={item.id} value={item.title}>
                    <Checkbox checked={status.indexOf(item.title) > -1} />
                    <ListItemText primary={item.title} />
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TableFilters
