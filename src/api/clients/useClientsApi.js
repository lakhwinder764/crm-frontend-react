'use client'
import { useEffect, useState } from 'react'

import axios from 'axios'
import { useTheme } from '@mui/material/styles'

import { toast } from 'react-toastify'
import 'react-toastify/ReactToastify.min.css'
import { IconButton, Typography } from '@mui/material'

import { USER_MODULE_ENDPOINTS } from '@/Const/test/ApiEndpoints'

import { alertMessages } from '@/components/globals/AlertMessages'

export default function useClientsApi() {
  const [clientsData, setClientsData] = useState([])
  const theme = useTheme()

  const fetchClientsData = () => {
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
          setClientsData(res?.data?.payload?.data)
        })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const viewClientsData = guid => {
    return axios.get(
      `${USER_MODULE_ENDPOINTS}/view/${guid}`,
      {},
      {
        Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
        Network: 'dev369',
        accept: 'application/json'
      }
    )
  }

  useEffect(() => {
    fetchClientsData()
  }, [])

  const addClientsData = userData => {
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
        .post(`${USER_MODULE_ENDPOINTS}/add`, formData, {
          Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
          Network: 'dev369',
          accept: 'application/json'
        })
        .then(res => {
          if (typeof res?.data?.message === 'string') {
            alertMessages(theme, 'success', res?.data?.message)
          }

          fetchClientsData()
        })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const updateClientsData = (guId, data) => {
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

  const deleteClientsData = userId => {
    try {
      return axios.delete(`${USER_MODULE_ENDPOINTS}/delete/${userId}`).then(() => fetchClientsData())
    } catch (error) {
      alertMessages(theme, 'error', 'failed to delete test')
    }
  }

  return {
    deleteClientsData,
    updateClientsData,
    addClientsData,
    clientsData,
    setClientsData,
    viewClientsData
  }
}
