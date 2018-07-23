import React from 'react';
import ReactDOM from 'react-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './index.css';
import axios from 'axios';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            series: [],
            xAxis: [],
            lowestDate: '',
            highestDate: '',
            maxProfit: 0,
        }
        this.maxProfitAlgorithm = this.maxProfitAlgorithm.bind(this);
    }

    maxProfitAlgorithm(results) {
        let lowestValue = results[0].value;
        let currentProfit = 0;
        let lowestDate = results[0].date;
        let highestDate = results[0].date;
        let maxProfit = 0;

        const datas = results.map(data => {
            if (lowestValue > data.value) {
                lowestValue = data.value;
                lowestDate = data.date;
            }
            currentProfit = data.value - lowestValue;
            if (currentProfit > maxProfit) {
                maxProfit = currentProfit;
                highestDate = data.date;
            }
            return [data.date, data.value];
        });

        const yDate = results.map(data => {
            return data.date;
        });

        this.setState({
            series: datas,
            xAxis: yDate,
            lowestDate: lowestDate,
            highestDate: highestDate,
            maxProfit: maxProfit,
        });
    }

    async componentDidMount() {
        const username = '1675b1124fed2d6be0832939c91784e8';
        const password = 'ae2bc1b7ed5bd67728d7fe955a9c6af7';
        const auth = "Basic " + new Buffer(username + ':' + password).toString('base64');
        const object = {
            method: 'get',
            url: 'https://api.intrinio.com/historical_data',
            params: {
                'identifier': 'QCOM',
                'item': 'close_price',
                'start_date': '2017-06-01',
                'end_date': '2018-06-01',
                'page_size': '500',
            },
            headers: {
                Authorization: auth
            }
        }
        try {
            const response = await axios(object);
            const results = response.data.data.reverse();
            this.maxProfitAlgorithm(results);

        } catch (err) {
            console.error(err)
        }
    }

    render() {
        const options = {
            title: {
                text: 'QUALCOMM'
            },
            xAxis: {
                categories: this.state.xAxis,
                //type: 'datetime',
            },
            series: [{
                data: this.state.series,
                // pointStart: Date.parse('2017-06-01'),
                // pointIntervalUnit: 'day',
                // zoneAxis: 'x',
                // zones: [{
                //     value: Date.parse(this.state.lowestDate),
                //     color: '#7cb5ec'
                //  }, {
                //     value: Date.parse(this.state.highestDate),
                //     color: '#f7a35c'
                //  },
                //  {
                //     color: '#7cb5ec'
                // }]
            }],
        }

        return (
            <div>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                />
                <p>The Buy date: {this.state.lowestDate}</p>
                <p>The Sell date: {this.state.highestDate}</p>
                <p>The max profit is: {this.state.maxProfit}</p>
            </div>
        )
    }
}
ReactDOM.render(<App />, document.getElementById("root"));
