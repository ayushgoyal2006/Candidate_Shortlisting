import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function MatchScoreChart({ candidates }) {
  if (!candidates || candidates.length === 0) return null;

  const sorted = [...candidates].sort((a, b) => b.matchScore - a.matchScore).slice(0, 10);

  const colorMap = sorted.map((c) => {
    if (c.matchScore >= 75) return 'rgba(34, 197, 94, 0.8)';
    if (c.matchScore >= 40) return 'rgba(245, 158, 11, 0.8)';
    return 'rgba(239, 68, 68, 0.8)';
  });

  const data = {
    labels: sorted.map((c) => c.name),
    datasets: [
      {
        label: 'Match Score (%)',
        data: sorted.map((c) => c.matchScore),
        backgroundColor: colorMap,
        borderColor: colorMap.map((c) => c.replace('0.8', '1')),
        borderWidth: 1.5,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: '📊 Candidate Match Scores',
        font: { size: 14, weight: 'bold' },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y}% match`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { callback: (v) => `${v}%` },
      },
    },
  };

  return (
    <div className="card">
      <Bar data={data} options={options} />
    </div>
  );
}

export default MatchScoreChart;
