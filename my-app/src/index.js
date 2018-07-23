import React from 'react';
import ReactDOM from 'react-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './index.css';
import axios from 'axios';
import Moment from 'moment';

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
        this.maxProfitAlgorithm= this.maxProfitAlgorithm.bind(this);
    }

    maxProfitAlgorithm(results) {
        let lowestValue = results[0].value;
        let highestValue = results[0].value;
        let lowestDate = results[0].date;
        let highestDate = results[0].date;
        let maxProfit = 0;


        // for (let i = 1; i < results.length; i++) {
        //     if (lowestValue > results[i].value) {
        //         lowestValue = results[i].value;
        //         lowestDate = results[i].date;
        //     }
        //     if (highestValue < results[i].value) {
        //         highestValue = results[i].value;
        //         highestDate = results[i].date;
        //     }
        // }

        const datas = results.map(data =>{
            if (lowestValue > data.value) {
                lowestValue = data.value;
                lowestDate = data.date;
            }
            if (highestValue < data.value) {
                highestValue = data.value;
                highestDate = data.date;
            }
            return [data.date,data.value];
        });

        const yDate = results.map(data =>{
            return Moment(Date.parse(data.date)).format("YYYY-MM-D");
        });

        if (highestValue - lowestValue > maxProfit) {
            maxProfit = highestValue - lowestValue;
        }

        // let lowestDateFormat = Date.parse(lowestDate);
        // let highestDateFormat = Date.parse(highestDate);


        // for(let i = 0; i < datas.length; i++){

        //     const currentDateFormat = Date.parse(datas[i][0]);
        //     if(currentDateFormat < lowestDateFormat){
        //         series1.push(datas[i]);
        //     }else if(currentDateFormat >= lowestDateFormat && currentDateFormat <= highestDateFormat){
        //         series2.push(datas[i]);
        //     }else{
        //         series3.push(datas[i]);
        //     }
        // }
        //console.log(series1);

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

        console.log(this.state.lowestDate);
        console.log(Date.parse(this.state.highestDate));
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
                pointStart: Date.parse('2017-06-01'),
                pointIntervalUnit: 'day',
                zoneAxis: 'x',
                zones: [{
                    value: Date.parse(this.state.lowestDate),
                    color: '#7cb5ec'
                 }, {
                    value: Date.parse(this.state.highestDate),
                    color: '#f7a35c'
                 },
                 {
                    color: '#7cb5ec'
                }]
            }],

        }

        return (
            <div>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                />
                <p>The max profit is: {this.state.maxProfit}</p>
            </div>
        )
    }
}
ReactDOM.render(<App />, document.getElementById("root"));
