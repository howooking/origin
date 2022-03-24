import './App.css';

function Compensation (props){

  return(
    <div className="box compensate">
      <p>3단계 : 보상반응 분석</p>
      {props.compensate()}
      {
        props.compensate() === 'Being Compensated'
        ? <button onClick={()=>{
          props.setStep4(true)
          props.setStep3_1(false)
        }}>다음</button>
        : null
      }
      {
        props.compensate() === 'Not Being Compensated'
        ? <button onClick={()=>{
          props.setStep3_1(true)
          props.setStep4(false)
        }}>다음</button>
        : null
      }
      {
        props.compen === true
        ? <div>
            <p>Being Compensated</p>
            <button onClick={()=>{
          props.setStep4(true)
          props.setStep3_1(false)
        }}>다음</button>
          </div>
        : null
      }
      {
        props.nocompen === true
        ? <div>
        <p>Not Being Compensated</p>
        <button onClick={()=>{
          props.setStep3_1(true)
          props.setStep4(false)
        }}>다음</button>
      </div>
        : null
      }
    </div>
  )
}

export default Compensation