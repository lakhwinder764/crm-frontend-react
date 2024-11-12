'use client'
import { useEffect, useState } from 'react'
import { ApiRequestHandle } from '@/libs/axios'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { file } from 'valibot'
// import { USER_MODULE_ENDPOINTS } from '../Const/ApiEndpoints'

export default function useQuestionModuleApi() {
  const [data, setData] = useState([])
  const [file, setFiles] = useState([])
  const router = useRouter()
  const [loader, setLoader] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadData, setUploadData] = useState([]) // Fix typo here
  const [allquestionData, setallquestionData] = useState([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const fetchData = async () => {
    try {
      const endpoint = `https://developer1.website/dev/caapis/dev/tests/questions/eng2` // Construct the full URL

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_LMS_TOKEN}`, // Add Authorization header
          Network: process.env.NEXT_PUBLIC_LMS_TOKEN, // Add Network header
          Accept: 'application/json' // Specify the accepted response format
        }
      })
      setLoader(false)
      setData(response.data?.payload) // Update the state with the fetched data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  console.log(data, 'check123')
  const uploadFiles = async files => {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('userfile', file)
      console.log(file, 'eeeee')
    })
    setFiles(files)
    try {
      setUploading(true)
      const response = await axios.post(`https://developer1.website/dev/caapis/dev/qb/questions/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_LMS_TOKEN}`,
          Network: process.env.NEXT_PUBLIC_LMS_TOKEN
        }
      })
      setUploadData(response.data.payload.questions) // Make sure this works
      console.log(response.data.payload.questions, 'uuu')
      console.log(uploadData, 'uuu2')
    } catch (error) {
      console.error('Error uploading files:', error)
      alert('Failed to upload files. Please try again.')
    } finally {
      setUploading(false)
    }
  }
  const fetchDataallquestion = async ({ page, results_per_page }) => {
    try {
      const endpoint = `https://developer1.website/dev/caapis/dev/qb/questions/list` // Construct the full URL
      const formData = new FormData()

      // formData.append('search', searchString) // Add the search term to the formData
      formData.append('page', page) // Add pagination: current page
      formData.append('results_per_page', results_per_page) // Add pagination: results per page
      const response = await axios.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_LMS_TOKEN}`, // Add Authorization header
          Network: process.env.NEXT_PUBLIC_LMS_TOKEN, // Add Network header
          Accept: 'application/json' // Specify the accepted response format
        }
      })
      setLoader(false)
      setallquestionData(response.data?.payload) // Update the state with the fetched data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  const viewQuestion = guid => {
    // try {
    return axios.post(
      `https://developer1.website/dev/caapis/dev/qb/questions/${guid}/view`,
      {},
      {
        Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
        Network: 'dev369',
        accept: 'application/json'
      }
    )

    // ?.then(res => {
    //   setTestData(res?.data?.payload)
    // })
    // .catch(error => {
    //   console.error('Error fetching data:', error)
    // })

    // } catch (error) {
    // console.error('Error fetching data:', error)
    // }
  }
  const BulkDelete = async questionIds => {
    try {
      const formData = new FormData()

      // Append each question ID with the same key
      questionIds.forEach(id => {
        formData.append('questions[]', id)
      })

      // Send the DELETE request
      const response = await fetch(
        `https://developer1.website/dev/caapis/dev/qb/questions/delete`,
        {
          method: 'POST',
          body: formData
        },
        {
          Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
          Network: 'dev369',
          accept: 'application/json'
        }
      )

      return response.data // Return the response data for further processing if needed
    } catch (error) {
      console.error('Error deleting questions in bulk:', error)
      throw error // Rethrow error to be handled in the component if necessary
    }
  }
  const updateQuestion = async (guid, questionData, uploadedFile) => {
    try {
      const formData = new FormData()
      formData.append('question', questionData.question)
      formData.append('question_type', questionData.type)
      formData.append('marks', questionData.marksPerQuestion)
      formData.append('neg_marks', questionData.negativeMarks)
      formData.append('time', questionData.timeAllowed)
      formData.append('time_unit', questionData.timeUnit)

      // Add choices data
      questionData.choices.forEach((choice, index) => {
        formData.append(`choice[${index}]`, choice.choice)
        formData.append(`correct_answer[${index}]`, choice.correct_answer)
      })

      // Add file to the form data, if uploaded
      if (uploadedFile) {
        formData.append('userfile', uploadedFile)
      }

      const response = await axios.post(
        'https://developer1.website/dev/caapis/dev/qb/questions/${guid}/update',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LMS_TOKEN}`,
            Network: process.env.NEXT_PUBLIC_LMS_TOKEN
          }
        }
      )

      console.log('Update response:', response.data)
      return response.data // Return response for further processing
    } catch (error) {
      console.error('Error updating question:', error)
      throw error // Optionally rethrow the error to handle it in the calling component
    }
  }

  useEffect(() => {
    console.log(uploadData, 'updated uploadData')
  }, [uploadData, file])
  // Optional: Use useEffect to watch for changes in uploadData
  // useEffect(() => {
  //   if (uploadData.length > 0) {
  //     console.log('Updated UploadData:', uploadData)
  //   }
  //   uploadFiles()
  // }, [uploadData])

  // Optional: Use useEffect to watch for changes in uploadData
  // useEffect(() => {
  //   if (uploadData.length > 0) {
  //     console.log('Updated UploadData:', uploadData)
  //   }
  // }, [uploadData])
  // useEffect(() => {
  //   if (uploadData.length > 0) {
  //     console.log('UploadData:', uploadData)
  //   }
  // }, [uploadData])

  return {
    data,
    setData,
    fetchData,
    loader,
    setLoader,
    uploadFiles,
    uploading,
    uploadData,
    setUploadData,
    file,
    setFiles,
    fetchDataallquestion,
    allquestionData,
    setallquestionData,
    searchKeyword,
    setSearchKeyword,
    viewQuestion,
    BulkDelete,
    updateQuestion
  }
}
