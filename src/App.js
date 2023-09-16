import {useState} from "react";

function App() {
  const [formData, setFormData] = useState({selectedPeriod: "year", email: "", message: ""});
  const handleChange = (event) => {
    const {name, value} = event.target;
    setFormData((prevFormData) => ({...prevFormData, [name]: value}));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Period: ${formData.selectedPeriod}, Email: ${formData.email}, Message: ${formData.message}`
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
