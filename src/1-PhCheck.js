import './App.css';

function PhCheck (props){

  return(
    <div className="box pH">
      <p>1단계: pH 분석</p>
      {props.bloodAcid()}
      <button onClick={() => {
        if (props.bloodAcid() === 'Normal') {
          props.setStep2(false);
          props.setStep1_1(true);
        } else {
          props.setStep2(true);
          props.setStep1_1(false);
        }
      }}>다음</button>
    </div>
  )
}

export default PhCheck