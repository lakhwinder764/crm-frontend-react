'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

import * as Yup from 'yup'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'

import { styled } from '@mui/material/styles'
import TablePagination from '@mui/material/TablePagination'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

// Component Imports
import { Box, FormHelperText, Tooltip, Select, MenuItem, FormControl, InputLabel } from '@mui/material'

import CustomAvatar from '@core/components/mui/Avatar'

import tableStyles from '@core/styles/table.module.css'

import { Controller, useForm } from 'react-hook-form'

import moment from 'moment'

import { useFormik } from 'formik'

import TableFilters from './TableFilters'
import AddTestDrawer from './AddTestDrawer'

// Util Imports
// import { getInitials } from '../../../../../../Utils/getInitials'
// import { getLocalizedUrl } from '../../../../../../Utils/i18n'

// Style Imports

import AlertDialogBox from '@/components/Common/AlertDialogBox'
import DialogBoxComponent from '@/components/Common/DialogBoxComponent'
import FilterHeader from '@/components/globals/FilterHeader'
import { getInitials } from '@/utils/getInitials'
import useDraggableList from '@/components/globals/useDraggableList'
import OptionMenu from '@/@core/components/option-menu'
import AddUserDialogBox from '@/Components/Common/AddUserDialogBox'
import TextEditor from '@/Components/Common/TextEditor'
import CustomPhoneInput from '@/Components/Common/CustomPhoneInput'

// import DialogBoxComponent from '@/Components/Common/DialogBoxComponent'

// Styled Components

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row?.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank?.passed
}

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

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}

const userStatusObj = {
  Published: 'success',
  Unpublished: 'warning'

  // Unpublished: 'secondary'
}

// Column Definitions
const columnHelper = createColumnHelper()

