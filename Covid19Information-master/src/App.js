import React, { useEffect, useState } from "react";
import Spinner from "./img/spinner.gif";
import axios from "axios";
import DataChart from './DataChart';

function App() {
  const [info, setInfo] = useState([]);
  const [selectedCountryInfo,setSelectedCountryInfo] = useState([]);
  const [selectedCountryInfoIndividual,setSelectedCountryInfoIndividual] = useState([]);
  const [countryInfoMonthly,setCountryInfoMonthly] = useState([]);
  const [statusType,setStatusType] = useState("");
  const [showChart,setShowChart] = useState(false);
  const [countryNameState,setCountryNameState] = useState("");
  useEffect(() => {
    axios.get("https://api.covid19api.com/summary")
      .then((response) => {
        setInfo(response.data);
        console.log(response.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const globalData = info.Global;
  const todayDate = new Date().toUTCString();

  const submitHandler = e =>{
    e.preventDefault();
    if(showChart === true) setShowChart(false);
    setCountryInfoMonthly([]);
    const countryName = e.target.countryName.value;
    setCountryNameState(countryName);
    const countryNameInfo = info.Countries.filter(eachCountry => eachCountry.Country === countryName);
    setSelectedCountryInfo([...countryNameInfo]);
    axios.get(`https://api.covid19api.com/total/dayone/country/${countryName}`)
        .then(response => {
          setSelectedCountryInfoIndividual(response.data.map(each =>{
            const month = ((new Date(each.Date)).getMonth()) + 1;
            const day = (new Date(each.Date).getDate());
            return{...each,day,month}
          }));
        })
        .catch(err => console.log(err));
  }

  
    const monthlyDataSetter = () =>{
      return new Promise((resolve,reject)=>{
        const monthlyData = {1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[],10:[],11:[]};
        selectedCountryInfoIndividual.map(eachInfo => monthlyData[eachInfo.month].push({
        day:eachInfo.day,
        Active:eachInfo.Active,
        Confirmed:eachInfo.Confirmed,
        Deaths:eachInfo.Deaths,
        Recovered:eachInfo.Recovered
        }));
        resolve(monthlyData);
        reject('Error with promise');
      })
    };
    const creatingMonthlyData = () =>{
      monthlyDataSetter()
        .then(data =>{
          console.log(data);
          setCountryInfoMonthly(data);
        })
        .catch(err => console.log(err))
    };
    // console.log(selectedCountryInfoIndividual);
    
    // console.log('monthly data');
    // console.log(monthlyData);
    // use monthly data as a constant
    const statusSelectionHandler = (e) =>{
        e.preventDefault();
        setStatusType(e.target.status.value)
        if(showChart !== true){
          setShowChart(!showChart);
        }
        
    }

  return (
    <div className="App">
      
      <h1 style={{textAlign:'center'}}>Shadman Martin Piyal Covid19 Information</h1>
      {info.length === 0 ? (
        <img src={Spinner} alt="Loading Spinner" />
      ) : (
        <div className="AppContent">

          <div className="globalInformation">
              <h1 style={{textDecoration:'underline'}}>World Information</h1>
              <h3>
                Information Date:<span style={{ color: "blue" }}>{todayDate}</span>
              </h3>
              <h3>
                Newly Confirmed:<span style={{ color: "red" }}>{globalData.NewConfirmed}</span>
              </h3>
              <h3>
                Newly Deaths:<span style={{ color: "red" }}>{globalData.NewDeaths}</span>
              </h3>
              <h3>
                Newly Recovered:<span style={{ color: "green" }}>{globalData.NewRecovered}</span>
              </h3>
              <h3>
                Total Confirmed:<span style={{ color: "red" }}>{globalData.TotalConfirmed}</span>
              </h3>
              <h3>
                Total Deaths:<span style={{ color: "red" }}>{globalData.TotalDeaths}</span>
              </h3>
              <h3>
                Total Recovered:<span style={{ color: "green" }}>{globalData.TotalRecovered}</span>
              </h3>
          </div>
          <div className="countrySelection">
          <h1 style={{textDecoration:'underline'}}>Countrywise Information</h1>
          <div className="countrySelectionForm">
              <form onSubmit={e => submitHandler(e)}>
                <label htmlFor="countryName">Select a Country Name for further information:</label>
                <br/>
                <select className="countrySelector" id="countryName" name="countryName">
                  <option>Select a country</option>
                  {info.Countries.map(eachCountry =>{
                    return(
                      <option key={Math.random()} value={eachCountry.Country}>
                        {eachCountry.Country}
                      </option>
                    )
                  })}
                </select>
                <button className="countrySelectorButton" type="submit">Select</button>
              </form>
          </div>
          
          <div className="countryInformationContainer">
            {selectedCountryInfo.length === 0 ? (<p>No Country is Selected yet</p>) : (<div className="countryInformation">
              {/* <h4>{monthlyData[1].length === 0 ? (<p>No montly data</p>) : (<p>Yes monthly data</p>)}</h4> */}
              <h4>Country:<span style={{color:'blue'}}>{selectedCountryInfo[0].Country}</span></h4>
              <h4>New Confirmed Today:<span style={{color:'green'}}>{selectedCountryInfo[0].NewConfirmed}</span></h4>
              <h4>New Deaths Today:<span style={{color:'red'}}>{selectedCountryInfo[0].NewDeaths}</span></h4>
              <h4>New Recovered Today:<span style={{color:'green'}}>{selectedCountryInfo[0].NewRecovered}</span></h4>
              <h4>Total Confirmed:<span style={{color:'red'}}>{selectedCountryInfo[0].TotalConfirmed}</span></h4>
              <h4>Total Deaths:<span style={{color:'red'}}>{selectedCountryInfo[0].TotalDeaths}</span></h4>
              <h4>Total Recovered:<span style={{color:'green'}}>{selectedCountryInfo[0].TotalRecovered}</span></h4>
              <button className="monthlyDataGeneratorButton" onClick={e => creatingMonthlyData()}>See Monthly data</button>
            </div>)}
          </div>
          {countryInfoMonthly.length === 0 ? (<p></p>) : (<div>
            <p></p>
            <form className="statusSelectionForm" onSubmit={e => statusSelectionHandler(e)}>
              <select className="statusSelector" id="status" name="status">
                <option value="">Select a type</option>
                <option value="Active">Active Cases</option>
                <option value="Confirmed">Confirmed Cases</option>
                <option value="Deaths">Deaths Count</option>
                <option value="Recovered">Recovered Cases</option>
              </select>
              <button className="statusSelectorButton" type="subimt">Select</button>
            </form>
            {showChart && (
              <DataChart statusType={statusType} countryInfoMonthly={countryInfoMonthly} 
                countryName={countryNameState}
              />
            )}
            
          </div>)}
        </div>
        </div>
        
          
      )}
    </div>
  );
}

export default App;
