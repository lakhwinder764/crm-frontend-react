import { useState } from 'react'

import { Typography } from '@mui/material'

import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'

const CustomPhoneInput = ({ form }) => {
  // const [phone, setPhone] = useState('')

  return (
    <>
      <Typography fontSize={12}>Phone</Typography>
      <PhoneInput
        defaultCountry='ua'
        value={form.values.phone_no}
        onChange={phone => form.setFieldValue('phone_no', phone)}
      />
      {form.touched.phone_no && form.errors.phone_no && (
        <Typography color='error.main' fontSize={12}>
          {form.errors.phone_no}
        </Typography>
      )}
    </>
  )
}

export default CustomPhoneInput
