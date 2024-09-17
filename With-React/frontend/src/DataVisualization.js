import React, { useEffect, useState } from 'react';
import Plotly from 'plotly.js';

const DataVisualization = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/api/data')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Simulasi data yang diambil untuk memiliki 1000 poin pada x dan y
                const x = Array.from({ length: 1000 }, (_, i) => i + 1);
                const y = Array.from({ length: 1000 }, () => Math.floor(Math.random() * 100));

                setData({ x, y });  // Data disimpan di state
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (data) {
            const plotElement = document.getElementById('plot');
            if (plotElement) {
                Plotly.newPlot(plotElement, [{
                    x: data.x,
                    y: data.y,
                    type: 'scatter'
                }]);
            }
        }

        return () => {
            const plotElement = document.getElementById('plot');
            if (plotElement) {
                Plotly.purge(plotElement);
            }
        };
    }, [data]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h1>Data Visualization</h1>
            <div id="plot"></div>
        </div>
    );
};

export default DataVisualization;