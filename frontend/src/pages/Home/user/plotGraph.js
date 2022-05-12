import React, { useEffect, useState, useRef, useContext } from "react";
import { Container, Button } from "react-bootstrap";
import Plot from 'react-plotly.js';

const testData = {
    x: ['2015-02-17', '2015-02-18', '2015-02-19'],
    y: [26, 28, 23],
    type: 'lines',
    marker: {color: 'red'},
}

const testLayout = {
    width: 500, height: 500, title: 'A Fancy Plot',
    xaxis: { title: {text: "time"} },
    yaxis: { title: {text: "temperature"} },
}

const TimeSeries = (props) => {

    const [data, setData] = useState([]);
    
    const onClickPushData = () => {
        // update data array
        setData( arr => [...arr, testData] );
    }

    const onClickResetData = () => {
        setData([]);
    }

    return (
        <>
            <Plot data={data} layout={testLayout}/>
            <Container>
                <Button variant="outline-success" onClick={onClickPushData}> Plot data </Button>
                <Button variant="outline-danger" onClick={onClickResetData}> Reset </Button>
            </Container>
        </>
    )
}

export default TimeSeries;