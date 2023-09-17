import {useState} from "react";

function App() {
  const [formData, setFormData] = useState({
    selectedPeriod: "year",
    selectedMonth: [],
    monthOption: "on",
    daysOfMonth: [],
    everyNthDay: "",
    selectedDayOfWeek: [],
    hourOption: "at",
    selectedAtHours: [],
    selectedEveryHours: "",
    minuteOption: "at",
    selectedAtMinutes: [],
    selectedEveryMinutes: "",
    cronString: ""
  });
  // TODO: Refactor to use periodOptions everywhere needed
  let periodOptions = ["hour", "day", "week", "month", "year"];
  let daysOptions = [...Array(31 + 1).keys()].slice(1).map(val => <option value={val} key={val}>{val}</option>);
  let hourOptions = [...Array(24).keys()].map(val => <option value={val}
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
      formData.minuteOption === "at" ? formData.selectedAtMinutes.join(',') : "*/" + formData.selectedEveryMinutes,
      periodOptions.indexOf(formData.selectedPeriod) > 0 ? formData.hourOption === "at" ? formData.selectedAtHours.join(',') : "*/" + formData.selectedEveryHours : "*",
      periodOptions.indexOf(formData.selectedPeriod) > 2 ? formData.monthOption === "on" ? formData.daysOfMonth.join(',') : "*/" + formData.everyNthDay : "*",
      periodOptions.indexOf(formData.selectedPeriod) > 3 ? formData.selectedMonth.join(',') : "*",
      periodOptions.indexOf(formData.selectedPeriod) > 1 ? formData.selectedDayOfWeek.sort().join(',') : "*",
    ].join(' ');
    document.getElementById("errorLabel").value = "";
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
    if (!validateCronExpr(cronStrIO.value))
    {
      errorLabel.value = "Error: invalid cron format string";
      return;
    }
    console.log('validated')
    let fields = cronStrIO.value.split(' ');
    fillRowFromField(fields[0], errorLabel, 'minuteOption', 'selectedEveryMinutes', 'selectedAtMinutes', 'at');
    fillRowFromField(fields[1], errorLabel, 'hourOption', 'selectedEveryHours', 'selectedAtHours', 'at');
    fillRowFromField(fields[2], errorLabel, 'hourOption', 'everyNthDay', 'daysOfMonth', 'on');
    fillRowFromFieldNonPeriodic(fields[3], errorLabel, 'selectedMonth');
    fillRowFromFieldNonPeriodic(fields[4], errorLabel, 'selectedDayOfWeek');
    setFormData({ ...formData,'selectedPeriod': 'year' });
  }

  const validateCronExpr = (str) => str.trim().match(/((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5})/)?.[0] === str.trim()
  const range = (start, stop, step) =>
    Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
  const convertRangeToList = (fieldVal) => {
    if(!fieldVal.includes('-'))
      return [fieldVal];
    else {
      let start = fieldVal.substring(0, fieldVal.indexOf('-'));
      let end = fieldVal.substring(fieldVal.indexOf('-')+1)
      return range(start, end, 1).map(val => val.toString());
    }
  }

  function fillRowFromField(field, errorLabel, option, every, at, preposition) {
    if (field.includes('/')) {
      if (!field.startsWith('*/')) {
        errorLabel.value = "Error: cron format string is richer than supported";
        return;
      } else {
        setFormData({ ...formData,[option]: "every" });
        setFormData({ ...formData,[every]: field.substring(2) });
      }
    } else {
      setFormData({ ...formData,[option]: preposition });
      let t = { ...formData,[at]: convertRangeToList(field) };
      setFormData(t);
    }
  }

  const fillRowFromFieldNonPeriodic = (field, errorLabel, at) => {
    if (field.includes('/')) {
        errorLabel.value = "Error: cron format string is richer than supported";
        return;
    } else {
      let t = { ...formData,[at]: convertRangeToList(field) };
      setFormData(t);
    }
  };
  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-sm-12">
          <form onSubmit={handleSubmit}>
            <div className="form-group row">
              <label className="col-form-label">Every</label>
              <div className="col-sm-3">
                <select className="form-control" name="selectedPeriod" value={formData.selectedPeriod}
                        onChange={handleChange}>
                  <option value="year">Year</option>
                  <option value="month">Month</option>
                  <option value="week">Week</option>
                  <option value="day">Day</option>
                  <option value="hour">Hour</option>
                </select>
              </div>
            </div>

            <div className="form-group row" style={{display: formData.selectedPeriod === "year" ? 'flex' : 'none'}}>
              <label className="col-form-label">in</label>
              <div className="col-sm-4">
                <select className="selectpicker form-control" multiple={true} name="selectedMonth"
                        value={formData.selectedMonth}
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
                 style={{display: (formData.selectedPeriod === "year" || formData.selectedPeriod === "month") ? 'flex' : 'none'}}>
              <div className="col-sm-2-ml-0">
                <select className="form-control" name="monthOption" value={formData.monthOption}
                        onChange={handleChange}>
                  <option value="on">on</option>
                  <option value="every">every</option>
                </select>
              </div>
              <div className="col-sm-4 ml-1" style={{display: formData.monthOption === "on" ? 'block' : 'none'}}>
                <select className="selectpicker form-control" name="daysOfMonth" value={formData.daysOfMonth}
                        multiple={true} onChange={handleMultipleChange}>
                  {daysOptions}
                </select>
              </div>
              <div style={{display: formData.monthOption === "on" ? 'none' : 'block'}}
                   className="form-outline col-sm-2 ml-2">
                <input type="number" min={1} max={31} className="form-control" name="everyNthDay"
                       value={formData.everyNthDay}
                       onChange={handleChange}/>
              </div>
              <label style={{display: formData.monthOption === "on" ? 'none' : 'block'}}
                     className="col-form-label">days</label>
            </div>
            <div className="form-group row"
                 style={{display: (formData.selectedPeriod === "year" || formData.selectedPeriod === "month" || formData.selectedPeriod === "week") ? 'flex' : 'none'}}>
              <label className="col-form-label">on</label>
              <div className="col-sm-4">
                <select className="selectpicker form-control" multiple={true} name="selectedDayOfWeek"
                        value={formData.selectedDayOfWeek}
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
                 style={{display: (formData.selectedPeriod !== "hour") ? 'flex' : 'none'}}>
              <div className="col-sm-2-ml-0">
                <select className="form-control" name="hourOption" value={formData.hourOption}
                        onChange={handleChange}>
                  <option value="at">at</option>
                  <option value="every">every</option>
                </select>
              </div>
              <div className="col-sm-4" style={{display: formData.hourOption === "at" ? 'block' : 'none'}}>
                <select className="selectpicker form-control" name="selectedAtHours" value={formData.selectedAtHours}
                        multiple={true} onChange={handleMultipleChange}>
                  {hourOptions}
                </select>
              </div>
              <div style={{display: formData.hourOption === "at" ? 'none' : 'block'}}
                   className="form-outline col-sm-2 ml-2">
                <input type="number" min={1} max={23} className="form-control" name="selectedEveryHours"
                       value={formData.selectedEveryHours} onChange={handleChange}/>
              </div>
              <label style={{display: formData.hourOption === "at" ? 'none' : 'block'}}
                     className="col-form-label">hours</label>
            </div>
            <div className="form-group row"
                 style={{display: 'flex'}}>
              <div className="col-sm-2-ml-0">
                <select className="form-control" name="minuteOption" value={formData.minuteOption}
                        onChange={handleChange}>
                  <option value="at">at</option>
                  <option value="every">every</option>
                </select>
              </div>
              <div className="col-sm-4" style={{display: formData.minuteOption === "at" ? 'block' : 'none'}}>
                <select className="selectpicker form-control" name="selectedAtMinutes"
                        value={formData.selectedAtMinutes}
                        multiple={true} onChange={handleMultipleChange}>
                  {minutesOptions}
                </select>
              </div>
              <div style={{display: formData.minuteOption === "at" ? 'none' : 'block'}}
                   className="form-outline col-sm-2 ml-2">
                <input type="number" min={1} max={59} className="form-control" name="selectedEveryMinutes"
                       value={formData.selectedEveryMinutes} onChange={handleChange}/>
              </div>
              <label style={{display: formData.minuteOption === "at" ? 'none' : 'block'}}
                     className="col-form-label">minutes</label>
            </div>
            <div className="form-group">
              <button className="btn btn-primary mt-2" type="submit">
                Save
              </button>
              <button className="btn btn-primary mt-2 ml-3" type="button" onClick={handleButtonClick}>
                Load
              </button>
            </div>
          </form>
          <div className="form-row">
            <label className="col-form-label">Cron string: </label>
            <div className="form-outline col-sm-10">
              <input id="cronStrIO" type={"text"} className="form-control" name="cronString"/>
            </div>
          </div>
          <div className="form-row">
            <label className="col-form-label" id="errorLabel"></label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;
