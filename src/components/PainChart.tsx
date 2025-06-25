import { FC, useEffect, useRef, useState } from 'react';
import { Box, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Chart } from 'chart.js';
import type { PainData } from '../types/pain';
import { format } from 'date-fns';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface PainChartProps {
    data: PainData;
}

export const PainChart: FC<PainChartProps> = ({ data }) => {
    const [chartData, setChartData] = useState<any>(null);
    const [selected, setSelected] = useState<any>(null);
    const chartRef = useRef<any>(null);
    const pointIdsRef = useRef<string[][]>([]); // ids dos pontos por dataset

    useEffect(() => {
        const sortedData = [...data].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        const locations = Array.from(new Set(data.map(entry => entry.location)));
        const colors = locations.map((_, i) => `hsl(${(i * 360) / locations.length}, 70%, 50%)`);
        const pointIds: string[][] = [];
        const datasets = locations.map((location, idx) => {
            const locationData = sortedData.filter(entry => entry.location === location);
            pointIds[idx] = locationData.map(entry => entry.id);
            return {
                label: location,
                data: locationData.map(entry => entry.intensity),
                borderColor: colors[idx],
                backgroundColor: colors[idx] + '80',
                pointBackgroundColor: locationData.map(entry => entry.comment ? '#ff9800' : colors[idx]),
                pointBorderColor: locationData.map(entry => entry.comment ? '#ff9800' : colors[idx]),
                pointRadius: locationData.map(entry => entry.comment ? 8 : 4),
                pointStyle: locationData.map(entry => entry.comment ? 'circle' : 'circle'),
            };
        });
        pointIdsRef.current = pointIds;
        setChartData({
            labels: sortedData.map(entry => format(entry.timestamp, 'dd/MM HH:mm')),
            datasets
        });
    }, [data]);

    useEffect(() => {
        if (!chartRef.current?.canvas) return;
        const canvas = chartRef.current.canvas || chartRef.current?.canvas;
        const handleMouseMove = (event: MouseEvent) => {
            const chart = chartRef.current?.chart || chartRef.current;
            if (!chart) return;
            const points = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
            if (points.length) {
                const { datasetIndex, index } = points[0];
                const pointIds = pointIdsRef.current;
                const id = pointIds[datasetIndex]?.[index];
                const entry = data.find(e => e.id === id && e.comment);
                if (entry) {
                    canvas.style.cursor = 'pointer';
                    return;
                }
            }
            canvas.style.cursor = 'default';
        };
        canvas.addEventListener('mousemove', handleMouseMove);
        return () => {
            canvas.removeEventListener('mousemove', handleMouseMove);
        };
    }, [chartData, data]);

    const handlePointClick = (event: any) => {
        const chart = chartRef.current?.chart || chartRef.current;
        if (!chart || !event || !event.nativeEvent) return;
        const points = chart.getElementsAtEventForMode(event.nativeEvent, 'nearest', { intersect: true }, true);
        if (points.length) {
            const { datasetIndex, index } = points[0];
            const pointIds = pointIdsRef.current;
            const id = pointIds[datasetIndex]?.[index];
            const entry = data.find(e => e.id === id && e.comment);
            if (entry) {
                setSelected(entry);
            }
        }
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Histórico de Dores',
            },
            tooltip: {
                callbacks: {
                    afterLabel: (context: any) => {
                        const dataIndex = context.dataIndex;
                        const datasetIndex = context.datasetIndex;
                        const entry = data.find(e => 
                            e.location === context.dataset.label && 
                            format(e.timestamp, 'dd/MM HH:mm') === context.label
                        );
                        return entry?.comment ? `Comentário: ${entry.comment}` : '';
                    }
                }
            }
        },
        scales: {
            y: {
                min: 0,
                max: 10,
                title: {
                    display: true,
                    text: 'Intensidade da Dor'
                }
            }
        }
    };

    if (!chartData || !data.length) {
        return (
            <Paper elevation={3} sx={{ width: '100%', maxWidth: '100%', mx: 'auto', p: 4, mt: 4, textAlign: 'center', background: 'rgba(40,40,40,0.95)', borderRadius: 3 }}>
                Nenhum registro de dor encontrado. Adicione um novo registro para visualizar o gráfico.
            </Paper>
        );
    }

    return (
        <>
        <Paper elevation={3} sx={{ width: '100%', maxWidth: '100%', mx: 'auto', p: 4, mt: 4, background: 'rgba(40,40,40,0.95)', borderRadius: 3 }}>
            <div style={{ minHeight: 500, width: '100%' }}>
                <Line ref={chartRef} data={chartData} options={options} height={500} onClick={handlePointClick} />
            </div>
        </Paper>
        <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
            <DialogTitle>Comentário do Registro</DialogTitle>
            <DialogContent sx={{ minHeight: 80 }}>
                {selected && (
                    <Typography sx={{ fontSize: 18, color: 'primary.main', whiteSpace: 'pre-line' }}>{selected.comment}</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setSelected(null)}>Fechar</Button>
            </DialogActions>
        </Dialog>
        </>
    );
};
