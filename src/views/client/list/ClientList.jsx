'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
//new components33
import useTestApi from '@/api/test/useTestApi'
import useClientsApi from '@/api/clients/useClientsApi'
import ClientForm from '../form/ClientForm'
import TestListTable from '@/views/test/list/TestListTable'
import TableFilters from './TableFilters'

const ClientList = () => {
  const { addClientsData, updateClientsData, deleteClientsData, clientsData, viewClientsData } = useClientsApi()

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TestListTable
          headingTitle='All Clients'
          subtitle='list of Clients'
          initialColumns={[
            'select',
            'title',
            'created_by',
            'questions',
            'enrolment',
            'submission',
            'type',
            'status',
            'action'
          ]}
          tableData={clientsData}
          addUserData={addClientsData}
          updateUserData={updateClientsData}
          deleteUserData={deleteClientsData}
          formComponent={ClientForm}
          viewTest={viewClientsData}
          title='Add new Client'
          filterComponent={TableFilters}
        />
      </Grid>
    </Grid>
  )
}

export default ClientList
