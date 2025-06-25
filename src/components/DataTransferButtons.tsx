import { FC, useRef } from 'react';
import { Button, Stack } from '@mui/material';
import { exportEntries, importEntries } from '../services/painStorage';

interface DataTransferButtonsProps {
    onChange: () => void;
}

export const DataTransferButtons: FC<DataTransferButtonsProps> = ({ onChange }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleExport = () => {
        const dataStr = exportEntries();
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'pain-data.json';
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleImportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                try {
                    importEntries(reader.result);
                    onChange();
                } catch (err) {
                    console.error('Erro ao importar dados', err);
                }
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    return (
        <>
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                <Button variant="outlined" onClick={handleExport}>
                    Exportar Dados
                </Button>
                <Button variant="outlined" onClick={() => fileInputRef.current?.click()}>
                    Importar Dados
                </Button>
            </Stack>
            <input
                type="file"
                accept="application/json"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImportChange}
            />
        </>
    );
};
