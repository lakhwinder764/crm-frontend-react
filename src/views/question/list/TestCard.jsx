import React, { useState } from 'react'
import { Card, CardContent, Typography, Switch, Grid, Chip, Divider } from '@mui/material'

const TestCard = () => {
  // State to track if the test is published or unpublished
  const [isPublished, setIsPublished] = useState(false)

  // Function to handle switch toggle
  const handleSwitchChange = event => {
    setIsPublished(event.target.checked)
  }

  return (
    <Card style={{ maxWidth: 300, margin: '0 auto', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', marginTop: '50px' }}>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          Test Title
        </Typography>
        <Typography variant='body2' color='textSecondary'>
          Mathematics
        </Typography>
        <Divider style={{ marginTop: '10px' }} />
        <Grid container style={{ marginTop: 10 }}>
          <Grid item xs={6}>
            <Typography variant='body2' style={{ color: '#262B43B2' }}>
              Sections
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='body2' align='right'>
              5
            </Typography>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={6}>
            <Typography variant='body2'>Questions</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='body2' align='right'>
              50
            </Typography>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={6}>
            <Typography variant='body2'>Total Marks</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='body2' align='right'>
              100
            </Typography>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={6}>
            <Typography variant='body2'>Time</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='body2' align='right'>
              60m
            </Typography>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={6}>
            <Typography variant='body2'>Negative Marking</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='body2' align='right'>
              -0.5
            </Typography>
          </Grid>
        </Grid>

        <Grid container style={{ marginTop: 10 }}>
          <Grid item xs={6}>
            <Typography variant='body2'>Test Type</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='body2' align='right' style={{ color: '#4caf50' }}>
              <Chip label='Practice' variant='tonal' color='success' size='small' />
            </Typography>
          </Grid>
        </Grid>

        <Grid container alignItems='center' style={{ marginTop: 10 }}>
          <Grid item xs={6}>
            <Typography variant='body2'>{isPublished ? 'Published' : 'Unpublished'}</Typography>
          </Grid>
          <Grid item xs={6} align='right'>
            <Switch checked={isPublished} onChange={handleSwitchChange} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default TestCard