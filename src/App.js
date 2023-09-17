import {useState} from "react";

function App() {
  const [formData, setFormData] = useState({
    selectedPeriod: "year",
    selectedMonth: [],
    monthOption: "on",
    daysOfMonth: [],
    everyNthDay: "",
    selectedDayOfWeek: []
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

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(Object.keys(formData).map(function (k) {
        return k + ":" + formData[k]
      }).join("\n")
    );
  };

  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-sm-12">
          <form onSubmit={handleSubmit}>
            <div className="form-group row">
              <label className="col-form-label">Every</label>
              <div className="col-sm-2">
                <select className="form-control" name="selectedPeriod" value={formData.selectedPeriod}
                        onChange={handleChange}>
                  <option value="year">Year</option>
                  <option value="month">Month</option>
                  <option value="week">Week</option>
                  <option value="day">Day</option>
                  <option value="hour">Hour</option>
                  <option value="minute">Minute</option>
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
              <div className="col-sm-4" style={{display: formData.monthOption === "on" ? 'block' : 'none'}}>
                <select className="selectpicker form-control" name="daysOfMonth" value={formData.daysOfMonth}
                        multiple={true} onChange={handleMultipleChange}>
                  <option value="1">01</option>
                  <option value="2">02</option>
                  <option value="3">03</option>
                  <option value="4">04</option>
                  <option value="5">05</option>
                  <option value="6">06</option>
                  <option value="7">07</option>
                  <option value="8">08</option>
                  <option value="9">09</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                  <option value="13">13</option>
                  <option value="14">14</option>
                  <option value="15">15</option>
                  <option value="16">16</option>
                  <option value="17">17</option>
                  <option value="18">18</option>
                  <option value="19">19</option>
                  <option value="20">20</option>
                  <option value="21">21</option>
                  <option value="22">22</option>
                  <option value="23">23</option>
                  <option value="24">24</option>
                  <option value="25">25</option>
                  <option value="26">26</option>
                  <option value="27">27</option>
                  <option value="28">28</option>
                  <option value="29">29</option>
                  <option value="30">30</option>
                  <option value="31">31</option>
                </select>
              </div>
              <div style={{display: formData.monthOption === "on" ? 'none' : 'block'}}
                   className="form-outline col-sm-2 ml-2">
                {/*TODO: Set min max val*/}
                <input type="number" className="form-control" name="everyNthDay" value={formData.everyNthDay}
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
            <div className="form-group">
              <button className="btn btn-primary mt-2" type="submit">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App;
