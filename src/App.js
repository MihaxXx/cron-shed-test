import Scheduler from './components/Scheduler';

function App() {

  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-sm-12">
          <Scheduler cronStrIO={'cronStrIO'} errorLabel={'errorLabel'} />
          <div className="row pl-4 pr-4 mx-auto">
            <label className="col-form-label">Cron string: </label>
            <div className="form-outline col pr-0">
              <input id="cronStrIO" type={"text"} className="form-control" placeholder="* * * * *"/>
            </div>
          </div>
          <div className="row mx-auto">
            <label className="col-form-label" id="errorLabel" style={{color: 'red'}}></label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;
