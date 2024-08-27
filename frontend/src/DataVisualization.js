import React, { useEffect, useState } from 'react';
import Plotly from 'plotly.js';

const DataVisualization = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/data')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setData(data);
                // Implement visualisasi dengan Plotly atau D3.js
                Plotly.newPlot('plot', [{
                    x: [1, 2, 3],
                    y: [2, 6, 3],
                    type: 'scatter'
                }]);
            });
    }, []);

    return (
        <div>
            <h1>Data Visualization</h1>
            <div id="plot"></div>
        </div>
    );
};

export default DataVisualization;