import './App.css';

function WhyNoCompensate (props){

  return(
    <div className="box whynocompensate">
      <p>3.5단계: 보상이 안되는 원인 분석</p>
      {props.whynocompensate()}
      <button onClick={() => {
        props.setStep4(true)
      }}>다음</button>
    </div>
  )
}

export default WhyNoCompensate