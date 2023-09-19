import * as PropTypes from "prop-types";

export function DaysOfWeekSelector(props) {
  return <div className="form-group row"
              style={{display: (props.period > 1) ? "flex" : "none"}}>
    <label className="col-form-label">on</label>
    <div className="col-sm-4">
      <select className="selectpicker" multiple={true} name="daysOfWeek"
              value={props.daysOfWeek} data-none-selected-text="Day(s) of week"
              onChange={props.onChange}>
        <option value="1">Monday</option>
        <option value="2">Tuesday</option>
        <option value="3">Wednesday</option>
        <option value="4">Thursday</option>
        <option value="5">Friday</option>
        <option value="6">Saturday</option>
        <option value="0">Sunday</option>
      </select>
    </div>
  </div>;
}

DaysOfWeekSelector.propTypes = {
  period: PropTypes.string,
  daysOfWeek: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func
};
