import * as PropTypes from "prop-types";

export function DaysSelector(props) {
  let daysOptions = [...Array(31 + 1).keys()].slice(1).map(val => <option value={val} key={val}>{val}</option>);
  return <div className="form-group row"
              style={{display: (props.period > 2) ? "flex" : "none"}}>
    <div className="col-sm-2-ml-0">
      <select className="form-control" name="daysOption" value={props.daysOption}
              onChange={props.onChange}>
        <option value="on">on</option>
        <option value="every">every</option>
      </select>
    </div>
    <div className="col-sm-4 ml-1" style={{display: props.daysOption === "on" ? "block" : "none"}}>
      <select className="selectpicker" name="days" value={props.days}
              multiple={true} onChange={props.onChange1} data-none-selected-text="Day(s)">
        {daysOptions}
      </select>
    </div>
    <div style={{display: props.daysOption === "on" ? "none" : "block"}}
         className="form-outline col-sm-2 ml-2">
      <input type="number" min={1} max={31} className="form-control" name="everyNthDay"
             value={props.everyNthDay}
             onChange={props.onChange}/>
    </div>
    <label style={{display: props.daysOption === "on" ? "none" : "block"}}
           className="col-form-label">days</label>
  </div>;
}

DaysSelector.propTypes = {
  period: PropTypes.string,
  daysOption: PropTypes.string,
  everyNthDay: PropTypes.string,
  days: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  onChange1: PropTypes.func,
  daysOptions: PropTypes.arrayOf(PropTypes.any)
};
