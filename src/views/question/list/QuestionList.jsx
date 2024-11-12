'use client'
import { useEffect, useState } from 'react'

import CircularProgress from '@mui/material/CircularProgress'

// React Imports

// MUI Imports
import Card from '@mui/material/Card'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

// Third-party Imports

import Box from '@mui/material/Box'

// Component Imports
import TableFilters from './TableFilters'

import '../../style/styles.css'

// Style Imports
import TestCard from './TestCard'

import { Grid } from '@mui/material'

import QuickLinksCard from './QuickLinkCards'
import QuestionCard from './QuestionCard'
import useQuestionModuleApi from '@/api/useQuestionModuleApi'

// Var

// Column Definitions

const QuestionList = ({ tableData }) => {
  const { data, fetchData } = useQuestionModuleApi()
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [expandedPanels, setExpandedPanels] = useState([]) // Tracks which panels are expanded
  const [isVisible, setIsVisible] = useState(false) // Controls visibility of questions
  const [showAnswers, setShowAnswers] = useState([]) // Tracks which panels' answers are shown

  useEffect(() => {
    fetchData()
  }, [])

  //   const questions = [
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
    if (showAnswers?.includes(panelId)) {
      setShowAnswers(showAnswers?.filter(id => id !== panelId)) // Hide answer if already visible
    } else {
      setShowAnswers([...showAnswers, panelId]) // Show answer if hidden
    }

    // setIsExpandedAll(true)
  }

  const [filteredData, setFilteredData] = useState(data || []) // Initialize with data from API

  useEffect(() => {
    if (data) {
      setFilteredData(data)
    }
  }, [data])
  console.log(isExpandedAll)

  // console.log(questionss, 'questionss')
  const [selectedQuestions, setSelectedQuestions] = useState([]) // Track selected checkboxes in QuestionCard

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

  const handleConfirmDelete = () => {
    setSelectedQuestions([]) // Clear the selected questions
    setOpenDeleteDialog(false) // Close the dialog
  }

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false)
  }

  const questions = data
    ?.filter(item => item?.question !== null) // Filter out items with a null question
    .map((item, index) => ({
      id: index + 1,
      text: item?.question, // No need for null check here since it's already filtered
      options: item?.choices?.map(choice => choice?.choice), // Map the options
      correctanswer: item?.choices?.map(choice => choice?.correct_answer) // Map correct answers
    }))

  const width = '850px'
  const deleteIconActive = selectedQuestions?.length > 0

  return (
    <>
      <Card>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TableFilters
              setData={setFilteredData}
              tableData={data}
              handleExpandAll={handleExpandAllButton}
              handleCollapseAll={handleCollapseAll}
              expandedPanels={expandedPanels}
              // handleToggle={handleToggle}
              selectedQuestions={selectedQuestions}
              deleteIconActive={deleteIconActive}
              onDeleteClick={handleDeleteClick}
            />
          </Grid>

          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Grid item xs={8} md={8} lg={8} sm={12}>
              {questions && questions?.length > 0 ? (
                <QuestionCard
                  userListTable={'true'}
                  marginLeft={'17px'}
                  width={'auto'}
                  expandedPanels={expandedPanels}
                  setExpandedPanels={setExpandedPanels}
                  isVisible={isVisible}
                  setIsVisible={setIsVisible}
                  showAnswers={showAnswers}
                  setShowAnswers={setShowAnswers}
                  handleCollapseAll={handleCollapseAll}
                  handleExpandAll={handleExpandAll}
                  toggleAnswer={toggleAnswer}
                  questions={questions}
                  isExpandedAll={isExpandedAll}
                  setIsExpandedAll={setIsExpandedAll}
                  onQuestionSelect={handleCheckboxChange}
                  selectedQuestions={selectedQuestions}
                  setSelectedQuestions={setSelectedQuestions}
                />
              ) : (
                <>
                  <Box className='loader' style={{ textAlign: 'center', padding: '50px 0px' }}>
                    <CircularProgress />
                  </Box>
                </>
              )}
            </Grid>
            <Grid item xs={4} sm={4} md={6} lg={3} style={{ marginRight: '25px' }}>
              <TestCard />
              <QuickLinksCard />
            </Grid>
          </Grid>
        </Grid>
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
            <Button
              onClick={handleConfirmDelete}
              variant='contained'
              style={{ height: '38px', width: '94px' }}
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </>
  )
}

export default QuestionList
