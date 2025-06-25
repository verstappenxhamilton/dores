import { useState, useEffect } from 'react'
import { Container, CssBaseline, ThemeProvider, createTheme, Typography, Snackbar, Alert } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { PainForm } from './components/PainForm'
import { PainChart } from './components/PainChart'
import { PainList } from './components/PainList'
import { getEntries, removeEntry } from './services/painStorage'
import type { PainData } from './types/pain'

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

function App() {
  const [painData, setPainData] = useState<PainData>([])
  const [openSnackbar, setOpenSnackbar] = useState(false)

  useEffect(() => {
    setPainData(getEntries())
  }, [])

  const handleNewEntry = () => {
    setPainData(getEntries())
    setOpenSnackbar(true)
  }

  const handleDelete = (id: string) => {
    removeEntry(id)
    setPainData(getEntries())
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom fontWeight={700} letterSpacing={1}>
          Registro de Dores
        </Typography>
        <Grid container spacing={3} justifyContent="center" alignItems="flex-start">
          <Grid item xs={12} md={5}>
            <PainForm onSubmit={handleNewEntry} />
          </Grid>
          <Grid item xs={12} md={7}>
            <PainList entries={painData} onDelete={handleDelete} />
          </Grid>
        </Grid>
        <PainChart data={painData} />
        <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
            Registro salvo com sucesso!
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  )
}

export default App
