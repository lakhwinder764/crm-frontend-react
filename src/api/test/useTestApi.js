'use client'
import { useEffect, useState } from 'react'

import axios from 'axios'
import { useTheme } from '@mui/material/styles'

import { toast } from 'react-toastify'
import 'react-toastify/ReactToastify.min.css'
import { IconButton, Typography } from '@mui/material'

import { USER_MODULE_ENDPOINTS } from '@/Const/test/ApiEndpoints'

import { alertMessages } from '@/components/globals/AlertMessages'

export default function useTestApi() {
  const [data, setData] = useState([])
  const [categories, setCategories] = useState([])
  const [testData, setTestData] = useState({})
  const theme = useTheme()

  console.info(process.env.NEXT_PUBLIC_DOCS_URL)

  const fetchData = () => {
    try {
      axios
        .post(
          `${USER_MODULE_ENDPOINTS}/list`,
          {},
          {
            Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
            Network: 'dev369',
            accept: 'application/json'
          }
        )
        ?.then(res => {
          setData(res?.data?.payload?.data)
        })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const getCategories = () => {
    try {
      axios
        .post(
          `${USER_MODULE_ENDPOINTS}/categories`,
          {},
          {
            Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
            Network: 'dev369',
            accept: 'application/json'
          }
        )
        ?.then(res => {
          setCategories(res?.data?.payload)
        })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const viewTest = guid => {
    // try {
    return axios.get(
      `${USER_MODULE_ENDPOINTS}/view/${guid}`,
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

  useEffect(() => {
    fetchData()
  }, [])

  const addTestData = userData => {
    //userData example
    const data = {
      title: userData?.title,
      type: 'evaluated',
      details: userData?.details,
      category: 'cat1'
    }

    const formData = new FormData()

    if (typeof data === 'object') {
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }

    try {
      axios
        .post(
          `${USER_MODULE_ENDPOINTS}/add`,

          // userData
          formData,
          {
            Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
            Network: 'dev369',
            accept: 'application/json'
          }
        )
        .then(res => {
          if (typeof res?.data?.message === 'string') {
            alertMessages(theme, 'success', res?.data?.message)
          }

          fetchData()
        })

      //   return response.data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const updateTestData = (guId, data) => {
    console.info(data)
    const formData = new FormData()

    if (typeof data === 'object') {
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }

    try {
      axios.post(`${USER_MODULE_ENDPOINTS}/add/${guId}`, formData).then(res => {
        if (typeof res?.data?.message === 'string') {
          alertMessages(theme, 'success', res?.data?.message)
        }
      })

      //   return response.data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const deleteTestData = userId => {
    try {
      return axios.delete(`${USER_MODULE_ENDPOINTS}/delete/${userId}`).then(() => fetchData())
    } catch (error) {
      alertMessages(theme, 'error', 'failed to delete test')
    }
  }

  return {
    deleteTestData,
    updateTestData,
    addTestData,
    data,
    setData,
    testData,
    viewTest,
    getCategories,
    categories
  }
}
