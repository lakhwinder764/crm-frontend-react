import React, { useState, useEffect } from 'react'

import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Divider,
  TextField,
  Box,
  IconButton,
  Grid,
  FormControl
} from '@mui/material'

import axios from 'axios'

import { toast } from 'react-toastify'

import useDraggableList from './useDraggableList' // Import the custom hook

import Reactquill from './Reactquill'

// import Tablefor from '../import/view/Tablefor'

// import TableFilters from '../../../user/components/list/TableFilters'
import Tablefor from '../import/view/Tablefor'

const QuestionCard = ({
  marginLeft,
  width,
  expandedPanels,
  setExpandedPanels,
  isVisible,
  setIsVisible,
  showAnswers,
  setShowAnswers,
  handleCollapseAll,
  handleExpandAll,
  toggleAnswer,
  questions,
  isExpandedAll,
  setIsExpandedAll,
  selectedQuestions,
  setSelectedQuestions,
  userListTable,
  allquestion,
  setSearchKeyword,
  searchKeyword,
  handleSearch,
  check
}) => {
  const [editingQuestionId, setEditingQuestionId] = useState(null) // To track which question is being edited
  const [editedText, setEditedText] = useState('') // To store the edited text for a question
  const [editingAnswerId, setEditingAnswerId] = useState(null) // To track which answer is being edited
  const [editedAnswer, setEditedAnswer] = useState('') // To store the edited text for
  // Using a custom hook for drag-and-drop
  const { items: questionList, handleDragStart, handleDragOver, handleDrop } = useDraggableList(questions)
  const [questionData, setQuestionData] = useState(questions)

  // Use useEffect to update questionData whenever questions prop changes
  useEffect(() => {
    setQuestionData(questions) // Sync the questions prop with questionData state
  }, [questions, toggleAnswer])
  console.log

  // Function to handle checkbox change
  const handleCheckboxChange = (questionId, isChecked) => {
    if (isChecked) {
      setSelectedQuestions([...selectedQuestions, questionId]) // Add question to selected list
    } else {
      setSelectedQuestions(selectedQuestions?.filter(id => id !== questionId)) // Remove from list
    }
  }

  // Handle when the user clicks on a question to edit
  const handleEditClick = (questionId, currentText) => {
    setEditingQuestionId(questionId) // Set the question ID being edited
    setEditedText(currentText) // Set the current text in the input field
    setEditingAnswerId(null)
  }

  // Handle when the user types in the input field
  const handleEditChange = e => {
    setEditedText(e.target.value)
  }

  // Handle when the user presses Enter or blurs out of the input
  const handleEditSave = questionId => {
    const updatedQuestions = questionList?.map(question =>
      question?.id === questionId ? { ...question, text: editedText } : question
    )

    // Stop editing mode
    // You would ideally call a function here to save the changes to the server or state
    console.log('Updated questions:', updatedQuestions)
    setQuestionData(updatedQuestions)
    setEditingQuestionId(null)
  }

  // Handle when the user clicks on an answer to edit
  const handleEditAnswerClick = (questionId, answerIndex, currentAnswer) => {
    setEditingAnswerId(`${questionId}-${answerIndex}`) // Set the answer ID being edited
    setEditedAnswer(currentAnswer) // Set the current answer in the input field
    setEditingQuestionId(null)
  }

  // Handle answer edit change
  const handleEditAnswerChange = e => {
    setEditedAnswer(e.target.value)
  }

  console.log('hye')

  // Handle saving the edited answer
  const handleEditAnswerSave = (questionId, answerIndex) => {
    const updatedQuestions = questionList?.map(question => {
      if (question?.id === questionId) {
        const updatedOptions = question?.options?.map((option, index) =>
          index === answerIndex ? editedAnswer : option
        )

        return { ...question, options: updatedOptions }
      }

      return question
    })

    setEditingAnswerId(null) // Stop editing mode for answer
    // You would ideally call a function here to save the changes to the server or state
    console.log('Updated questions with edited answer:', updatedQuestions)
  }

  useEffect(() => {}, [questions, isVisible, expandedPanels, questions])

  const handleImportSelected = async () => {
    if (selectedQuestions?.length === 0) {
      toast.error('Please select at least one question.')

      return
    }

    // Create a new FormData object
    const formData = new FormData()

    const selectedQuestionData = questionData?.filter(q => selectedQuestions?.includes(q.id))

    // Loop through selected questions and append to formData
    selectedQuestionData?.forEach((question, index) => {
      // Append question fields in the required form-data format
      formData?.append(`questions[${index}][question]`, question?.text) // Question text
      formData?.append(`questions[${index}][question_type]`, question?.question_type) // Assuming 'mcq' as question type

      // Append choices for the question
      question?.options?.forEach((choice, choiceIndex) => {
        formData?.append(`questions[${index}][choice][${choiceIndex}]`, choice)
      })

      question?.correctanswer?.forEach((correctanswer, correctAnswerIndex) => {
        formData?.append(`questions[${index}][correct_answer][${correctAnswerIndex}]`, correctanswer)
      })

      question?.order?.forEach((order, orderIndex) => {
        formData?.append(`questions[${index}][order][${orderIndex}]`, order)
      })
    })

    try {
      const endpoint = `https://developer1.website/dev/caapis/dev/tests/save_uploaded_questions/MAT3`

      const response = await axios.post(
        endpoint,
        formData, // Send the formData object
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LMS_TOKEN}`, // Include Authorization header
            Network: process.env.NEXT_PUBLIC_LMS_TOKEN, // Include Network header
            Accept: 'application/json', // Specify accepted response format
            'Content-Type': 'multipart/form-data' // Specify form-data content type
          }
        }
      )

      // Handle success response
      toast.success('Selected questions imported successfully!')

      setQuestionData(selectedQuestionData)
    } catch (error) {
      toast.error('Failed to import selected questions.')
    }
  }

  const handleExpandAllButton = () => {
    setIsVisible(true) // Show the questions
    setExpandedPanels(questionData?.map(q => q?.id)) // Expand all panels
    setShowAnswers(questionData?.map(q => q?.id)) // Reset showing answers (no answers shown)
    // setIsExpandedAll(true) // Set the expanded state
  }

  const handleDeleteClick = async () => {
    if (selectedQuestions?.length === 0) {
      toast.error('Please select at least one question to delete.')

      return
    }

    console.log(isVisible, 'jjjjj')

    // Get selected questions' GUIDs
    const selectedQuestionGuids = questionData
      ?.filter(question => {
        return selectedQuestions?.includes(question?.id) // Filter selected questions by their id
      })
      ?.map(question => question?.guid) // Map to GUID

    try {
      // Send the selected question GUIDs to the API for deletion
      const endpoint = `${process.env.NEXT_PUBLIC_LMS_API_URL}qb/questions/${selectedQuestionGuids}/delete`

      await axios.delete(
        endpoint,
        {},

        // Send the GUIDs in the request body
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LMS_TOKEN}`,
            Network: process.env.NEXT_PUBLIC_LMS_TOKEN,
            Accept: 'application/json'
          }
        }
      )

      // Filter out deleted questions from local state
      const updatedQuestionData = questionData?.filter(question => !selectedQuestionGuids?.includes(question?.guid))

      setQuestionData(updatedQuestionData) // Update state with remaining questions
      setSelectedQuestions([]) // Clear selected questions
      toast.success('Selected questions deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete selected questions.')
    }
  }

  const decodeHtmlEntities = html => {
    const txt = document.createElement('textarea')

    txt.innerHTML = html

    return txt.value // Return the decoded string
  }

  return (
    <>
      {check && (
        // <Tablefor
        //   handleExpandAll={handleExpandAllButton}
        //   handleCollapseAll={handleCollapseAll}
        //   handleImportSelected={handleImportSelected}
        // />
        <Tablefor
          handleExpandAll={handleExpandAllButton}
          handleCollapseAll={handleCollapseAll}
          handleImportSelected={handleImportSelected}
        />
      )}
      <Card style={{ marginTop: '50px', marginLeft: marginLeft, padding: '20px', width: width }}>
        <CardHeader
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedQuestions && selectedQuestions?.includes(questions?.id)}
                    onChange={e => handleCheckboxChange(questions?.id, e.target.checked)}
                  />
                }
                style={{ marginRight: '10px' }}
              />
            </div>
          }
          subheaderTypographyProps={{ style: { color: '#262B43E5', fontSize: '13px' } }}
          action={
            <Button onClick={isExpandedAll ? handleCollapseAll : handleExpandAll}>
              {isExpandedAll ? (
                <i className='ri-arrow-up-s-line' style={{ color: '#262B43E5' }} />
              ) : (
                <i style={{ color: '#262B43E5' }} className='ri-arrow-down-s-line' />
              )}
            </Button>
          }
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}></div>
        {/* {<Divider style={{ marginTop: '20px' }} />} */}

        {isVisible && (
          <CardContent>
            {/* <i
              className='ri-delete-bin-6-line'
              style={{ color: selectedQuestions.length > 0 ? '#007AFF' : '#8080808C' }}
              // style={{ color: isAnyRowSelected ? '#007AFF' : '#8080808C' }}
              // onClick={e => handleDeleteClick(e, 1)}
              onClick={handleDeleteClick}
            /> */}
            {questionData?.length > 0 &&
              questionData?.map((question, index) => {
                const processedText =
                  question?.text !== null && question?.text?.startsWith('#')
                    ? question?.text?.slice(1).trim()
                    : question?.text

                console.log(
                  question && question?.correctanswer && question?.correctanswer?.[index] === '1',
                  'questiondemo'
                )

                return (
                  <>
                    <Accordion
                      key={question?.id}
                      expanded={expandedPanels?.includes(question?.id)} // Check if this question is in the expandedPanels array
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(index)}
                      draggable
                      style={{
                        padding: '10px',
                        margin: '5px 0',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        cursor: 'pointer'

                        // boxShadow: 'none',
                        // border: 'none'
                      }}
                      sx={{ '& .MuiAccordionSummary-expandIconWrapper': { display: 'none' } }} // Th
                    >
                      <AccordionSummary
                        aria-controls={`panel${question?.id}-content`}
                        id={`panel${question?.id}-header`}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          {/* Checkbox for selecting questions */}
                          <FormControlLabel
                            aria-label='Select'
                            control={
                              <Checkbox
                                checked={selectedQuestions && selectedQuestions?.includes(question?.id)} // Check if this question is selected
                                onChange={e => handleCheckboxChange(question?.id, e.target.checked)} // Handle checkbox change
                              />
                            }
                            label=''
                            style={{ marginRight: '10px' }}
                          />

                          {/* Editable question text */}
                          {editingQuestionId === question?.id ? (
                            <>
                              <Reactquill
                                value={editedText}
                                onChange={setEditedText}
                                style={{ backgroundColor: 'white' }}
                                onBlur={() => handleEditSave(question?.id)} // Save on blur (when user clicks away)
                                onKeyPress={e => {
                                  if (e.key === 'Enter') handleEditSave(question?.id) // Save on pressing Enter
                                }}
                                autoFocus
                                fullWidth
                              />
                              <Button
                                // variant='contained'
                                // color='primary'
                                style={{ color: 'rgba(38, 43, 67, 0.898)', marginTop: '10px' }}
                                onClick={() => handleEditSave(question?.id)}

                                // style={{ }}
                              >
                                <i class='ri-save-line' style={{ color: 'rgba(38, 43, 67, 0.898)' }}></i>
                                Save
                              </Button>
                            </>
                          ) : (
                            <Typography
                              variant='body1'
                              style={{ flexGrow: 1, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                              onClick={() => handleEditClick(question?.id, processedText)} // Switch to editing mode on click
                              dangerouslySetInnerHTML={{
                                __html: decodeHtmlEntities(`${index + 1}. ${question?.text}`)
                              }}
                            >
                              {/* {index + 1}. {processedText} */}
                            </Typography>
                          )}
                          <Divider />
                          <Button
                            style={{ marginLeft: '20px' }}
                            variant='text'
                            onClick={e => {
                              e.stopPropagation() // Prevent accordion toggle
                              toggleAnswer(question?.id)
                            }}
                          >
                            {showAnswers?.includes(question?.id) ? (
                              <i className='ri-arrow-up-s-line' style={{ color: '#262B43E5' }} />
                            ) : (
                              <i className='ri-arrow-down-s-line' style={{ color: '#262B43E5' }} />
                            )}
                          </Button>
                        </div>
                      </AccordionSummary>
                      {showAnswers?.includes(question?.id) && (
                        <AccordionDetails style={{ marginLeft: '40px' }}>
                          {question?.options ? (
                            <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                              {question?.options?.map((option, index) => (
                                <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                  <Checkbox
                                    checked={
                                      question && question?.correctanswer && question?.correctanswer?.[index] === 1
                                    } // Check if the option is the correct one
                                    disabled // Disable checkbox to prevent user interaction
                                    sx={{
                                      '&.Mui-checked': {
                                        color: '#34C759' // Green color for the correct answer
                                      }
                                    }}
                                  />
                                  {editingAnswerId === `${question?.id}-${index}` ? (
                                    <Reactquill
                                      value={editedAnswer}
                                      onChange={setEditedAnswer}
                                      style={{ backgroundColor: 'white', flexGrow: 1 }} // Use flexGrow to take remaining space
                                      onBlur={() => handleEditAnswerSave(question?.id, index)} // Save on blur
                                      onKeyPress={e => {
                                        if (e.key === 'Enter') handleEditAnswerSave(question?.id, index) // Save on pressing Enter
                                      }}
                                      autoFocus
                                      fullWidth
                                    />
                                  ) : (
                                    <Typography
                                      style={{
                                        color: question?.correctanswer?.[index] === '1' ? '#34C759' : 'black',
                                        flexGrow: 1, // Use flexGrow to take remaining space
                                        cursor: 'pointer'
                                      }}
                                      onClick={() => handleEditAnswerClick(question?.id, index, option)} // Switch to editing mode on click
                                      dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(option) }}
                                    >
                                      {/* {option} */}
                                    </Typography>
                                  )}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <Typography variant='body2' style={{ whiteSpace: 'pre-line' }}>
                              {question?.sampleAnswer}
                            </Typography>
                          )}
                          <Box display='flex' justifyContent='space-between' alignItems='center'>
                            {/* Marks */}
                            <Box display='flex' alignItems='center'>
                              <IconButton style={{ borderRadius: '8px', background: '#F0EFF0' }}>
                                <i class='ri-percent-line' style={{ color: '#262B43E5' }} />
                              </IconButton>
                              <Box display='flex' flexDirection='column' style={{ marginLeft: '5px' }}>
                                <Typography variant='body2' style={{ color: 'black' }}>
                                  Marks:
                                </Typography>
                                <Typography>2</Typography>
                              </Box>
                            </Box>

                            {/* Category */}
                            <Box display='flex' alignItems='center'>
                              <IconButton style={{ borderRadius: '8px', background: '#F0EFF0' }}>
                                <i className='ri-list-unordered' style={{ color: '#262B43E5' }} />
                              </IconButton>
                              <Box display='flex' flexDirection='column' style={{ marginLeft: '5px' }}>
                                <Typography variant='body2' style={{ color: 'black' }}>
                                  Category:
                                </Typography>
                                <Typography variant='body2'>Quiz</Typography>
                              </Box>
                            </Box>

                            {/* Difficulty */}
                            <Box display='flex' alignItems='center'>
                              <IconButton style={{ borderRadius: '8px', background: '#F0EFF0' }}>
                                <i className='ri-compass-2-line' style={{ color: '#262B43E5' }} />
                              </IconButton>
                              <Box display='flex' flexDirection='column'>
                                <Typography variant='body2' style={{ color: 'black' }}>
                                  Difficulty
                                </Typography>
                                <Typography variant='body2'>Medium</Typography>
                              </Box>
                            </Box>

                            {/* Importance */}
                            <Box display='flex' alignItems='center'>
                              <IconButton style={{ borderRadius: '8px', background: '#F0EFF0' }}>
                                <i className='ri-information-line' style={{ color: '#262B43E5' }} />
                              </IconButton>
                              <Box display='flex' flexDirection='column' style={{ marginLeft: '5px' }}>
                                <Typography variant='body2' style={{ color: 'black' }}>
                                  Importance:
                                </Typography>
                                <Typography>High</Typography>
                              </Box>
                            </Box>
                          </Box>
                        </AccordionDetails>
                      )}
                    </Accordion>
                  </>
                )
              })}
          </CardContent>
        )}
      </Card>
    </>
  )
}

export default QuestionCard

//}tests/save_uploaded_questions/SAM8 api save
