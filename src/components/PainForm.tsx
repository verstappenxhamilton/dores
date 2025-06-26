import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Box, Button, TextField, Slider, Typography, Paper, Divider } from '@mui/material';
import type { PainEntry } from '../types/pain';
import { generateId, saveEntry, getEntries } from '../services/painStorage';

interface PainFormProps {
    onSubmit: () => void;
}

export const PainForm: FC<PainFormProps> = ({ onSubmit }) => {
    const [location, setLocation] = useState('');
    const [intensity, setIntensity] = useState(5);
    const [comment, setComment] = useState('');
    const [existingLocations, setExistingLocations] = useState<string[]>([]);
    const [existingIntensities, setExistingIntensities] = useState<Record<string, number>>({});

    useEffect(() => {
        // Buscar locais únicos já registrados
        const uniqueLocations = Array.from(new Set(getEntries().map(e => e.location)));
        setExistingLocations(uniqueLocations);
        setExistingIntensities(
            uniqueLocations.reduce<Record<string, number>>((acc, loc) => {
                acc[loc] = 5;
                return acc;
            }, {})
        );
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const now = new Date();
        // Salvar intensidade para locais existentes
        existingLocations.forEach(loc => {
            const entry: PainEntry = {
                id: generateId(),
                timestamp: now,
                location: loc,
                intensity: existingIntensities[loc] ?? 5,
            };
            saveEntry(entry);
        });

        if (location.trim()) {
            const entry: PainEntry = {
                id: generateId(),
                timestamp: now,
                location,
                intensity,
                comment: comment || undefined,
            };
            saveEntry(entry);
        }

        // Resetar campos
        setLocation('');
        setIntensity(5);
        setComment('');
        setExistingIntensities(() => {
            const updated: Record<string, number> = {};
            existingLocations.forEach(loc => {
                updated[loc] = 5;
            });
            return updated;
        });
        onSubmit();
    };

    return (
        <Paper elevation={3} sx={{ maxWidth: 320, mx: 'auto', p: 2, mb: 3, background: 'rgba(40,40,40,0.95)', borderRadius: 3 }}>
            <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" gutterBottom align="center" fontWeight={600}>
                    Registrar Dor
                </Typography>
                {existingLocations.length > 0 && (
                  <>
                    <Typography align="center" sx={{ mt: 1 }}>
                      Locais registrados
                    </Typography>
                    {existingLocations.map(loc => (
                      <Box key={loc} sx={{ mt: 2 }}>
                        <Typography gutterBottom>{loc}</Typography>
                        <Slider
                          value={existingIntensities[loc]}
                          onChange={(_, value) =>
                            setExistingIntensities(prev => ({ ...prev, [loc]: value as number }))
                          }
                          min={1}
                          max={10}
                          step={1}
                          marks
                          valueLabelDisplay="auto"
                        />
                        <Divider sx={{ mt: 1 }} />
                      </Box>
                    ))}
                  </>
                )}
                <Typography align="center" sx={{ mt: 2 }}>
                    Novo local
                </Typography>
                <TextField
                    fullWidth
                    label="Local da Dor"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
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
        </Paper>
    );
};
