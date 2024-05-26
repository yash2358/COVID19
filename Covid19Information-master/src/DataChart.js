import React,{useState,useEffect} from 'react'
import {Line,Bar} from 'react-chartjs-2';

const DataChart = ({statusType,countryInfoMonthly,countryName}) => {
    // const [monthlyInfoFiltered,setMonthlyInfoFiltered] = useState([]);
    // const [statusTypeState,setStatusTypeState] = useState(statusType);
    const monthsName = {
        1:'January',
        2:'February',
        3:'March',
        4:'April',
        5:'May',
        6:'June',
        7:'July',
        8:'August',
        9:'September',
        10:'October',
        11:'November',
        12:'December'
    }

    // useEffect(()=>{
        let monthlyInfoFiltered = {}; // it will filter the monthly data according to the statusType
        for(let key in countryInfoMonthly){
            monthlyInfoFiltered[key] = [];
            countryInfoMonthly[key].map(each =>{
                for(let keyInside in each){
                    if(keyInside === statusType){
                        let eachRow = {};
                        eachRow['day'] = each.day;
                        eachRow[statusType] = each[statusType];
                        monthlyInfoFiltered[key].push(eachRow);
                        break;
                    }
                }
                return 1;
            })
        }
        // setMonthlyInfoFiltered(countryInfoMonthlyFiltered);
    // },[]);
    

    let chartList = [];
    for(let key in monthlyInfoFiltered){
        let labels = [];
        let data = [];
        if(monthlyInfoFiltered[key].length === 0) continue;
        monthlyInfoFiltered[key].map(eachDay =>{
            labels.push(eachDay.day);
            data.push(eachDay[statusType]);
            return 1;
        })
        let LineData = {
            labels,
            datasets:[
                {
                    label:`${monthsName[key]} ${statusType} Cases of ${countryName}`,
                    
                    borderColor:'black',
                    borderWidth:'2',
                    data
                }
            ]
        }
        chartList.push(
            <div className="eachLineChart" key={Math.random()}>
                <Line
                    data={LineData}
                    options={{maintainAspectRatio:false,
                    responsive:true,
                    scales:{
                        yAxes:[{ticks:{beginAtZero:false},scaleLabel: {display:true,labelString:`${statusType} Cases`}}],
                        xAxes:[{ticks:{beginAtZero:false},scaleLabel: {display:true,labelString:`${monthsName[key]} Dates`}}],
                        
                    }}}
                />
            </div>
        )
    }
    
    return (
        <div>
            <div className="chartListComponents">
                {chartList}
            </div>
        </div>
    )
}

export default DataChart;
