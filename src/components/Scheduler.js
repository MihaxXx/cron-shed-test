import {useState} from "react";
import $ from 'jquery';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-select/dist/css/bootstrap-select.min.css";
import "bootstrap-select/dist/js/bootstrap-select.min";
import * as PropTypes from "prop-types";
import {PeriodSelector} from "./PeriodSelector";
import {MonthsSelector} from "./MonthsSelector";
import {DaysSelector} from "./DaysSelector";
import {DaysOfWeekSelector} from "./DaysOfWeekSelector";
import {HoursSelector} from "./HoursSelector";
import {MinutesSelector} from "./MinutesSelector";


function Scheduler(props) {
  const [formData, setFormData] = useState(
    {
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

  const handleSave = (event) => {
    event.preventDefault();
    formData.cronString = [
      formData.minutesOption === "at" ?
        (formData.minutes.length > 0 ? convertArrayToRangeOrEnumeration(formData.minutes) : "*")
        : "*/" + formData.everyNthMinute,
      formData.period > 0 ?
        formData.hoursOption === "at" ?
          (formData.hours.length > 0 ? convertArrayToRangeOrEnumeration(formData.hours) : "*")
          : "*/" + formData.everyNthHour
        : "*",
      formData.period > 2 ?
        formData.daysOption === "on" ?
          (formData.days.length > 0 ? convertArrayToRangeOrEnumeration(formData.days) : "*")
          : "*/" + formData.everyNthDay
        : "*",
      formData.period > 3 ?
        (formData.months.length > 0 ? convertArrayToRangeOrEnumeration(formData.months) : "*")
        : "*",
      formData.period > 1 ?
        (formData.daysOfWeek.length > 0 ? convertArrayToRangeOrEnumeration(formData.daysOfWeek) : "*")
        : "*",
    ].join(' ');
    document.getElementById(props.errorLabel).innerText = "";
    document.getElementById(props.cronStrIO).value = formData.cronString;
    console.log(Object.keys(formData).map(function (k) {
        return k + ":" + formData[k]
      }).join("\n")
    );
  };

  const handleLoad = (event) => {
    event.preventDefault();
    let errorLabel = document.getElementById(props.errorLabel);
    let cronStrIO = document.getElementById(props.cronStrIO);
    if (!validateCronExpr(cronStrIO.value)) {
      errorLabel.innerText = "Error: invalid cron format string";
      console.log("Error: invalid cron format string");
      return;
    }
    console.log('validated')
    let fields = cronStrIO.value.split(' ');
    let minutes = getValuesFromCronField(fields[0], errorLabel, 'minutesOption', 'everyNthMinute', 'minutes', 'at');
    let hours = getValuesFromCronField(fields[1], errorLabel, 'hoursOption', 'everyNthHour', 'hours', 'at');
    let days = getValuesFromCronField(fields[2], errorLabel, 'daysOption', 'everyNthDay', 'days', 'on');
    let months = getValuesFromCronFieldNonPeriodic(fields[3], errorLabel, 'months');
    let daysOfWeek = getValuesFromCronFieldNonPeriodic(fields[4], errorLabel, 'daysOfWeek', true);
    let period = {'period': '4'};
    if (Object.keys(minutes).length < 1 || Object.keys(hours).length < 1 || Object.keys(days).length < 1
      || Object.keys(months).length < 1 || Object.keys(daysOfWeek).length < 1 || Object.keys(period).length < 1)
      return;
    document.getElementById(props.errorLabel).innerText = "";
    let newData = {...formData, ...minutes, ...hours, ...days, ...months, ...daysOfWeek, ...period};
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

  const getValuesFromCronField = (field, errorLabel, option, every, at, preposition) => {
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

  const getValuesFromCronFieldNonPeriodic = (field, errorLabel, at, replaceSeven = false) => {
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

  const convertArrayToRangeOrEnumeration = (array) => {
    let list = [...new Set(array)].map(s => parseInt(s)).sort((a, b) => a - b)
    if (list.length > 1 && (list[list.length - 1] - list[0] + 1 === list.length))
      return list[0].toString() + '-' + list[list.length - 1].toString();
    else
      return array.join(',');
  }

  return (
    <form className="card mb-3" onSubmit={handleSave}>
      <h5 className="card-header">Cron Scheduler</h5>
      <div className="card-body pl-5 pr-5">
        <PeriodSelector period={formData.period} onChange={handleChange}/>
        <MonthsSelector period={formData.period} months={formData.months} onChange={handleMultipleChange}/>
        <DaysSelector period={formData.period} daysOption={formData.daysOption} everyNthDay={formData.everyNthDay}
                      days={formData.days} onChange={handleChange} onChange1={handleMultipleChange}/>
        <DaysOfWeekSelector period={formData.period} daysOfWeek={formData.daysOfWeek} onChange={handleMultipleChange}/>
        <HoursSelector period={formData.period} hours={formData.hours} hoursOption={formData.hoursOption}
                       everyNthHour={formData.everyNthHour} onChange={handleChange} onChange1={handleMultipleChange}/>
        <MinutesSelector minutesOption={formData.minutesOption} minutes={formData.minutes}
                         everyNthMinute={formData.everyNthMinute} onChange={handleChange}
                         onChange1={handleMultipleChange}/>
        <div className="form-group mb-0">
          <button className="btn btn-primary" type="submit">
            Save
          </button>
          <button className="btn btn-primary ml-3" type="button" onClick={handleLoad}>
            Load
          </button>
        </div>
      </div>
    </form>)
}

Scheduler.propTypes = {
  cronStrIO: PropTypes.string,
  errorLabel: PropTypes.string
};

//workaround to make bootstrap-select look in same style as bootstrap's select
$.fn.selectpicker.Constructor.DEFAULTS.styleBase = 'form-control';
$.fn.selectpicker.Constructor.DEFAULTS.style = '';
export default Scheduler;
