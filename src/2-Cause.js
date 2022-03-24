import './App.css';

function Cause (props){

  return(
    <div className="box cause">
      <p>2단계: pH 원인 분석</p>
      {props.pHCause()}
      <button onClick={() => {
        props.setStep3(true)
      }}>다음</button>
    </div>
  )
}

export default Cause