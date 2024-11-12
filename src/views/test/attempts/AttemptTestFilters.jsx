// React Imports
import { useState, useEffect, forwardRef } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { Checkbox, InputAdornment, ListItemText, TextField, Typography, IconButton } from '@mui/material'

import moment from 'moment'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

const PickersComponent = forwardRef(({ ...props }, ref) => {
  return (
    <TextField
      inputRef={ref}
      fullWidth
      {...props}
      label={props.label || ''}
      className='is-full'
      error={props.error}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton size='small'>
              <i class='ri-calendar-fill'></i>
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  )
})

const AttemptTestFilters = ({ setData, tableData, globalFilter, setGlobalFilter, type }) => {
  // States
  const [types, setTypes] = useState([])
  const [status, setStatus] = useState([])
  const [dueDate, setDueDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  useEffect(() => {
    const filteredData = tableData?.filter(user => {
      if (user?.status === '0' && status?.length) {
        if (status?.length && !status?.includes('Unpublished')) return false
      }

      if (user?.status === '1' && status?.length) {
        if (status?.length && !status?.includes('Published')) return false
      }

      if (types?.length > 0 && !types?.includes(user?.type)) return false
      const itemStartDate = new Date(user?.created_on)

      if (dueDate && endDate) {
        const itemEndDate = new Date(user?.updated_on)
        const start = new Date(dueDate)

        const end = new Date(endDate)

        return (!dueDate || itemStartDate >= start) && (!endDate || itemEndDate <= end)
      }

      return true
    })

    setData(filteredData || [])
  }, [type, status, tableData, setData, types, dueDate, endDate])

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

  const handleStartDate = date => {
    if (date && date > endDate) {
      setDueDate(new Date(date))
      setEndDate(new Date(date))
    }
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
                setDueDate(null)
                setEndDate(null)
              }}
            >
              Reset Filter
            </a>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search User'
              className='max-sm:is-full'
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <AppReactDatepicker
            selectsStart
            id='event-attempt-date'
            endDate={endDate}
            selected={dueDate}
            startDate={dueDate}
            showTimeSelect
            dateFormat='yyyy-MM-dd hh:mm:ss'
            customInput={<PickersComponent label='Attempt Date' registername='startDate' size='small' />}
            onChange={date => date !== null && setDueDate(new Date(date))}
            onSelect={handleStartDate}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <AppReactDatepicker
            selectsEnd
            id='event-submission-date'
            endDate={endDate}
            selected={endDate}
            minDate={dueDate}
            startDate={dueDate}
            showTimeSelect
            dateFormat='yyyy-MM-dd hh:mm:ss'
            customInput={<PickersComponent label='Submission Date' registername='endDate' size='small' />}
            onChange={date => date !== null && setEndDate(new Date(date))}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
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
            <InputLabel id='status-select'>Status</InputLabel>
            <Select
              fullWidth
              id='select-status'
              label='Status'
              size='small'
              value={status}
              labelId='status-select'
              multiple
              onChange={handleStatusChange}
              renderValue={selected => selected?.join(', ')}

              // inputProps={{ placeholder: 'Select Status' }}
            >
              <MenuItem key='Published' value='Published'>
                <Checkbox checked={status?.indexOf('Published') > -1} />
                <ListItemText primary='Published' /> {/* Capitalize first letter */}
              </MenuItem>
              <MenuItem key='Unpublished' value='Unpublished'>
                <Checkbox checked={status?.indexOf('Unpublished') > -1} />
                <ListItemText primary='Unpublished' /> {/* Capitalize first letter */}
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default AttemptTestFilters
