import * as PropTypes from "prop-types";

export function MinutesSelector(props) {
  let minutesOptions = [...Array(60).keys()].map(val => <option value={val} key={val}>{val}</option>);

  return <div className="form-group row"
              style={{display: "flex"}}>
    <div className="col-sm-2-ml-0">
      <select className="form-control" name="minutesOption" value={props.minutesOption}
              onChange={props.onChange}>
        <option value="at">at</option>
        <option value="every">every</option>
      </select>
    </div>
    <div className="col-sm-4" style={{display: props.minutesOption === "at" ? "block" : "none"}}>
      <select className="selectpicker" name="minutes"
              value={props.minutes} data-none-selected-text="Minute(s)"
              multiple={true} onChange={props.onChange1}>
        {minutesOptions}
      </select>
    </div>
    <div style={{display: props.minutesOption === "at" ? "none" : "block"}}
         className="form-outline col-sm-2 ml-2">
      <input type="number" min={1} max={59} className="form-control" name="everyNthMinute"
             value={props.everyNthMinute} onChange={props.onChange}/>
    </div>
    <label style={{display: props.minutesOption === "at" ? "none" : "block"}}
           className="col-form-label">minutes</label>
  </div>;
}

MinutesSelector.propTypes = {
  minutesOption: PropTypes.string,
  minutes: PropTypes.arrayOf(PropTypes.string),
  everyNthMinute: PropTypes.string,
  onChange: PropTypes.func,
  onChange1: PropTypes.func,
  minutesOptions: PropTypes.arrayOf(PropTypes.any)
};
