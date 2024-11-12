import { useState } from 'react'

import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'

const CustomPhoneInput = () => {
  const [phone, setPhone] = useState('')

  return <PhoneInput defaultCountry='ua' value={phone} onChange={phone => setPhone(phone)} />
}

export default CustomPhoneInput
