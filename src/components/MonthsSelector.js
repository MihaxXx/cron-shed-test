import * as PropTypes from "prop-types";

export function MonthsSelector(props) {
  return <div className="form-group row" style={{display: props.period > 3 ? "flex" : "none"}}>
    <label className="col-form-label">in</label>
    <div className="col-sm-4">
      <select className="selectpicker" multiple={true} name="months"
              value={props.months} data-none-selected-text="Month(s)"
              onChange={props.onChange}>
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
  </div>;
}

MonthsSelector.propTypes = {
  period: PropTypes.string,
  months: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func
};
