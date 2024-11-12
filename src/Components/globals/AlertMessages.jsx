import { IconButton, Typography } from '@mui/material'
import { toast } from 'react-toastify'

export const alertMessages = (theme, type, title = '', subtitle = '') => {
  function convertString(input) {
    return input
      .toLowerCase() // Convert the entire string to lowercase
      .split('_') // Split the string by underscores
      .map(word => word?.charAt(0)?.toUpperCase() + word?.slice(1)) // Capitalize the first letter
      .join(' ') // Join the words with a space
  }

  return toast(
    t => (
      <div className={`is-full flex ${subtitle?.length ? 'items-start' : 'items-center'} justify-between`}>
        <div className='flex items-center'>
          <img
            src={
              type === 'error'
                ? '/images/icons/error.svg'
                : type === 'success'
                  ? '/images/icons/success.svg'
                  : type === 'info'
                    ? '/images/icons/info.svg'
                    : '/images/icons/success.svg'
            }
            alt='no_img'
            style={{
              width: '30px',
              height: '30px',
              marginRight: 10,

              marginTop: subtitle?.length ? -10 : 0
            }}
          />
          <div className='flex flex-col gap-0.5'>
            <Typography color='common.white' className='font-medium'>
              {convertString(title)}
            </Typography>
            <Typography variant='caption' color='common.white'>
              {subtitle}
            </Typography>
          </div>
        </div>
        <IconButton size='small' onClick={() => toast.dismiss(t.toastProps.toastId)}>
          <i
            className='ri-close-line text-xl '
            style={{
              color: theme?.palette.common.white
            }}
          />
        </IconButton>
      </div>
    ),
    {
      style: {
        minWidth: '300px',
        background:
          type === 'error'
            ? theme.palette.error.main
            : type === 'success'
              ? theme.palette.success.main
              : type === 'info'
                ? theme.palette.info.main
                : theme.palette.success.main
      },
      closeButton: false
    }
  )
}
