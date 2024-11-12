'use client'
import React, { useState } from 'react'

import { MdDelete } from 'react-icons/md'
import { GoGrabber } from 'react-icons/go'
import { RiAddBoxFill } from 'react-icons/ri'
import { Stepper, Step, StepLabel, TextField, Box, IconButton, Typography } from '@mui/material'

const WorkflowStepper = ({ readOnly = true, steps, setSteps }) => {
  const [newStepTitle, setNewStepTitle] = useState('')

  const [draggedIndex, setDraggedIndex] = useState(null)

  const handleDeleteStep = indexToDelete => {
    setSteps(prevSteps => prevSteps.filter((_, index) => index !== indexToDelete))
  }

  const handleAddStep = () => {
    if (newStepTitle.trim()) {
      setSteps([...steps, { label: newStepTitle, description: '' }])
      setNewStepTitle('')
    }
  }

  const handleEditStep = (index, newLabel) => {
    const updatedSteps = steps.map((step, i) => (i === index ? { ...step, label: newLabel } : step))

    setSteps(updatedSteps)
  }

  const handleDragStart = index => {
    setDraggedIndex(index)
  }

  const handleDragOver = index => {
    if (draggedIndex !== null && draggedIndex !== index) {
      const newSteps = [...steps]
      const draggedItem = newSteps[draggedIndex]

      // Remove dragged item and place it at the new index
      newSteps.splice(draggedIndex, 1)
      newSteps.splice(index, 0, draggedItem)

      setSteps(newSteps)
      setDraggedIndex(index)
    }
  }

  return (
    <>
      <Stepper orientation='vertical' nonLinear>
        {steps.map((step, index) => (
          <Step
            key={index}
            onDragOver={() => handleDragOver(index)}
            style={{
              cursor: 'grab'
            }}
          >
            <div
              draggable
              onDragStart={() => (!readOnly ? handleDragStart(index) : null)}
              onDragEnd={() => (!readOnly ? setDraggedIndex(null) : null)} // Reset dragged index on drag end
            >
              <StepLabel>
                <Box
                  borderRadius={0.5}
                  sx={{
                    ...(!readOnly && {
                      border: '1px solid #9c9c9c',
                      width: '100%',
                      background: '#fcfcfc'
                    })
                  }}
                  display='flex'
                  justifyContent='space-between'
                >
                  <Box display='flex' alignItems='center'>
                    {!readOnly && (
                      <IconButton
                        size='small'
                        disableRipple
                        disableFocusRipple
                        style={{
                          cursor: 'grab'
                        }}
                      >
                        <GoGrabber />
                      </IconButton>
                    )}
                    {readOnly ? (
                      <Typography fontWeight='bold'>{step.label}</Typography>
                    ) : (
                      <TextField
                        label=''
                        variant='outlined'
                        value={step.label}
                        onChange={e => handleEditStep(index, e.target.value)}
                        InputLabelProps={{
                          shrink: false // Ensures the label space is removed
                        }}
                        size='small'
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              border: 'none'
                            }
                          }
                        }}
                      />
                    )}
                  </Box>
                  {!readOnly && (
                    <IconButton onClick={() => handleDeleteStep(index)}>
                      <MdDelete />
                    </IconButton>
                  )}
                </Box>
              </StepLabel>
            </div>
          </Step>
        ))}
      </Stepper>
      {!readOnly && (
        <Box sx={{ marginTop: 3 }} display='flex' alignItems='center'>
          <TextField
            label=''
            variant='outlined'
            value={newStepTitle}
            placeholder='Add Stage'
            size='small'
            fullWidth
            onChange={e => setNewStepTitle(e.target.value)}
          />
          <IconButton color='primary' onClick={handleAddStep} size='small' disableRipple>
            <RiAddBoxFill
              style={{
                width: '55px',
                height: '35px'
              }}
            />
          </IconButton>
        </Box>
      )}
    </>
  )
}

export default WorkflowStepper
