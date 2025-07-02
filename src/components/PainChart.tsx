import { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import { Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton, Box } from '@mui/material';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import CloseIcon from '@mui/icons-material/Close';
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
import type { TooltipItem } from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { PainData, PainEntry } from '../types/pain';
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [chartData, setChartData] = useState<any>(null);
    const [selected, setSelected] = useState<PainEntry | null>(null);
    const [fullscreen, setFullscreen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chartRef = useRef<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dialogChartRef = useRef<any>(null);
    const pointIdsRef = useRef<(string | null)[][]>([]); // ids dos pontos por dataset

    useEffect(() => {
        const sortedData = [...data].sort((a, b) => a.timestamp - b.timestamp);
        const labels = sortedData.map(entry => format(new Date(entry.timestamp), 'dd/MM HH:mm'));
        const locations = Array.from(new Set(data.map(entry => entry.location)));
        const colors = locations.map((_, i) => `hsl(${(i * 360) / locations.length}, 70%, 50%)`);
        const pointIds: (string | null)[][] = [];
        const datasets = locations.map((location, idx) => {
            const values: Array<number | null> = Array(labels.length).fill(null);
            const ids: Array<string | null> = Array(labels.length).fill(null);
            sortedData.forEach((entry, i) => {
                if (entry.location === location) {
                    values[i] = entry.intensity;
                    ids[i] = entry.id;
                }
            });
            pointIds[idx] = ids;
            return {
                label: location,
                data: values,
                borderColor: colors[idx],
                backgroundColor: colors[idx] + '80',
                spanGaps: true,
                pointBackgroundColor: ids.map(id => {
                    const entry = data.find(e => e.id === id);
                    return entry?.comment ? '#ff9800' : colors[idx];
                }),
                pointBorderColor: ids.map(id => {
                    const entry = data.find(e => e.id === id);
                    return entry?.comment ? '#ff9800' : colors[idx];
                }),
                pointRadius: ids.map(id => {
                    const entry = data.find(e => e.id === id);
                    return entry?.comment ? 8 : 4;
                }),
                pointStyle: ids.map(id => {
                    const entry = data.find(e => e.id === id);
                    return entry?.comment ? 'circle' : 'circle';
                }),
            };
        });
        pointIdsRef.current = pointIds;
        setChartData({
            labels,
            datasets
        });
    }, [data]);

    useEffect(() => {
        const ref = chartRef;
        if (!ref.current?.canvas) return;
        const canvas = ref.current.canvas || ref.current?.canvas;
        const handleMouseMove = (event: MouseEvent) => {
            const chart = ref.current?.chart || ref.current;
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

    useEffect(() => {
        if (!fullscreen) return;
        const ref = dialogChartRef;
        if (!ref.current?.canvas) return;
        const canvas = ref.current.canvas || ref.current?.canvas;
        const handleMouseMove = (event: MouseEvent) => {
            const chart = ref.current?.chart || ref.current;
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
    }, [chartData, data, fullscreen]);

    useEffect(() => {
        if (fullscreen) {
            dialogChartRef.current?.resize();
        } else {
            chartRef.current?.resize();
        }
    }, [fullscreen]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handlePointClick = (event: React.MouseEvent<HTMLCanvasElement>, ref: React.MutableRefObject<any>) => {
        const chart = ref.current?.chart || ref.current;
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
        maintainAspectRatio: false,
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
                    afterLabel: (context: TooltipItem<'line'>) => {
                        const entry = data.find(e =>
                            e.location === context.dataset.label &&
                            format(new Date(e.timestamp), 'dd/MM HH:mm') === context.label
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
            <div style={{ position: 'relative', height: 500, width: '100%' }}>
                <IconButton
                    aria-label="Ampliar gráfico"
                    onClick={() => setFullscreen(true)}
                    sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, color: 'primary.main' }}
                >
                    <ZoomOutMapIcon />
                </IconButton>
                <Line ref={chartRef} data={chartData} options={options} style={{ width: '100%', height: '100%' }} onClick={e => handlePointClick(e, chartRef)} />
            </div>
        </Paper>
        <Dialog fullScreen open={fullscreen} onClose={() => setFullscreen(false)}>
            <DialogContent sx={{ bgcolor: 'background.default', p: 2, overflowX: 'auto' }}>
                <IconButton
                    aria-label="Fechar"
                    onClick={() => setFullscreen(false)}
                    sx={{ position: 'absolute', top: 8, right: 8, color: 'primary.contrastText' }}
                >
                    <CloseIcon />
                </IconButton>
                <Box sx={{ minWidth: 1000, height: '80vh' }}>
                    <Line ref={dialogChartRef} data={chartData} options={options} style={{ width: '100%', height: '100%' }} onClick={e => handlePointClick(e, dialogChartRef)} />
                </Box>
            </DialogContent>
        </Dialog>
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
