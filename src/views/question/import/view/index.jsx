'use client'

import React, { useState, useEffect } from 'react'

// import useQuestionApi from '../../../Api/useQuestionApi'
import { Box, CircularProgress } from '@mui/material'
import { useSelector } from 'react-redux'

import QuestionCard from '../../list/QuestionCard'
import TableFilters from '../../list/TableFilters'
import Tablefor from './Tablefor'
import useQuestionModuleApi from '@/api/useQuestionModuleApi'

const ImportView = () => {
  const [expandedPanels, setExpandedPanels] = useState([]) // Tracks which panels are expanded
  const [isVisible, setIsVisible] = useState(false) // Controls visibility of questions
  const [showAnswers, setShowAnswers] = useState([]) // Tracks which panels' answers are shown

  const [isExpandedAll, setIsExpandedAll] = useState(false) // Tracks if all are expanded
  const { uploadData, uploadFiles, file, uploadingData, uploadFiled } = useQuestionModuleApi()
  const [fileReferences, setFileReferences] = useState([])
  const { files, uploading, error } = useSelector(state => state.fileReducer)

  const createFileArray = fileList => {
    return Array.from(fileList)?.map(file => ({
      path: file?.name,
      name: file?.name,
      lastModified: file?.lastModified,
      lastModifiedDate: new Date(file?.lastModified),
      size: file?.size,
      type: file?.type,
      webkitRelativePath: file?.webkitRelativePath || ''
    }))
  }

  // Simulated file input (e.g., coming from an <input type="file"> or drag-and-drop)
  const fileList = [
    new File(['file content'], 'BulkQuestionUpload.txt', {
      type: 'text/plain',
      lastModified: 1726239009248
    })
  ]

  useEffect(() => {
    if (files?.length > 0) {
      uploadFiles(files) // Call the API with the files if they exist
    }
  }, [files])

  // useEffect(() => {
  //   uploadFiles(files)
  // }, [])
  // const questionsArray = [
  //   {
  //     question: 'Who among the following got the Bharat Ratna award before becoming the president of India?',
  //     options: ['R Venkataraman', 'Dr. Rajendra Prasad', 'DR Zakir Hussian', 'W Giri'],
  //     correctAnswer: 'DR Zakir Hussian'
  //   },
  //   {
  //     question: 'Who is the first non-indian to receive the Bharat Ratna?',
  //     options: ['Martin Luther King', 'Mother Terasa', 'Khan Abdul Ghaffar Khan', 'Aubin Mehta'],
  //     correctAnswer: 'Khan Abdul Ghaffar Khan'
  //   },
  //   {
  //     question: 'When did Mother Teresa win the Nobel Peace Prize?',
  //     options: ['1975', '1979', '1981', '1982'],
  //     correctAnswer: '1979'
  //   },
  //   {
  //     question: 'Which one of the following glasses is used in bullet proof screens?',
  //     options: ['Soda glass', 'Pyrex glasss', 'Jena glass', 'Reinforced glass'],
  //     correctAnswer: 'Reinforced glass'
  //   },
  //   {
  //     question: 'Which substance is used to retard the setting action of cement?',
  //     options: ['CaO', 'AlO', 'CaSO4.2H2O', 'NaO + KO'],
  //     correctAnswer: 'CaSO4.2H2O'
  //   },
  //   {
  //     question: 'The mineral in which India depends largely on imports is',
  //     options: ['Iron Ore', 'Bauxite', 'Mica', 'Mercury'],
  //     correctAnswer: 'Mercury'
  //   },
  //   {
  //     question: 'Was Babur the last Mughal Emperor of India?',
  //     options: ['Yes', 'No'],
  //     correctAnswer: 'No'
  //   },
  //   {
  //     question: 'The longest mountain range in the world is',
  //     options: ['The Alps', 'The Himalayas', 'The Andes', 'The Rockies'],
  //     correctAnswer: 'The Andes'
  //   },
  //   {
  //     question: 'The most populous city in the world is',
  //     options: ['Paris', 'London', 'Peking', 'Tokyo'],
  //     correctAnswer: 'Paris'
  //   },
  //   {
  //     question: 'Which state produces maximum soyabean?',
  //     options: ['Madhya Pradesh', 'Uttar Pradesh', 'Bihar', 'Rajasthan'],
  //     correctAnswer: 'Madhya Pradesh'
  //   },
  //   {
  //     question: 'Which one among the following radiations carries maximum energy?',
  //     options: ['Ultraviolet rays', 'Gamma rays', 'X- rays', 'Infra red rays'],
  //     correctAnswer: 'Gamma rays'
  //   },
  //   {
  //     question: 'Bokaro Steel Limited was established with the assistance of',
  //     options: ['Germany', 'Soviet Union', 'UK', 'USA'],
  //     correctAnswer: 'UK'
  //   },
  //   {
  //     question: 'The headquarters of world trade organisation is in',
  //     options: ['montreal', 'seatle', 'geneva', 'the hague'],
  //     correctAnswer: 'geneva'
  //   },
  //   {
  //     question: 'The 2014 football world cup was NOT held in',
  //     options: ['China', 'Australia', 'Japan', 'Brazil'],
  //     correctAnswer: 'China, Australia, Japan'
  //   },
  //   {
  //     question: 'The Second Italian Satellite launched from Soviet Union was',
  //     options: ['Rohini', 'Aryabhatta', 'Bhaskara–1', 'Apsara'],
  //     correctAnswer: 'Bhaskara–1'
  //   },
  //   {
  //     question: 'The metal whose salts are sensitive to light is',
  //     options: ['Silver', 'Zinc', 'Copper', 'Gold'],
  //     correctAnswer: 'Silver'
  //   },
  //   {
  //     question: 'The instrument useful for measuring curvature of surface is',
  //     options: ['Odometer', 'Spherometer', 'Tachometer', 'Speedometer'],
  //     correctAnswer: 'Spherometer'
  //   },
  //   {
  //     question: 'The brain fever which affects young children is',
  //     options: ['Malaria', 'Typhoid', 'Encephatitis', 'Pneumonia'],
  //     correctAnswer: 'Encephatitis'
  //   },
  //   {
  //     question: 'Which of the following cash crops is not grown in Kerala?',
  //     options: ['Spices', 'Tobacco', 'Rubber', 'Coffee'],
  //     correctAnswer: 'Tobacco'
  //   },
  //   {
  //     question: 'The highest peak in South India is',
  //     options: ['Dhottabetta', 'Nandadevi', 'Anaimudi', 'Mt. Abu'],
  //     correctAnswer: 'Anaimudi'
  //   },
  //   {
  //     question: 'The age of retirement of a Judge of a supreme court is 65 years',
  //     options: ['True', 'False'],
  //     correctAnswer: 'True'
  //   }
  // ]

  const filesArray = createFileArray(fileList)

  useEffect(() => {
    // uploadFiles(filesArray)
  }, [])

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

  const [filteredData, setFilteredData] = useState(uploadData || []) // Initialize with data from API

  // const { uploadData } = useQuestionApi(); // Fetching uploadData from the hook

  useEffect(() => {
    if (uploadData) {
      setFilteredData(uploadData) // Make sure uploadData is set here
    }
  }, [uploadData])

  // console.log(uploadData, 'checking')

  // const questions = uploadData
  //   ?.filter(item => item.question !== null) // Filter out items with a null question
  //   .map((item, index) => {
  //     // For each item in questionsArray
  //     if (item.options) {
  //       // For multiple-choice questions, convert correctAnswer to [1, 0, 0, 0] format
  //       const correctAnswerIndex = item.options.indexOf(item.correctAnswer)
  //       const updatedCorrectAnswer = item.options.map((_, idx) => (idx === correctAnswerIndex ? '1' : '0'))

  //       return {
  //         id: index + 1,
  //         text: item.question,
  //         options: item.options,
  //         correctanswer: updatedCorrectAnswer // Use the updated correct answer format
  //       }
  //     }

  //     return {
  //       id: index + 1,
  //       text: item.question,
  //       options: item.options,
  //       correctanswer: item.correctAnswer
  //     }
  //   })
  const questionss = Object.keys(uploadData)
    .filter(key => uploadData?.[key]?.question !== null) // Filter out items with a null question
    .map((key, index) => {
      const item = uploadData?.[key]

      // Extract the values from each question object
      const { choice, correct_answer, question, parent_id, created_by, order, question_type, guid } = item

      // If choices exist (i.e., a multiple-choice question)
      if (choice) {
        return {
          guid: guid,
          id: index + 1,
          text: question,
          options: choice, // Use 'choice' for options
          correctanswer: correct_answer, // Use 'correct_answer' from the object
          order, // Optionally include order if needed
          created_by, // Include the created_by field
          parent_id, // Include the parent_id field
          question_type // Include the question_type field (e.g., "mcq", "mcma")
        }
      }

      // For other question types that may not have choices
      return {
        guid: guid,
        id: index + 1,
        text: question,
        correctanswer: correct_answer,
        parent_id,
        created_by,
        question_type
      }
    })

  // console.log(questionss, 'questionss')
  const [selectedQuestions, setSelectedQuestions] = useState([]) // Track selected checkboxes in QuestionCard

  // console.log(questions, 'questions')
  // Pass this to QuestionCard to manage checkbox selections
  const handleCheckboxChange = (questionId, isChecked) => {
    if (isChecked) {
      setSelectedQuestions([...selectedQuestions, questionId]) // Add question to selected list
    } else {
      setSelectedQuestions(selectedQuestions?.filter(id => id !== questionId)) // Remove from list
    }
  }

  // const handleCancelDelete = () => {
  //   setUserToDelete(null)
  //   setOpen(false)
  // }
  // const handleConfirmDelete = () => {
  //   // setData(data?.filter(product => product.id !== userToDelete))
  //   // setUserToDelete(null)
  //   // setOpen(false)
  // }
  // const handleExpandAll = () => {
  //   setIsVisible(true) // Show the questions
  //   setExpandedPanels(questions.map(q => q.id)) // Expand all panels
  //   setShowAnswers([]) // Reset showing answers (no answers shown)
  //   setIsExpandedAll(true) // Set the expanded state
  // }
  const handleDeleteClick = () => {
    if (selectedQuestions?.length > 0) {
      setOpenDeleteDialog(true)
    }
  }

  const handleExpandAll = () => {
    setIsVisible(true) // Show the questions
    setExpandedPanels(questionss?.map(q => q?.id)) // Expand all panels
    setShowAnswers([]) // Reset showing answers (no answers shown)
    setIsExpandedAll(true) // Set the expanded state
  }

  const width = '100%'
  const marginLeft = '0px'

  return (
    <>
      {/* <Tablefor /> */}
      {questionss?.length > 0 && (
        <QuestionCard
          check={'true'}
          marginLeft={marginLeft}
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
          questions={questionss}
          isExpandedAll={isExpandedAll}
          setIsExpandedAll={setIsExpandedAll}
          onQuestionSelect={handleCheckboxChange}
          selectedQuestions={selectedQuestions}
          setSelectedQuestions={setSelectedQuestions}
        />
      )}
      {/* // ) : ( //{' '}
      <>
        //{' '}
        <Box className='loader' style={{ textAlign: 'center', padding: '50px 0px' }}>
          // <CircularProgress />
          //{' '}
        </Box>
        //{' '}
      </> */}
    </>
  )
}

export default ImportView
