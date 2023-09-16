import {useState} from "react";

function App() {
  const [formData, setFormData] = useState({selectedPeriod: "year", selectedMonth: [""], MonthOption: ""});
  const handleChange = (event) => {
    const {name, value} = event.target;
    setFormData((prevFormData) => ({...prevFormData, [name]: value}));
    console.log(value)
  };

  const handleMultipleChange = (event) => {
    const name = event.target.name;
    const value = Array.from(event.target.selectedOptions, option => option.value)
    setFormData((prevFormData) => ({...prevFormData, [name]: value}));
    console.log(value)
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Period: ${formData.selectedPeriod}, Month: ${formData.selectedMonth}, Message: ${formData.message}`
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
            {formData.selectedPeriod === "year" &&
              <div className="form-group row">
              <label className="col-form-label">in</label>
              <div className="col-sm-4">
                <select className="selectpicker form-control" multiple={true} name="selectedMonth" value={formData.selectedMonth}
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
            </div>}
            {(formData.selectedPeriod === "year" || formData.selectedPeriod === "month") &&
              <div className="form-group row">
                <div className="col-sm-2">
                  <select className="form-control" name="MonthOption" value={formData.MonthOption}
                          onChange={handleChange}>
                    <option value="on">on</option>
                    <option value="every">every</option>
                  </select>
                </div>
              </div>}

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
