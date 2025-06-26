import type { FC } from 'react';
import { List, ListItem, ListItemText, IconButton, Typography, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, ListItemButton, Pagination, Slider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { PainEntry } from '../types/pain';
import { format } from 'date-fns';
import { useState } from 'react';

interface PainListProps {
  entries: PainEntry[];
  onDelete: (id: string) => void;
  onIntensityChange?: (id: string, value: number) => void;
}

export const PainList: FC<PainListProps> = ({ entries, onDelete, onIntensityChange }) => {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [selected, setSelected] = useState<PainEntry | null>(null);
  const [page, setPage] = useState(1);
  // Mostra todas as dores, mais recentes primeiro
  const shownEntries = entries.slice().reverse();
  const itemsPerPage = 5;
  const pageCount = Math.ceil(shownEntries.length / itemsPerPage);
  const paginatedEntries = shownEntries.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  if (!shownEntries.length) {
    return <Typography align="center" sx={{ mt: 4 }}>Nenhum registro recente.</Typography>;
  }
  return (
    <Paper elevation={3} sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2, background: 'rgba(40,40,40,0.95)', borderRadius: 3 }}>
      <Typography variant="h6" gutterBottom align="center" fontWeight={600}>Todas as Dores Registradas</Typography>
      <List>
        {paginatedEntries.map(entry => (
          <ListItem key={entry.id} sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ListItemButton onClick={() => setSelected(entry)} sx={{ flexGrow: 1, pr: 2 }}>
                <ListItemText
                  primary={`[${format(entry.timestamp, 'dd/MM HH:mm')}] ${entry.location}`}
                  secondary={entry.comment ? 'Clique para ver comentário' : undefined}
                />
              </ListItemButton>
              <IconButton edge="end" aria-label="delete" onClick={e => { e.stopPropagation(); setConfirmId(entry.id); }}>
                <DeleteIcon />
              </IconButton>
            </div>
            <Slider
              value={entry.intensity}
              onChange={(_, value) => {
                if (onIntensityChange) {
                  onIntensityChange(entry.id, value as number);
                }
                if (selected?.id === entry.id) {
                  setSelected({ ...entry, intensity: value as number });
                }
              }}
              min={1}
              max={10}
              step={1}
              marks
              valueLabelDisplay="auto"
              sx={{ mt: 1 }}
            />
          </ListItem>
        ))}
      </List>
      {pageCount > 1 && (
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_, value) => setPage(value)}
          sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
        />
      )}
      <Dialog open={!!confirmId} onClose={() => setConfirmId(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>Tem certeza que deseja excluir este registro?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmId(null)}>Cancelar</Button>
          <Button color="error" onClick={() => { if (confirmId) { onDelete(confirmId); setConfirmId(null); } }}>Excluir</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Detalhes do Registro</DialogTitle>
        <DialogContent sx={{ minHeight: 120 }}>
          {selected && (
            <>
              <Typography><b>Data:</b> {format(selected.timestamp, 'dd/MM/yyyy HH:mm')}</Typography>
              <Typography><b>Local:</b> {selected.location}</Typography>
              <Typography><b>Intensidade:</b> {selected.intensity}</Typography>
              <Typography sx={{ mt: 2 }}><b>Comentário:</b> {selected.comment || 'Nenhum'}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
