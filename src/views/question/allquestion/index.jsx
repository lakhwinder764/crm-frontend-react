'use client'
import React, { useEffect, useState } from 'react'

// import useQuestionApi from '../../Api/useQuestionApi'
import {
  Grid,
  Box,
  CircularProgress,
  FormControl,
  CardHeader,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Card
} from '@mui/material'

import QuestionCard from '../list/QuestionCard'
import TableFilters from '../list/TableFilters'
import TestCard from '../list/TestCard'
import QuickLinksCard from '../list/QuickLinkCards'
import useQuestionModuleApi from '@/api/useQuestionModuleApi'
import QuestionCardEdit from '../list/QuestionCardEdit'
import PaginationCard from '@/api/Pagination'

const AllQuestionList = () => {
  const {
    allquestionData,
    setallquestionData,
    fetchDataallquestion,
    loader,
    searchKeyword,
    setSearchKeyword,
    BulkDelete
  } = useQuestionModuleApi()

  // useEffect(() => {
  //   fetchDataallquestion()
  // }, [])
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  // Function to close the dialog
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [expandedPanels, setExpandedPanels] = useState([]) // Tracks which panels are expanded
  const [isVisible, setIsVisible] = useState(false) // Controls visibility of questions
  const [showAnswers, setShowAnswers] = useState([]) // Tracks which panels' answers are shown

  useEffect(() => {
    fetchDataallquestion({
      // searchKeyword: searchKeyword,
      page: currentPage,
      results_per_page: rowsPerPage
    })
  }, [currentPage, rowsPerPage])

  useEffect(() => {
    if (allquestionData && allquestionData?.meta) {
      setTotalPages(Math.ceil(allquestionData?.meta?.total_results / rowsPerPage))
    }
  }, [allquestionData, rowsPerPage])

  const handlePageChange = page => {
    setCurrentPage(page)
  }

  const handleRowsPerPageChange = rows => {
    setRowsPerPage(rows)
    setCurrentPage(1) // Reset to the first page when changing rows per page
  }

  // Handle search input
  const handleSearch = event => {
    setSearchKeyword(event.target.value) // Update the search keyword
  }

  //     {
  //       id: 1,
  //       text: ' A car covers a distance of 40 km in 24 minutes. If its speed is decreased by 40 km/hr, then what will be the time taken by it to cover the same distance?',
  //       options: ['48 Minutes', '36 Minutes', '45 Minutes', '40 Minutes']
  //     },
  //     {
  //       id: 2,
  //       text: "Indian film ___________'s song has won the prestigious Golden Globe award for Best Original Song.",
  //       options: ['True', 'False']
  //     },
  //     {
  //       id: 3,
  //       text: 'State whether the following statement is TRUE or FALSE. (2-3)² is irrational.',
  //       options: ['True', 'False']
  //     },
  //     {
  //       id: 4,
  //       text: 'The five digit number write according to place value, abcde = 10000a + 1000b + 100c + 10d + e',
  //       sampleAnswer: `Sample Answer:
  // The five digit number is:-
  // abcde = 10000a + 1000b + 100c + 10d + e
  // By reversing the digits, the number becomes:-
  // edcba = 10000e + 1000d + 100c + 10b + a
  // Difference of number and the number obtained by reversing digits = (10000a + 1000b + 100c + 10d + e) - (10000e + 1000d + 100c + 10b + a) = 9[1111a + 110b – 110d – 111e]
  // ∴ It is divisible by 9`
  //     }
  //   ]

  // Function to expand all accordions and show questions without answers
  //   const [expandedPanels, setExpandedPanels] = useState([]) // Tracks which panels are expanded
  //   const [isVisible, setIsVisible] = useState(false) // Controls visibility of questions
  //   const [showAnswers, setShowAnswers] = useState([]) // Tracks which panels' answers are shown
  const [isExpandedAll, setIsExpandedAll] = useState(false) // Tracks if all are expanded
  const [filteredData, setFilteredData] = useState(allquestionData || [])

  const handleExpandAll = () => {
    setIsVisible(true) // Show the questions
    setExpandedPanels(questions?.map(q => q?.id)) // Expand all panels
    setShowAnswers([]) // Reset showing answers (no answers shown)
    setIsExpandedAll(true) // Set the expanded state
  }

  const handleExpandAllButton = () => {
    setIsVisible(true) // Show the questions
    setExpandedPanels(questions?.map(q => q?.id)) // Expand all panels
    setShowAnswers(questions?.map(q => q?.id)) // Reset showing answers (no answers shown)
    // setIsExpandedAll(true) // Set the expanded state
  }

  // Function to collapse all accordions and hide everything
  const handleCollapseAll = () => {
    setExpandedPanels([]) // Collapse all panels
    setIsVisible(false) // Hide the questions
    setShowAnswers([]) // Reset answers visibility
    setIsExpandedAll(false) // Reset the expanded state
  }

  // Function to toggle the answer visibility of a specific question
  const toggleAnswer = panelId => {
    setIsVisible(true)

    if (showAnswers?.includes(panelId)) {
      setShowAnswers(showAnswers?.filter(id => id !== panelId)) // Hide answer if already visible
    } else {
      setShowAnswers([...showAnswers, panelId]) // Show answer if hidden
      setIsVisible(true)
    }
  }

  //   const [filteredData, setFilteredData] = useState(data || []) // Initialize with data from API

  //   useEffect(() => {
  //     if (data) {
  //       setFilteredData(data)
  //     }
  //   }, [data])
  //   console.log(data, 'checking')

  // console.log(questionss, 'questionss')
  const [selectedQuestions, setSelectedQuestions] = useState([]) // Track selected checkboxes in QuestionCard

  //   console.log(questions, 'questions')
  // Pass this to QuestionCard to manage checkbox selections
  const handleCheckboxChange = (questionId, isChecked) => {
    if (isChecked) {
      setSelectedQuestions([...selectedQuestions, questionId]) // Add question to selected list
    } else {
      setSelectedQuestions(selectedQuestions?.filter(id => id !== questionId)) // Remove from list
    }
  }

  const handleDeleteClick = () => {
    if (selectedQuestions?.length > 0) {
      setOpenDeleteDialog(true)
    }
  }

  const handleConfirmDelete = async () => {
    try {
      // Call the delete function from your API hook
      await BulkDelete(selectedQuestions) // Assuming deleteQuestions accepts an array of IDs
      setSelectedQuestions([]) // Clear the selected questions
      setOpenDeleteDialog(false) // Close the dialog
      fetchDataallquestion(searchKeyword) // Refresh the questions list after deletion
    } catch (error) {
      console.error('Error deleting questions:', error)
    }
  }

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false)
  }

  const questions =
    allquestionData &&
    allquestionData?.data
      ?.filter(item => item?.question !== null) // Filter out items with a null question
      ?.map((item, index) => ({
        guid: item?.guid,
        id: index + 1,
        text: item?.question, // No need for null check here since it's already filtered
        options: item?.choices?.map(choice => choice?.choice), // Map the options
        correctanswer: item?.choices?.map(choice => choice?.correct_answer), // Map correct answers
        marks: item?.marks
      }))

  const filteredQuestions = questions?.filter(question =>
    question?.text?.toLowerCase()?.includes(searchKeyword?.toLowerCase())
  )

  const width = 'auto'
  const deleteIconActive = selectedQuestions?.length > 0

  return (
    <>
      <TableFilters
        setData={setFilteredData}
        tableData={allquestionData}
        handleExpandAll={handleExpandAllButton}
        handleCollapseAll={handleCollapseAll}
        expandedPanels={expandedPanels}
        // handleToggle={handleToggle}
        selectedQuestions={selectedQuestions}
        deleteIconActive={deleteIconActive}
        onDeleteClick={handleDeleteClick}
      />
      {/* <Card> */}
      <Grid container spacing={2}>
        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Grid item xs={12}>
            {/* <Grid container spacing={5} alignItems='center'>
                <Grid item xs={12} sm={12}>
                  <FormControl fullWidth sx={{ marginBottom: '10px' }}>
                    <CardHeader title='Filter' />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ paddingLeft: '15px' }}>
                    <TextField
                      label='Search Questions'
                      value={searchKeyword}
                      onChange={handleSearch}
                      variant='outlined'
                    />
                  </FormControl>
                </Grid>
              </Grid> */}
            {filteredQuestions && filteredQuestions?.length > 0 ? (
              <QuestionCardEdit
                handleSearch={handleSearch}
                searchKeyword={searchKeyword}
                setSearchKeyword={setSearchKeyword}
                allquestion={'true'}
                //   userListTable={'true'}
                marginLeft={'17px'}
                width={width}
                expandedPanels={expandedPanels}
                setExpandedPanels={setExpandedPanels}
                isVisible={isVisible}
                setIsVisible={setIsVisible}
                showAnswers={showAnswers}
                setShowAnswers={setShowAnswers}
                handleCollapseAll={handleCollapseAll}
                handleExpandAll={handleExpandAll}
                toggleAnswer={toggleAnswer}
                questions={filteredQuestions}
                isExpandedAll={isExpandedAll}
                setIsExpandedAll={setIsExpandedAll}
                handleCheckboxChange={handleCheckboxChange}
                selectedQuestions={selectedQuestions}
                setSelectedQuestions={setSelectedQuestions}
              />
            ) : (
              <>
                <Box className='loader' style={{ textAlign: 'center', padding: '50px 0px' }}>
                  {/* <CircularProgress /> */}
                  No result found
                </Box>
              </>
            )}
          </Grid>
          {/* <Grid item xs={4} sm={4} md={6} lg={3} style={{ marginRight: '25px' }}>
            <TestCard />
            <QuickLinksCard />
          </Grid> */}
        </Grid>
      </Grid>
      <Grid item xs={12} md={12}>
        {/* <div style={{ width: '60%' }}> */} {/* Set the width to 50% */}
        <PaginationCard
          rowsPerPage={rowsPerPage} // e.g., 10
          currentPage={currentPage} // e.g., 1
          totalPages={totalPages} // e.g., 5
          onPageChange={handlePageChange} // Your function to handle page changes
          onRowsPerPageChange={handleRowsPerPageChange} // Your function to handle rows per page change
        />
        {/* </div> */}
      </Grid>
      {/* {questions && questions.length > 0 && (
        <QuestionCard
          questions={questions}
          allquestion={'true'}
          marginLeft={'17px'}
          width={width}
          expandedPanels={expandedPanels}
          setExpandedPanels={setExpandedPanels}
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          showAnswers={showAnswers}
          setShowAnswers={setShowAnswers}
          handleCollapseAll={handleCollapseAll}
          handleExpandAll={handleExpandAll}
          toggleAnswer={toggleAnswer}
          //   questions={questions}
          isExpandedAll={isExpandedAll}
          setIsExpandedAll={setIsExpandedAll}
          onQuestionSelect={handleCheckboxChange}
          //   selectedQuestions={selectedQuestions}
          setSelectedQuestions={setSelectedQuestions}
        />
      )} */}

      <Dialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        sx={{ '& .MuiDialog-paper': { width: '600px', maxWidth: '600px' } }} // Setting the width and maxWidth
      >
        <DialogTitle id='alert-dialog-title'>{'Delete Questions'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>Are you sure you want to delete ?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelDelete}
            style={{ border: '1px solid black', color: 'black', height: '38px', width: '94px' }}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} variant='contained' style={{ height: '38px', width: '94px' }} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* </Card> */}
    </>
  )
}

export default AllQuestionList
