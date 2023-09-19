import * as PropTypes from "prop-types";

export function HoursSelector(props) {
  let hoursOptions = [...Array(24).keys()].map(val =>
    <option value={val} key={val}>{val.toString().padStart(2, '0')}</option>);

  return <div className="form-group row"
              style={{display: (props.period > 0) ? "flex" : "none"}}>
    <div className="col-sm-2-ml-0">
      <select className="form-control" name="hoursOption" value={props.hoursOption}
              onChange={props.onChange}>
        <option value="at">at</option>
        <option value="every">every</option>
      </select>
    </div>
    <div className="col-sm-4" style={{display: props.hoursOption === "at" ? "block" : "none"}}>
      <select className="selectpicker" name="hours" value={props.hours}
              multiple={true} onChange={props.onChange1} data-none-selected-text="Hour(s)">
        {hoursOptions}
      </select>
    </div>
    <div style={{display: props.hoursOption === "at" ? "none" : "block"}}
         className="form-outline col-sm-2 ml-2">
      <input type="number" min={1} max={23} className="form-control" name="everyNthHour"
             value={props.everyNthHour} onChange={props.onChange}/>
    </div>
    <label style={{display: props.hoursOption === "at" ? "none" : "block"}}
           className="col-form-label">hours</label>
  </div>;
}

HoursSelector.propTypes = {
  period: PropTypes.string,
  hours: PropTypes.arrayOf(PropTypes.string),
  hoursOption: PropTypes.string,
  everyNthHour: PropTypes.string,
  onChange: PropTypes.func,
  onChange1: PropTypes.func,
  hoursOptions: PropTypes.arrayOf(PropTypes.any)
};
