import {useState} from "react";
import $ from 'jquery';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-select/dist/css/bootstrap-select.min.css";
import "bootstrap-select/dist/js/bootstrap-select.min";

function App() {
  const [formData, setFormData] = useState({
    period: "4",
    months: [],
    daysOption: "on",
    days: [],
    everyNthDay: "1",
    daysOfWeek: [],
    hoursOption: "at",
    hours: [],
    everyNthHour: "1",
    minutesOption: "at",
    minutes: [],
    everyNthMinute: "1",
    cronString: ""
  });
  let periodOptions = ["Hour", "Day", "Week", "Month", "Year"].reverse()
    .map((val, i, arr) => <option value={arr.length - 1 - i} key={arr.length - 1 - i}>{val}</option>)
  let daysOptions = [...Array(31 + 1).keys()].slice(1).map(val => <option value={val} key={val}>{val}</option>);
  let hoursOptions = [...Array(24).keys()].map(val => <option value={val}
                                                             key={val}>{val.toString().padStart(2, '0')}</option>);
  let minutesOptions = [...Array(60).keys()].map(val => <option value={val} key={val}>{val}</option>);
  const handleChange = (event) => {
    const {name, value} = event.target;
    setFormData((prevFormData) => ({...prevFormData, [name]: value}));
    console.log(name + ': ' + value)
  };

  const handleMultipleChange = (event) => {
    const name = event.target.name;
    const value = Array.from(event.target.selectedOptions, option => option.value)
    setFormData((prevFormData) => ({...prevFormData, [name]: value}));
    console.log(name + ': ' + value)
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    formData.cronString = [
      formData.minutesOption === "at" ?
        (formData.minutes.length > 0 ? formData.minutes.join(',') : "*")
        : "*/" + formData.everyNthMinute,
      formData.period > 0 ?
        formData.hoursOption === "at" ?
          (formData.hours.length > 0 ? formData.hours.join(',') : "*")
          : "*/" + formData.everyNthHour
        : "*",
      formData.period > 2 ?
        formData.daysOption === "on" ?
          (formData.days.length > 0 ? formData.days.join(',') : "*")
          : "*/" + formData.everyNthDay
        : "*",
      formData.period > 3 ?
        (formData.months.length > 0 ? formData.months.join(',') : "*")
        : "*",
      formData.period > 1 ?
        (formData.daysOfWeek.length > 0 ? formData.daysOfWeek.sort().join(',') : "*")
        : "*",
    ].join(' ');
    document.getElementById("errorLabel").innerText = "";
    document.getElementById("cronStrIO").value = formData.cronString;
    console.log(Object.keys(formData).map(function (k) {
        return k + ":" + formData[k]
      }).join("\n")
    );
  };

  const handleButtonClick = (event) => {
    event.preventDefault();
    let errorLabel = document.getElementById("errorLabel");
    let cronStrIO = document.getElementById("cronStrIO");
    if (!validateCronExpr(cronStrIO.value)) {
      errorLabel.innerText = "Error: invalid cron format string";
      console.log("Error: invalid cron format string");
      return;
    }
    console.log('validated')
    let fields = cronStrIO.value.split(' ');
    let update1 = fillRowFromField(fields[0], errorLabel, 'minutesOption', 'everyNthMinute', 'minutes', 'at');
    let update2 = fillRowFromField(fields[1], errorLabel, 'hoursOption', 'everyNthHour', 'hours', 'at');
    let update3 = fillRowFromField(fields[2], errorLabel, 'daysOption', 'everyNthDay', 'days', 'on');
    let update4 = fillRowFromFieldNonPeriodic(fields[3], errorLabel, 'months');
    let update5 = fillRowFromFieldNonPeriodic(fields[4], errorLabel, 'daysOfWeek', true);
    let update6 = {'period': '4'};
    if (Object.keys(update1).length < 1 || Object.keys(update2).length < 1 || Object.keys(update3).length < 1
      || Object.keys(update4).length < 1 || Object.keys(update5).length < 1 || Object.keys(update6).length < 1)
      return;
    document.getElementById("errorLabel").innerText = "";
    let newData = {...formData, ...update1, ...update2, ...update3, ...update4, ...update5, ...update6};
    console.log(newData)
    setFormData(newData);
    //Workaround to force update bootstrap-select multiple pickers because they're dummy
    $(document).ready(function () {
      $('.selectpicker').selectpicker('render')
    });
  }
  //https://regexr.com/3bvl1, needs change to allow list of ranges
  const cronRegEx = /^((?:\*|[0-5]?[0-9](?:(?:-[0-5]?[0-9])|(?:,[0-5]?[0-9])+)?)(?:\/[0-9]+)?)\s+((?:\*|(?:1?[0-9]|2[0-3])(?:(?:-(?:1?[0-9]|2[0-3]))|(?:,(?:1?[0-9]|2[0-3]))+)?)(?:\/[0-9]+)?)\s+((?:\*|(?:[1-9]|[1-2][0-9]|3[0-1])(?:(?:-(?:[1-9]|[1-2][0-9]|3[0-1]))|(?:,(?:[1-9]|[1-2][0-9]|3[0-1]))+)?)(?:\/[0-9]+)?)\s+((?:\*|(?:[1-9]|1[0-2])(?:(?:-(?:[1-9]|1[0-2]))|(?:,(?:[1-9]|1[0-2]))+)?)(?:\/[0-9]+)?)\s+((?:\*|[0-7](?:-[0-7]|(?:,[0-7])+)?)(?:\/[0-9]+)?)$/;
  const validateCronExpr = (str) => str.trim().match(cronRegEx)?.[0] === str.trim()
  const range = (start, stop, step) =>
    Array.from({length: (stop - start) / step + 1}, (_, i) => start + i * step);

  function convertRangeToList(fieldVal) {
    let start = fieldVal.substring(0, fieldVal.indexOf('-'));
    let end = fieldVal.substring(fieldVal.indexOf('-') + 1)
    return range(parseInt(start), parseInt(end), 1).map(val => val.toString());
  }

  const convertFieldNumbersToList = (fieldVal, replaceSeven = false) => {
    let list = fieldVal.split(',').map(val => val.includes('-') ? convertRangeToList(val) : [val]).flat(1).sort();
    console.log("fieldVal:", fieldVal, ", list:", list);
    if (replaceSeven) {
      let index = list.indexOf('7');
      if (index !== -1) {
        list[index] = '0';
      }
    }
    return [...new Set(list)];//filter unique values
  }

  function fillRowFromField(field, errorLabel, option, every, at, preposition) {
    let newValues = {};
    if (field.includes('/')) {
      if (!field.startsWith('*/')) {
        errorLabel.innerText = "Error: cron string format is richer than supported";
      } else {
        newValues = {...newValues, [option]: "every"};
        newValues = {...newValues, [every]: field.substring(2)};
      }
    } else {
      if (field === "*") {
        newValues = {...newValues, [option]: preposition};
        newValues = {...newValues, [at]: []};
      } else {
        newValues = {...newValues, [option]: preposition};
        newValues = {...newValues, [at]: convertFieldNumbersToList(field)};
      }
    }
    console.log(newValues);
    return newValues;
  }

  const fillRowFromFieldNonPeriodic = (field, errorLabel, at, replaceSeven = false) => {
    let newValues = {};
    if (field.includes('/')) {
      errorLabel.innerText = "Error: cron string format is richer than supported";
    } else {
      if (field === "*")
        newValues = {...newValues, [at]: []};
      else
        newValues = {...newValues, [at]: convertFieldNumbersToList(field, replaceSeven)};
    }
    return newValues;
  };
  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-sm-12">
          <form className="card mb-3" onSubmit={handleSubmit}>
            <h5 className="card-header">Cron Scheduler</h5>
            <div className="card-body pl-5 pr-5">
              <div className="form-group row">
                <label className="col-form-label">Every</label>
                <div className="col-sm-3">
                  <select className="form-control" name="period" value={formData.period}
                          onChange={handleChange}>
                    {periodOptions}
                  </select>
                </div>
              </div>

              <div className="form-group row" style={{display: formData.period > 3 ? 'flex' : 'none'}}>
                <label className="col-form-label">in</label>
                <div className="col-sm-4">
                  <select className="selectpicker" multiple={true} name="months"
                          value={formData.months} data-none-selected-text="Month(s)"
                          onChange={handleMultipleChange}>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                </div>
              </div>
              <div className="form-group row"
                   style={{display: (formData.period > 2) ? 'flex' : 'none'}}>
                <div className="col-sm-2-ml-0">
                  <select className="form-control" name="daysOption" value={formData.daysOption}
                          onChange={handleChange}>
                    <option value="on">on</option>
                    <option value="every">every</option>
                  </select>
                </div>
                <div className="col-sm-4 ml-1" style={{display: formData.daysOption === "on" ? 'block' : 'none'}}>
                  <select className="selectpicker" name="days" value={formData.days}
                          multiple={true} onChange={handleMultipleChange} data-none-selected-text="Day(s)">
                    {daysOptions}
                  </select>
                </div>
                <div style={{display: formData.daysOption === "on" ? 'none' : 'block'}}
                     className="form-outline col-sm-2 ml-2">
                  <input type="number" min={1} max={31} className="form-control" name="everyNthDay"
                         value={formData.everyNthDay}
                         onChange={handleChange}/>
                </div>
                <label style={{display: formData.daysOption === "on" ? 'none' : 'block'}}
                       className="col-form-label">days</label>
              </div>
              <div className="form-group row"
                   style={{display: (formData.period > 1) ? 'flex' : 'none'}}>
                <label className="col-form-label">on</label>
                <div className="col-sm-4">
                  <select className="selectpicker" multiple={true} name="daysOfWeek"
                          value={formData.daysOfWeek} data-none-selected-text="Day(s) of week"
                          onChange={handleMultipleChange}>
                    <option value="1">Monday</option>
                    <option value="2">Tuesday</option>
                    <option value="3">Wednesday</option>
                    <option value="4">Thursday</option>
                    <option value="5">Friday</option>
                    <option value="6">Saturday</option>
                    <option value="0">Sunday</option>
                  </select>
                </div>
              </div>
              <div className="form-group row"
                   style={{display: (formData.period > 0) ? 'flex' : 'none'}}>
                <div className="col-sm-2-ml-0">
                  <select className="form-control" name="hoursOption" value={formData.hoursOption}
                          onChange={handleChange}>
                    <option value="at">at</option>
                    <option value="every">every</option>
                  </select>
                </div>
                <div className="col-sm-4" style={{display: formData.hoursOption === "at" ? 'block' : 'none'}}>
                  <select className="selectpicker" name="hours" value={formData.hours}
                          multiple={true} onChange={handleMultipleChange} data-none-selected-text="Hour(s)">
                    {hoursOptions}
                  </select>
                </div>
                <div style={{display: formData.hoursOption === "at" ? 'none' : 'block'}}
                     className="form-outline col-sm-2 ml-2">
                  <input type="number" min={1} max={23} className="form-control" name="everyNthHour"
                         value={formData.everyNthHour} onChange={handleChange}/>
                </div>
                <label style={{display: formData.hoursOption === "at" ? 'none' : 'block'}}
                       className="col-form-label">hours</label>
              </div>
              <div className="form-group row"
                   style={{display: 'flex'}}>
                <div className="col-sm-2-ml-0">
                  <select className="form-control" name="minutesOption" value={formData.minutesOption}
                          onChange={handleChange}>
                    <option value="at">at</option>
                    <option value="every">every</option>
                  </select>
                </div>
                <div className="col-sm-4" style={{display: formData.minutesOption === "at" ? 'block' : 'none'}}>
                  <select className="selectpicker" name="minutes"
                          value={formData.minutes} data-none-selected-text="Minute(s)"
                          multiple={true} onChange={handleMultipleChange}>
                    {minutesOptions}
                  </select>
                </div>
                <div style={{display: formData.minutesOption === "at" ? 'none' : 'block'}}
                     className="form-outline col-sm-2 ml-2">
                  <input type="number" min={1} max={59} className="form-control" name="everyNthMinute"
                         value={formData.everyNthMinute} onChange={handleChange}/>
                </div>
                <label style={{display: formData.minutesOption === "at" ? 'none' : 'block'}}
                       className="col-form-label">minutes</label>
              </div>
              <div className="form-group mb-0">
                <button className="btn btn-primary" type="submit">
                  Save
                </button>
                <button className="btn btn-primary ml-3" type="button" onClick={handleButtonClick}>
                  Load
                </button>
              </div>
            </div>
          </form>
          <div className="row pl-4 pr-4 mx-auto">
            <label className="col-form-label">Cron string: </label>
            <div className="form-outline col pr-0">
              <input id="cronStrIO" type={"text"} className="form-control" name="cronString" placeholder="* * * * *"/>
            </div>
          </div>
          <div className="row mx-auto">
            <label className="col-form-label" id="errorLabel" style={{color: 'red'}}></label>
          </div>
        </div>
      </div>
    </div>
  )
}

//workaround to make bootstrap-select look in same style as bootstrap's select
$.fn.selectpicker.Constructor.DEFAULTS.styleBase = 'form-control';
$.fn.selectpicker.Constructor.DEFAULTS.style = '';
export default App;
