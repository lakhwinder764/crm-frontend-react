'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

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
import { Box, Tooltip } from '@mui/material'

import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
// import { getInitials } from '../../../../../../Utils/getInitials'
// import { getLocalizedUrl } from '../../../../../../Utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

import AlertDialogBox from '@/components/Common/AlertDialogBox'
import DialogBoxComponent from '@/components/Common/DialogBoxComponent'
import FilterHeader from '@/components/globals/FilterHeader'
import { getInitials } from '@/utils/getInitials'
import useDraggableList from '@/components/globals/useDraggableList'
import AttemptTestFilters from './AttemptTestFilters'
import { randomColorGenerator } from '@/utils/randomColorGenerator'

// import DialogBoxComponent from '@/Components/Common/DialogBoxComponent'

// Styled Components
const Icon = styled('i')({})

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
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

// Vars
const userRoleObj = {
  admin: { icon: 'ri-vip-crown-line', color: 'error' },
  author: { icon: 'ri-computer-line', color: 'warning' },
  editor: { icon: 'ri-edit-box-line', color: 'info' },
  maintainer: { icon: 'ri-pie-chart-2-line', color: 'success' },
  subscriber: { icon: 'ri-user-3-line', color: 'primary' }
}

const userStatusObj = {
  Published: 'success',
  Unpublished: 'warning'

  // Unpublished: 'secondary'
}

// Column Definitions
const columnHelper = createColumnHelper()

const AttemptTestListTable = ({ tableData, addUserData, deleteUserData, categories, getCategories }) => {
  // States
  const [addUserOpen, setAddUserOpen] = useState(false)

  const [editUserOpen, setEditUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(...[tableData])
  const [editData, setEditData] = useState()
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')
  const [type, setType] = useState('')

  //Dialog states
  const [openStatusDialog, setOpenStatusDialog] = useState(false)
  const statusOptions = ['Unpublished', 'Published']
  const [selectedStatus, setSelectedStatus] = useState('')
  const [open, setOpen] = useState(false)

  const initialColumns = [
    'select',
    'user',
    'attempted_date',
    'submission_date',
    'time_taken',
    'marks',
    'status',
    'action'
  ]

  const [visibleColumns, setVisibleColumns] = useState({
    select: true,
    user: true,
    attempted_date: true,
    submission_date: true,
    time_taken: true,
    marks: true,
    status: true,
    action: true
  })

  const { items: columnOrder, handleDragOver, handleDrop, handleDragStart } = useDraggableList(initialColumns)

  // Function to close the dialog
  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false)
  }

  useEffect(() => {
    setData(tableData)
  }, [tableData])

  const columns = useMemo(
    () =>
      columnOrder
        ?.map(columnId => {
          switch (columnId) {
            case 'select':
              return visibleColumns?.select
                ? {
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
                : null
            case 'user':
              return visibleColumns?.user
                ? columnHelper.accessor('title', {
                    header: (
                      <Typography fontWeight='bold' fontSize={13}>
                        user name
                      </Typography>
                    ),
                    cell: ({ row }) => (
                      <div className='flex items-center gap-3'>
                        <div className='flex items-center'>
                          {getAvatar({ avatar: row.original?.avatar, fullName: row.original?.title })}
                          <Typography color='text.primary' className='font-medium pl-3'>
                            {row.original?.title}
                          </Typography>
                        </div>
                      </div>
                    )
                  })
                : null
            case 'attempted_date':
              return visibleColumns?.attempted_date
                ? columnHelper.accessor('created_on', {
                    header: (
                      <Typography fontWeight='bold' fontSize={13}>
                        Attempted date/time
                      </Typography>
                    ),
                    cell: ({ row }) => <Typography>{row.original?.created_on}</Typography>
                  })
                : null
            case 'submission_date':
              return visibleColumns?.submission_date
                ? columnHelper.accessor('updated_on', {
                    header: (
                      <Typography fontWeight='bold' fontSize={13}>
                        Submission date/time
                      </Typography>
                    ),
                    cell: ({ row }) => <Typography>{row.original?.updated_on}</Typography>
                  })
                : null
            case 'time_taken':
              return visibleColumns?.time_taken
                ? columnHelper.accessor('time_taken', {
                    header: (
                      <Typography fontWeight='bold' fontSize={13}>
                        Time Taken
                      </Typography>
                    ),
                    cell: ({ row }) => (
                      <Typography className='capitalize' color='primary.main'>
                        00:15:20 Secs
                      </Typography>
                    )
                  })
                : null
            case 'marks':
              return visibleColumns?.marks
                ? columnHelper.accessor('marks', {
                    header: (
                      <Typography fontWeight='bold' fontSize={13}>
                        Marks
                      </Typography>
                    ),
                    cell: ({ row }) => <Typography className='capitalize'>30</Typography>
                  })
                : null
            case 'status':
              return visibleColumns?.status
                ? columnHelper.accessor('status', {
                    header: (
                      <Typography fontWeight='bold' fontSize={13}>
                        Status
                      </Typography>
                    ),
                    cell: ({ row }) => (
                      <div className='flex items-center gap-3'>
                        <Chip
                          variant='tonal'
                          label={row?.original?.status === '1' ? 'Published' : 'Unpublished'}
                          size='small'
                          color={userStatusObj[row?.original?.status === '1' ? 'Published' : 'Unpublished']}
                          className='capitalize'
                        />
                      </div>
                    )
                  })
                : null
            case 'action':
              return visibleColumns?.action
                ? columnHelper.accessor('action', {
                    header: (
                      <Typography fontWeight='bold' fontSize={13}>
                        Action
                      </Typography>
                    ),
                    cell: ({ row }) => (
                      <Button variant='outlined' color='primary' size='small'>
                        Grading
                      </Button>
                    )
                  })
                : null
            default:
              return null
          }
        })
        .filter(Boolean),
    [columnOrder, visibleColumns, data]
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

  const getAvatar = params => {
    const { avatar, fullName } = params

    if (avatar) {
      return <CustomAvatar src={avatar} skin='light' size={34} />
    } else {
      return (
        <CustomAvatar skin='light' size={34} color={randomColorGenerator()}>
          {fullName?.slice(0, 2)?.toUpperCase()}
        </CustomAvatar>
      )
    }
  }

  return (
    <>
      {/* <FilterHeader title='Attempts' subtitle='Mathematics Test' /> */}
      <Card>
        <Grid container item xs={12} display='flex' alignItems='center'>
          <Grid item xs={12}>
            <AttemptTestFilters
              setData={setFilteredData}
              tableData={data}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              type={type}
              setType={setType}
            />
          </Grid>
        </Grid>
        <div className='overflow-x-auto pt-5'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups()?.map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers?.map((header, index) => (
                    <th
                      key={header.id}
                      draggable // Makes the column header draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(index)}
                      style={{ cursor: 'grab' }}
                    >
                      {header.isPlaceholder ? null : (
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
          count={table.getFilteredRowModel().rows?.length}
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
    </>
  )
}

export default AttemptTestListTable
