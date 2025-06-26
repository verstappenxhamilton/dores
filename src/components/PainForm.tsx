import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Box, Button, TextField, Slider, Typography, Paper, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import type { PainEntry } from '../types/pain';
import { generateId, saveEntry, getEntries } from '../services/painStorage';

interface PainFormProps {
    onSubmit: () => void;
}

export const PainForm: FC<PainFormProps> = ({ onSubmit }) => {
    const [location, setLocation] = useState('');
    const [intensity, setIntensity] = useState(5);
    const [comment, setComment] = useState('');
    const [locations, setLocations] = useState<string[]>([]);
    const [quickIntensities, setQuickIntensities] = useState<Record<string, number>>({});

    useEffect(() => {
        // Buscar locais únicos já registrados
        const uniqueLocations = Array.from(new Set(getEntries().map(e => e.location)));
        setLocations(uniqueLocations);
        const intensities: Record<string, number> = {};
        uniqueLocations.forEach(loc => { intensities[loc] = 5; });
        setQuickIntensities(intensities);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const entry: PainEntry = {
            id: generateId(),
            timestamp: Date.now(),
            location,
            intensity,
            comment: comment || undefined
        };
        saveEntry(entry);
        setLocation('');
        setIntensity(5);
        setComment('');
        onSubmit();
    };

    const handleQuickSubmit = (loc: string) => {
        const entry: PainEntry = {
            id: generateId(),
            timestamp: Date.now(),
            location: loc,
            intensity: quickIntensities[loc],
        };
        saveEntry(entry);
        setQuickIntensities(prev => ({ ...prev, [loc]: 5 }));
        onSubmit();
    };

    return (
        <Paper elevation={3} sx={{ maxWidth: 320, mx: 'auto', p: 2, mb: 3, background: 'rgba(40,40,40,0.95)', borderRadius: 3 }}>
            <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" gutterBottom align="center" fontWeight={600}>
                    Registrar Dor
                </Typography>
                {locations.length > 0 && (
                  <FormControl fullWidth margin="normal" size="small">
                    <InputLabel id="select-location-label">Escolher Local</InputLabel>
                    <Select
                      labelId="select-location-label"
                      value={location}
                      label="Escolher Local"
                      onChange={e => setLocation(e.target.value)}
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
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    margin="normal"
                    size="small"
                />
                <Box sx={{ my: 2 }}>
                    <Typography gutterBottom>Intensidade da Dor (1-10)</Typography>
                    <Slider
                        value={intensity}
                        onChange={(_, value) => setIntensity(value as number)}
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
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    multiline
                    rows={3}
                    margin="normal"
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Salvar
                </Button>
            </Box>
            {locations.length > 0 && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" align="center" gutterBottom fontWeight={500}>
                        Registro Rápido
                    </Typography>
                    {locations.map(loc => (
                        <Box key={loc} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography sx={{ width: 80 }}>{loc}</Typography>
                            <Slider
                                value={quickIntensities[loc] || 5}
                                onChange={(_, value) => setQuickIntensities(prev => ({ ...prev, [loc]: value as number }))}
                                min={1}
                                max={10}
                                step={1}
                                marks
                                valueLabelDisplay="auto"
                                sx={{ flexGrow: 1, mx: 2 }}
                            />
                            <Button variant="contained" size="small" onClick={() => handleQuickSubmit(loc)}>
                                Registrar
                            </Button>
                        </Box>
                    ))}
                </Box>
            )}
        </Paper>
    );
};
