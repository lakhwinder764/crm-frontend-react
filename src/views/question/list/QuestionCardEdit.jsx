import React, { useState, useEffect } from 'react'

import { useSearchParams, useRouter } from 'next/navigation'

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
import PaginationCard from '@/api/Pagination'

const QuestionCardEdit = ({
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
  handleCheckboxChange,
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

  const handleEditClick = (questionId, currentText) => {
    setEditingQuestionId(questionId) // Set the question ID being edited
    setEditedText(currentText) // Set the current text in the input field
    setEditingAnswerId(null)
  }

  // Handle when the user types in the input field

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

  // Handle saving the edited answer
  useEffect(() => {}, [questions, isVisible, expandedPanels, questions])
  console.log(editedAnswer, 'gg')

  const handleImportSelected = async () => {
    if (selectedQuestions?.length === 0) {
      toast.error('Please select at least one question.')

      return
    }

    // Create a new FormData object
    const formData = new FormData()

    const selectedQuestionData = questionData?.filter(q => selectedQuestions?.includes(q?.id))

    // Loop through selected questions and append to formData
    selectedQuestionData?.forEach((question, index) => {
      // Append question fields in the required form-data format
      formData.append(`questions[${index}][question]`, question?.text) // Question text
      formData.append(`questions[${index}][question_type]`, question?.question_type) // Assuming 'mcq' as question type

      // Append choices for the question
      question?.options?.forEach((choice, choiceIndex) => {
        formData.append(`questions[${index}][choice][${choiceIndex}]`, choice)
      })

      question?.correctanswer?.forEach((correctanswer, correctAnswerIndex) => {
        formData.append(`questions[${index}][correct_answer][${correctAnswerIndex}]`, correctanswer)
      })

      question?.order?.forEach((order, orderIndex) => {
        formData.append(`questions[${index}][order][${orderIndex}]`, order)
      })
    })

    try {
      const endpoint = `${process.env.NEXT_PUBLIC_LMS_API_URL}tests/save_uploaded_questions/MAT3`

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

  const router = useRouter()

  const handleAccordionClick = guid => {
    router.push(`/question/edit?guid=${guid}`) // Redirect to question edit page with the question's guid
  }

  const decodeHtmlEntities = html => {
    const txt = document.createElement('textarea')

    txt.innerHTML = html

    return txt.value // Return the decoded string
  }

  return (
    <>
      {check && (
        <Tablefor
          handleExpandAll={handleExpandAllButton}
          handleCollapseAll={handleCollapseAll}
          handleImportSelected={handleImportSelected}
        />
      )}
      <Card style={{ marginTop: '50px', padding: '20px', width: width }}>
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

        {isVisible && (
          <CardContent>
            {questionData?.length > 0 &&
              questionData?.map((question, index) => {
                const processedText =
                  question?.text !== null && question?.text?.startsWith('#')
                    ? question?.text?.slice(1).trim()
                    : question?.text

                return (
                  <Accordion
                    key={question?.id}
                    expanded={expandedPanels?.includes(question?.id)} // Check if this question is expanded
                    onChange={() => toggleAnswer(question?.id)} // Toggle the answer on accordion change
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(index)}
                    draggable
                    style={{
                      padding: '10px',
                      margin: '5px 0',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      backgroundColor: '#fff',
                      cursor: 'pointer'
                    }}
                    sx={{ '& .MuiAccordionSummary-expandIconWrapper': { display: 'none' } }} // Hide the expand icon
                  >
                    <AccordionSummary aria-controls={`panel${question?.id}-content`} id={`panel${question?.id}-header`}>
                      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <FormControlLabel
                          aria-label='Select'
                          control={
                            <Checkbox
                              checked={selectedQuestions && selectedQuestions?.includes(question?.guid)}
                              onChange={e => handleCheckboxChange(question?.guid, e.target.checked)}
                            />
                          }
                          label=''
                          style={{ marginRight: '10px' }}
                        />

                        <Typography
                          variant='body1'
                          style={{ flexGrow: 1, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                          onClick={() => handleEditClick(question?.id, processedText)}
                          dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(`${index + 1}. ${question?.text}`) }}
                        ></Typography>

                        {/* Button to toggle answers directly on the accordion */}
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

                        <Button
                          style={{ color: 'rgba(38, 43, 67, 0.898)', marginTop: '10px' }}
                          onClick={() => handleAccordionClick(question?.guid)}
                        >
                          <i className='ri-edit-box-line' style={{ color: 'rgba(38, 43, 67, 0.898)' }}></i>
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
                                    question && question?.correctanswer && question?.correctanswer?.[index] === '1'
                                  }
                                  disabled
                                  sx={{
                                    '&.Mui-checked': {
                                      color: '#34C759'
                                    }
                                  }}
                                />
                                <Typography
                                  style={{
                                    color: question?.correctanswer?.[index] === '1' ? '#34C759' : 'black',
                                    flexGrow: 1,
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => handleEditAnswerClick(question?.id, index, option)}
                                  dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(option) }}
                                ></Typography>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          ''
                        )}
                        <Box display='flex' justifyContent='space-between' alignItems='center'>
                          {/* Marks */}
                          <Box display='flex' alignItems='center'>
                            <IconButton style={{ borderRadius: '8px', background: '#F0EFF0' }}>
                              <i className='ri-percent-line' style={{ color: '#262B43E5' }} />
                            </IconButton>
                            <Box display='flex' flexDirection='column' style={{ marginLeft: '5px' }}>
                              <Typography variant='body2' style={{ color: 'black' }}>
                                Marks:
                              </Typography>
                              <Typography>{question?.marks}</Typography>
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
                )
              })}
          </CardContent>
        )}
      </Card>
    </>
  )
}

export default QuestionCardEdit

//}tests/save_uploaded_questions/SAM8 api save
