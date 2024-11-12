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
import AttemptTestFilters from '../attempts/AttemptTestFilters'
import QuestionMarkingFilters from '../marking/QuestionMarkingFilters'
import QuestionHeader from './QuestionHeader'

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

// Column Definitions
const columnHelper = createColumnHelper()

const QuestionTestReport = () => {
  // States
  const initialData = [
    {
      id: 1,

      // question:
      //   'A car covers a distance of 40 km in 24 minutes. If its speed is decreased by 40 km/hr, then what will be the time taken by it to cover the same distance?',
      remark: true,
      time: 0.5,
      marks: 1,
      importance: 'high',
      difficulty: 'high'
    },
    {
      id: 2,

      question: 'ased by 40 km/hr, then what will be the time taken by it to cover the same distance?',
      remark: true,
      time: 0.5,
      marks: 1,
      importance: 'low',
      difficulty: 'high'
    },
    {
      id: 3,

      // question: 'hen what will be the time taken by it to cover the same distance?',
      remark: false,
      time: 0.6,
      marks: 2,
      importance: 'high',
      difficulty: 'low'
    },
    {
      id: 4,

      // question: 'sat will be the time taken by it to cover the same distance?',
      remark: true,
      time: 0.2,
      marks: 6,
      importance: 'high',
      difficulty: 'high'
    },
    {
      id: 5,

      // question: ', then what will be the time taken by it to cover the same distance?',
      remark: false,
      time: 0.1,
      marks: 3,
      importance: 'low',
      difficulty: 'low'
    }
  ]

  const [rowSelection, setRowSelection] = useState({})

  // const [data, setData] = useState(...[tableData])
  const [data, setData] = useState(initialData)

  console.info(data)
  const [filteredData, setFilteredData] = useState(data)

  const initialColumns = ['question', 'remark', 'time', 'mark']

  const [visibleColumns, setVisibleColumns] = useState({
    question: true,
    remark: true,
    time: true,
    mark: true
  })

  const { items: columnOrder, handleDragOver, handleDrop, handleDragStart } = useDraggableList(initialColumns)

  // useEffect(() => {
  //   setData(tableData)
  // }, [tableData])

  // // Update marks for a specific user (identified by userId)
  // const updateMarks = (userId, newMarks) => {
  //   setData(prevData => prevData.map(row => (row.id === userId ? { ...row, marks: newMarks } : row)))
  // }

  // const columns = useMemo(
  //   () =>
  //     columnOrder
  //       .map(columnId => {
  //         switch (columnId) {
  //           case 'question':
  //             return visibleColumns.question
  //               ? columnHelper.accessor('question', {
  //                   header: 'question',
  //                   cell: ({ row }) => (
  //                     <div className='flex items-center flex-wrap'>
  //                       <div
  //                         className='flex items-center flex-wrap'
  //                         style={{
  //                           wordBreak: 'break-word'
  //                         }}
  //                       >
  //                         <Typography color='text.primary' className='font-medium pl-3'>
  //                           {row.original.question}
  //                         </Typography>
  //                       </div>
  //                     </div>
  //                   )
  //                 })
  //               : null
  //           case 'remark':
  //             return visibleColumns.remark
  //               ? columnHelper.accessor('remark', {
  //                   header: 'remark',
  //                   cell: ({ row }) =>
  //                     row.original.remark ? (
  //                       <i class='ri-checkbox-circle-fill'></i>
  //                     ) : (
  //                       <i class='ri-close-circle-fill'></i>
  //                     )
  //                 })
  //               : null
  //           case 'time':
  //             return visibleColumns.time
  //               ? columnHelper.accessor('time', {
  //                   header: 'Time taken (in sec)',
  //                   cell: ({ row }) => <Typography>{row.original.time}</Typography>
  //                 })
  //               : null
  //           case 'mark':
  //             return visibleColumns.mark
  //               ? columnHelper.accessor('mark', {
  //                   header: 'Mark',
  //                   cell: info => (
  //                     <input
  //                       type='number'
  //                       value={info.getValue()}
  //                       onChange={e => updateMarks(info.row.original.id, e?.target?.value)}
  //                     />
  //                   )
  //                 })
  //               : null

  //           default:
  //             return null
  //         }
  //       })
  //       .filter(Boolean),
  //   []
  // )
  // Function to handle marks change
  const handleMarksChange = (e, id) => {
    const newMarks = e.target.value

    setData(oldData => oldData?.map(row => (row?.id === id ? { ...row, marks: newMarks } : row)))
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'SR NO.',
        cell: info => info.getValue()
      },
      {
        accessorKey: 'question',
        header: 'Question',
        cell: info => info.getValue()
      },
      {
        accessorKey: 'remark',
        header: 'Remark',
        cell: ({ row }) =>
          row.original.remark ? (
            <img
              src='/images/icons/remark-check.svg'
              alt='no_img'
              style={{
                width: '20px',
                height: '20px',
                marginRight: 10
              }}
            />
          ) : (
            <img
              src='/images/icons/remark-close.svg'
              alt='no_img'
              style={{
                width: '20px',
                height: '20px',
                marginRight: 10
              }}
            />
          )
      },
      {
        accessorKey: 'time',
        header: 'Time taken (in sec)',
        cell: info => info.getValue()
      },

      {
        accessorKey: 'marks',
        header: 'Mark',
        cell: ({ row }) => (
          <TextField
            type='number'
            size='small'
            value={row.original.marks}
            onChange={e => handleMarksChange(e, row.original.id)}
          />
        )
      }
    ],
    []
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection
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

    // onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
    <>
      <Card
        sx={{
          my: 5
        }}
      >
        <Grid item xs={12}>
          <QuestionHeader attemptQuestions={3} notAnsweredQuestions={10} wrongQuestions={3} correctQuestions={4} />
        </Grid>
      </Card>
      <Card>
        <Grid item xs={12}>
          <QuestionMarkingFilters setData={setFilteredData} tableData={data} />
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
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns()?.length} className='text-center'>
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
    </>
  )
}

export default QuestionTestReport