const TestListTable = ({
  initialColumns,
  tableData,
  addUserData,
  deleteUserData,
  categories,
  workFlow,
  title,
  headingTitle,
  subtitle
}) => {
  // States
  const router = useRouter()
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(...[tableData])
  const [filteredData, setFilteredData] = useState(data)

  const [globalFilter, setGlobalFilter] = useState('')
  const [type, setType] = useState('')

  //Dialog states
  const [openStatusDialog, setOpenStatusDialog] = useState(false)
  const statusOptions = ['Unpublished', 'Published']
  const [selectedStatus, setSelectedStatus] = useState('')
  const [open, setOpen] = useState(false)

  const addUserForm = useFormik({
    initialValues: {
      title: '',
      details: '',
      type: '',
      category: ''
    },
    validationSchema: Yup.object({
      title: Yup.string().required('This field is required'),
      details: Yup.string().required('This field is required'),
      type: Yup.string().required('This field is required'),
      category: Yup.string().required('This field is required')
    }),
    onSubmit: values => {
      updateTestData(guid, values)
    }
  })

  console.info(addUserForm?.values)

  const onSubmit = data => {
    const newUser = {
      id: (data?.length && data?.length + 1) || 1,

      // avatar: `/images/avatars/${Math.floor(Math.random() * 8) + 1}.png`,
      title: data?.title,
      description: data?.details,
      type: data?.type,
      category: data?.category,
      created_on: moment().format('YYYY-MM-DD HH:mm:ss'),

      // optional parameters
      created_by: 'ADJ20',
      status: '0'
    }

    addUserData(newUser)

    // return getNewUserData()

    // return res.json()

    // setData([...(userData ?? []), newUser])
    handleClose()
    setFormData(initialData)
    resetForm({ title: '', details: '', type: '', category: '' })
  }

  const handleReset = () => {
    handleClose()
    setFormData(initialData)
  }

  const { items: columnOrder, handleDragOver, handleDrop, handleDragStart } = useDraggableList(initialColumns)

  const handleCancelDelete = () => {
    setOpen(false)
  }

  const handleConfirmDelete = () => {
    setOpen(false)
  }

  const handleChangeStatus = event => setSelectedStatus(event.target.value)

  // Function to open dialog and initialize the selected user's status
  const handleOpenStatusDialog = user => {
    setSelectedStatus('Published') // Initialize the status with the user's current status
    setOpenStatusDialog(true)
  }

  // Function to close the dialog
  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false)
  }

  const handleCloseAddUserDialog = () => {
    setAddUserOpen(false)
  }

  const handleSaveStatus = () => {
    // Save status logic here
    handleCloseStatusDialog()
  }

  useEffect(() => {
    setData(tableData)
  }, [tableData])

  // Hooks
  const { lang: locale } = useParams()

  const columns = useMemo(
    () =>
      columnOrder
        ?.map(columnId => {
          switch (columnId) {
            case 'select':
              return {
                id: 'select',
                header: ({ table }) => (
                  <Checkbox
                    {...{
                      checked: table.getIsAllRowsSelected(),
                      indeterminate: table.getIsSomeRowsSelected(),
                      onChange: table.getToggleAllRowsSelectedHandler()
                    }}
                  />
                ),
                cell: ({ row }) => (
                  <Checkbox
                    {...{
                      checked: row.getIsSelected(),
                      disabled: !row.getCanSelect(),
                      indeterminate: row.getIsSomeSelected(),
                      onChange: row.getToggleSelectedHandler()
                    }}
                    onClick={e => e.stopPropagation()}
                  />
                )
              }
            case 'title':
              return columnHelper.accessor('title', {
                header: 'Test Name',
                cell: ({ row }) => (
                  <div className='flex items-center gap-3'>
                    <div className='flex flex-col'>
                      <Typography color='text.primary' className='font-medium'>
                        {row.original?.title}
                      </Typography>
                      {/* <Typography variant='body2'>{row.original.username}</Typography> */}
                    </div>
                  </div>
                )
              })
            case 'created_by':
              return columnHelper.accessor('created_by', {
                header: 'Creator',
                cell: ({ row }) => <Typography>{row.original?.created_by}</Typography>
              })
            case 'questions':
              return
              columnHelper.accessor('questions', {
                header: 'Questions',
                cell: ({ row }) => <Typography>10</Typography>
              })
            case 'enrolment':
              return columnHelper.accessor('enrolment', {
                header: 'Enrolment',
                cell: ({ row }) => <Typography>10</Typography>
              })
            case 'submission':
              return columnHelper.accessor('submission', {
                header: 'Submission',
                cell: ({ row }) => <Typography>10</Typography>
              })
            case 'type':
              return columnHelper.accessor('type', {
                header: 'Type',
                cell: ({ row }) => (
                  <Typography className='capitalize' color='text.primary'>
                    {row.original?.type}
                  </Typography>
                )
              })
            case 'status':
              return columnHelper.accessor('status', {
                header: 'Status',
                cell: ({ row }) => (
                  <div className='flex items-center gap-3'>
                    <Chip
                      variant='tonal'
                      label={row?.original?.status === '1' ? 'Published' : 'Unpublished'}
                      size='small'
                      color={userStatusObj?.[row?.original?.status === '1' ? 'Published' : 'Unpublished']}
                      className='capitalize'
                    />
                  </div>
                )
              })
            case 'action':
              return columnHelper.accessor('action', {
                header: 'Action',
                cell: ({ row }) => (
                  <div className='flex items-center gap-0.5'>
                    <OptionMenu
                      iconClassName='text-textSecondary'
                      data={row}
                      options={[
                        {
                          text: 'View',
                          icon: 'ri-eye-line',
                          href: `/test/questions/?guid=${row?.original?.guid}`
                        },
                        {
                          text: 'Edit',
                          icon: 'ri-edit-box-line',
                          href: workFlow ? '/settings/workflow/?mode=edit' : '/test/edit'
                        },
                        {
                          text: 'Delete',
                          icon: 'ri-delete-bin-7-line'
                        }
                      ]}
                    />
                  </div>
                ),
                enableSorting: false
              })
            default:
              return null
          }
        })
        ?.filter(Boolean),
    [columnOrder, data]
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  console.info(Object.keys(rowSelection)?.length)

  const getAvatar = params => {
    const { avatar, fullName } = params

    if (avatar) {
      return <CustomAvatar src={avatar} skin='light' size={34} />
    } else {
      return (
        <CustomAvatar skin='light' size={34}>
          {getInitials(fullName)}
        </CustomAvatar>
      )
    }
  }

  return (
    <>
      <FilterHeader title={headingTitle} subtitle={subtitle} link='/test/list'>
        <Grid item xs={6} md={2} display='flex' alignItems='center' pb={3}>
          <Button
            fullWidth
            variant='contained'
            onClick={() => (workFlow ? router.push('/settings/workflow/?mode=add') : setAddUserOpen(!addUserOpen))}
            className='max-sm:is-full'
            startIcon={
              <i
                class='ri-add-fill'
                style={{
                  width: 21.6,
                  height: 21.6
                }}
              />
            }
          >
            {title}
          </Button>
        </Grid>
      </FilterHeader>
      <Card>
        <Grid container item xs={12} display='flex' alignItems='center'>
          <Grid item xs={12}>
            <TableFilters
              setData={setFilteredData}
              tableData={data}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              type={type}
              setType={setType}
            />
          </Grid>
        </Grid>
        <Grid container item xs={12} pl={5}>
          <Grid item xs={0.9}>
            <Box display='flex' justifyContent='space-between' alignItems='center'>
              <IconButton
                disableRipple
                disabled={!Object.keys(rowSelection)?.length}
                sx={{
                  border: `1px solid ${Object.keys(rowSelection)?.length ? '#808080' : '#E7E7E7'}`,
                  borderRadius: 0
                }}
                onClick={() => setOpen(true)}
              >
                {/* <CustomTooltip title='Add' arrow> */}
                <i
                  class='ri-delete-bin-6-fill'
                  color={Object.keys(rowSelection)?.length ? '#B5B8FA' : '#808080'}
                  style={{
                    width: 20,
                    height: 20,
                    ...(Object.keys(rowSelection)?.length
                      ? {
                          color: '#B5B8FA'
                        }
                      : { color: '#808080' })
                  }}
                ></i>
                {/* </CustomTooltip> */}
              </IconButton>
              <IconButton
                disableRipple
                disabled={!Object.keys(rowSelection)?.length}
                sx={{
                  border: `1px solid ${Object.keys(rowSelection)?.length ? '#808080' : '#E7E7E7'}`,
                  borderRadius: 0
                }}
                onClick={() => handleOpenStatusDialog('Published')}
              >
                <i
                  class='ri-checkbox-circle-line'
                  color={Object.keys(rowSelection)?.length ? '#B5B8FA' : '#808080'}
                  style={{
                    width: 20,
                    height: 20,
                    ...(Object.keys(rowSelection)?.length
                      ? {
                          color: '#B5B8FA'
                        }
                      : { color: '#808080' })
                  }}
                ></i>
              </IconButton>
              {/* <TestOptionMenu
                iconClassName='text-textSecondary'
                // setEditFilterOpen={setEditFilterOpen}
                // data={row}
                // setEditData={setEditData}
                rowSelection={rowSelection}
                options={[
                  {
                    text: 'Test Name'
                  },
                  {
                    text: 'Start Date'
                  },
                  {
                    text: 'End Date'
                  },
                  {
                    text: 'Type'
                  },
                  {
                    text: 'Status'
                  }
                ]}
              /> */}
            </Box>
          </Grid>
          <Grid
            container
            pr={8}
            item
            xs={11}
            spacing={3}
            display='flex'
            alignItems='center'
            justifyContent='flex-end'
          ></Grid>
        </Grid>
        <div className='overflow-x-auto pt-5'>
          <table className={tableStyles.table}>
            <thead>
              {table?.getHeaderGroups()?.map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers?.map((header, index) => (
                    <th
                      key={header?.id}
                      draggable // Makes the column header draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(index)}
                      style={{ cursor: 'grab' }}
                    >
                      {header?.isPlaceholder ? null : (
                        <>
                          <div
                            className={classnames({
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='ri-arrow-up-s-line text-xl' />,
                              desc: <i className='ri-arrow-down-s-line text-xl' />
                            }[header.column.getIsSorted()] ?? null}
                          </div>
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows?.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No data available
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map(row => {
                    return (
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    )
                  })}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component='div'
          className='border-bs'
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          SelectProps={{
            inputProps: { 'aria-label': 'rows per page' }
          }}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
          onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
        />
      </Card>
      {open && (
        <AlertDialogBox
          open={open}
          handleCancel={handleCancelDelete}
          handleConfirm={handleConfirmDelete}
          title='Delete Test'
          textContent='Are you sure you want to delete this test?'
          acceptedButton='Delete'
          rejectedButton='Cancel'
        />
      )}
      {/* status Dialog */}
      <AddUserDialogBox
        open={addUserOpen}
        onClose={handleCloseAddUserDialog}
        title='Add User'
        confirmText='Save'
        cancelText='cancel'
        onConfirm={handleSaveStatus}
      >
        <Grid container xs={12}>
          <Grid item xs={6} px={2} py={1}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <InputLabel shrink id='title'>
                Title
              </InputLabel>
              <TextField
                size='small'
                name='title'
                value={addUserForm.values.title}
                onChange={addUserForm.handleChange}
                onBlur={addUserForm.handleBlur}
                error={addUserForm.touched.title && Boolean(addUserForm.errors.title)}
                helperText={addUserForm.touched.title && addUserForm.errors.title}
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
                value={addUserForm.values.title}
                onChange={addUserForm.handleChange}
                onBlur={addUserForm.handleBlur}
                error={addUserForm.touched.title && Boolean(addUserForm.errors.title)}
                helperText={addUserForm.touched.title && addUserForm.errors.title}
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
              value={addUserForm.values.details}
              onChange={addUserForm.handleChange}
              autoFocus
              fullWidth
              width='22vw'
              quilleditor
              simpleeditor
              formikForm={addUserForm}
            />
          </Grid>
          <Grid item xs={12} py={6}>
            <Box display='flex' justifyContent='flex-end' gap={4}>
              <Button variant='outlined' color='error' type='reset' onClick={() => handleReset()}>
                Cancel
              </Button>
              <Button variant='contained' type='submit'>
                Create
              </Button>
            </Box>
          </Grid>
        </Grid>
      </AddUserDialogBox>
      <DialogBoxComponent
        open={openStatusDialog}
        onClose={handleCloseStatusDialog}
        title='Change Status'
        description='Are you sure you want to change status?'
        confirmText='Save'
        onConfirm={handleSaveStatus}
        statusOptions={statusOptions}
        selectedStatus={selectedStatus}
        onChangeStatus={handleChangeStatus}
        isStatusDialog={true}
      />
    </>
  )
}

export default TestListTable
