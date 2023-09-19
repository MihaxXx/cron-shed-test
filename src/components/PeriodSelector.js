import * as PropTypes from "prop-types";

export function PeriodSelector(props) {
  let periodOptions = ["Hour", "Day", "Week", "Month", "Year"].reverse()
    .map((val, i, arr) =>
      <option value={arr.length - 1 - i} key={arr.length - 1 - i}>{val}</option>)

  return <div className="form-group row">
    <label className="col-form-label">Every</label>
    <div className="col-sm-3">
      <select className="form-control" name="period" value={props.period}
              onChange={props.onChange}>
        {periodOptions}
      </select>
    </div>
  </div>;
}

PeriodSelector.propTypes = {
  period: PropTypes.string,
  onChange: PropTypes.func,
  periodOptions: PropTypes.arrayOf(PropTypes.any)
};
