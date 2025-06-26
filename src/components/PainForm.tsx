import { useState, useEffect } from 'react'
import type { FC } from 'react'
import {
  Box,
  Button,
  TextField,
  Slider,
  Typography,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
  Stack,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import type { PainEntry } from '../types/pain'
import { generateId, saveEntry, getEntries } from '../services/painStorage'

interface PainFormProps {
  onSubmit: () => void
}

interface EntryFormData {
  location: string
  intensity: number
  comment: string
}

export const PainForm: FC<PainFormProps> = ({ onSubmit }) => {
  const [entries, setEntries] = useState<EntryFormData[]>([
    { location: '', intensity: 5, comment: '' },
  ])
  const [locations, setLocations] = useState<string[]>([])

  useEffect(() => {
    // Buscar locais únicos já registrados
    const uniqueLocations = Array.from(new Set(getEntries().map(e => e.location)))
    setLocations(uniqueLocations)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    entries.forEach(entry => {
      const newEntry: PainEntry = {
        id: generateId(),
        timestamp: new Date(),
        location: entry.location,
        intensity: entry.intensity,
        comment: entry.comment || undefined,
      }
      saveEntry(newEntry)
    })
    setEntries([{ location: '', intensity: 5, comment: '' }])
    onSubmit()
  }

    return (
        <Paper elevation={3} sx={{ maxWidth: 320, mx: 'auto', p: 2, mb: 3, background: 'rgba(40,40,40,0.95)', borderRadius: 3 }}>
            <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" gutterBottom align="center" fontWeight={600}>
                    Registrar Dores
                </Typography>
                {entries.map((entry, idx) => (
                  <Box key={idx} sx={{ mb: 3 }}>
                    <Typography fontWeight={500} sx={{ mb: 1 }}>
                      Dor {idx + 1}
                    </Typography>
                    {locations.length > 0 && (
                      <FormControl fullWidth margin="normal" size="small">
                        <InputLabel id={`select-location-label-${idx}`}>Escolher Local</InputLabel>
                        <Select
                          labelId={`select-location-label-${idx}`}
                          value={entry.location}
                          label="Escolher Local"
                          onChange={e => {
                            const val = e.target.value
                            setEntries(prev => prev.map((en, i) => i === idx ? { ...en, location: val } : en))
                          }}
                        >
                          <MenuItem value=""><em>Novo local...</em></MenuItem>
                          {locations.map(loc => (
                            <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                    <TextField
                      fullWidth
                      label="Local da Dor"
                      value={entry.location}
                      onChange={(e) => {
                        const val = e.target.value
                        setEntries(prev => prev.map((en, i) => i === idx ? { ...en, location: val } : en))
                      }}
                      required
                      margin="normal"
                      size="small"
                    />
                    <Box sx={{ my: 2 }}>
                      <Typography gutterBottom>Intensidade da Dor (1-10)</Typography>
                      <Slider
                        value={entry.intensity}
                        onChange={(_, value) => {
                          const num = value as number
                          setEntries(prev => prev.map((en, i) => i === idx ? { ...en, intensity: num } : en))
                        }}
                        min={1}
                        max={10}
                        step={1}
                        marks
                        valueLabelDisplay="auto"
                      />
                    </Box>
                    <TextField
                      fullWidth
                      label="Comentário (opcional)"
                      value={entry.comment}
                      onChange={(e) => {
                        const val = e.target.value
                        setEntries(prev => prev.map((en, i) => i === idx ? { ...en, comment: val } : en))
                      }}
                      multiline
                      rows={3}
                      margin="normal"
                    />
                    {entries.length > 1 && (
                      <IconButton
                        aria-label="Remover dor"
                        onClick={() => setEntries(prev => prev.filter((_, i) => i !== idx))}
                        sx={{ mt: 1 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                ))}
                <Stack direction="row" justifyContent="center" spacing={2}>
                  <Button
                    variant="outlined"
                    onClick={() => setEntries(prev => [...prev, { location: '', intensity: 5, comment: '' }])}
                  >
                    Adicionar Dor
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Salvar
                  </Button>
                </Stack>
            </Box>
        </Paper>
    );
};
