'use client'
import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import axios from 'axios'
import { useTheme } from '@mui/material/styles'

import { QUESTION_MODULE_ENDPOINTS } from '@/Const/test/ApiEndpoints'
import { alertMessages } from '@/components/globals/AlertMessages'

export default function useQuestionApi() {
  const [data, setData] = useState([])
  const [QId, setQId] = useState(null)
  const [questionTypeFixed, setQuestionTypeFixed] = useState(false)
  const theme = useTheme()

  console.info(process.env.NEXT_PUBLIC_DOCS_URL)
  const router = useRouter()

  const createQuestion = (data, mode) => {
    //userData example
    // const data = {
    //   title: userData?.title,
    //   type: userData?.type,
    //   details: userData?.description
    // }

    const formData = new FormData()

    if (typeof data === 'object') {
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'choices') {
          value.map((choice, i) => {
            if (choice.choice) {
              formData.append(`choice[${i}]`, choice.choice)
              formData.append(`correct_answer[${i}]`, choice.correct_answer ? '1' : '0')
              formData.append(`feedback[${i}]`, choice.feedback)
              formData.append(`order[${i}]`, i)
            }
          })
        }

        if (key === 'userfile') {
          data?.userfile?.forEach(file => {
            formData.append('userfile', file)
            console.log(file, 'eeeee')
          })
        } else {
          formData.append(key, value)
        }
      })
    }

    try {
      axios
        .post(`${QUESTION_MODULE_ENDPOINTS}/${data?.guid}`, formData, {
          Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
          Network: 'dev369',
          accept: 'application/json'
        })
        .then(res => {
          if (!mode && res?.success) {
            setQuestionTypeFixed(true)
          } else {
            setQuestionTypeFixed(false)
          }

          alertMessages(theme, 'success', res?.data?.message)
          setQId(res?.data?.payload?.question_guid)
          setTimeout(() => router.push('/question/allquestion'), [2000])
        })

      //   return response.data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const editQuestion = (data, mode) => {
    //userData example
    // const data = {
    //   title: userData?.title,
    //   type: userData?.type,
    //   details: userData?.description
    // }
    const formData = new FormData()

    if (typeof data === 'object') {
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'choices') {
          value.map((choice, i) => {
            if (choice.choice) {
              formData.append(`choice[${i}]`, choice.choice)
              formData.append(`correct_answer[${i}]`, choice.correct_answer ? '1' : '0')
              formData.append(`feedback[${i}]`, choice.feedback)
              formData.append(`order[${i}]`, i)
            }
          })
        }

        if (key === 'userfile') {
          data?.userfile?.length >= 1 &&
            data?.userfile?.forEach(file => {
              formData.append('userfile', file)
              console.log(file, 'eeeee')
            })
        } else {
          formData.append(key, value)
        }
      })
    }

    try {
      axios
        .post(`${QUESTION_MODULE_ENDPOINTS}/${data?.guid}/${data?.qId}`, formData, {
          Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
          Network: 'dev369',
          accept: 'application/json'
        })
        .then(res => {
          if (!mode && res?.success) {
            setQuestionTypeFixed(true)
          } else {
            setQuestionTypeFixed(false)
          }

          alertMessages(theme, 'info', res?.data?.message)
        })

      //   return response.data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return {
    editQuestion,
    createQuestion,
    QId,
    questionTypeFixed,
    setQuestionTypeFixed
  }
}
