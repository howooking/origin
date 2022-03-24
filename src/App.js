import './App.css';
import { useState } from 'react';
import { Table } from 'react-bootstrap';
import dogData from './Datadog'
import inputData from './input'
import Modify from './Modify'
import PHCheck from './1-PhCheck';
import NormalpH from './1.5-NormalPh';
import Cause from './2-Cause';
import Compensation from './3-Compesation';
import WhyNoCompensate from './3.5-WhyNoCompensate';
import AGCheck from './4-AGCheck.js';

function App() {
  //States
  let [inputVal, setInputVal] = useState(inputData)
  let [modifyComp, setModifyComp] = useState(false)
  let [coreData, setCoreData] = useState(dogData)
  let [step1, setStep1] = useState(false)
  let [step1_1, setStep1_1] = useState(false)
  let [step2, setStep2] = useState(false)
  let [step3, setStep3] = useState(false)
  let [step3_1, setStep3_1] = useState(false)
  let [step4, setStep4] = useState(false)
  let [aspect, setAspect] = useState('')
  let [compen, setCompen] = useState('')
  let [nocompen, setNocompen] = useState('')

  //인풋값 세팅
  function settingInput () {
    let newArr = [...inputVal]
    setInputVal(newArr)
  }

  //증감화살표
  let upDown = [];
  let inputs = inputVal.map((a) => {
    return a.input
  })
  for(let i = 0; i < inputs.length; i++) {
    if (inputs[i] === undefined ) {
      upDown[i] = ''
    } else if (inputs[i] < coreData[i].min ) {
      upDown[i] = '⬇️'
    } else if (inputs[i] > coreData[i].max) {
      upDown[i] = '⬆️' 
    } else {
      upDown[i] = '-'
    }
  }

  //산혈증, 알칼리혈증 분석함수
  let pHinput = inputVal[0].input
  function bloodAcid () {
    if (pHinput === undefined) {
      return 'Please Input pH Value'
    } else if (pHinput < coreData[0].min) {
      return 'Acidemia'
    } else if (pHinput > coreData[0].max) {
      return 'Alkalemia'
    } else {
      return 'Normal'
    }
  }
  
  //pH원인분석함수
  let pvCO2Input = inputVal[1].input
  let pvCO2Med = (Number(coreData[1].min)+Number(coreData[1].max))/2
  function pHCause () {
    if (bloodAcid() === 'Acidemia') {
      if (pvCO2Input < pvCO2Med) {
        return 'Metabolic Acidosis'
      } else {
        return 'Respiratory Acidosis'
      }
    } else if (bloodAcid() === 'Alkalemia') {
      if (pvCO2Input > pvCO2Med) {
        return 'Metabolic Alkalosis'
      } else {
        return 'Respiratory Alkalosis'
      }
    } 
  }

  //보상분석함수
  let hCO3Input = inputVal[5].input
  let hCO3Med = (Number(coreData[5].min)+Number(coreData[5].max))/2
  function compensate () {
    if (pHCause() === 'Metabolic Acidosis'){
      if (pvCO2Med-Number(pvCO2Input)-0.7*(hCO3Med-Number(hCO3Input)) <= 2 && pvCO2Med-Number(pvCO2Input)-0.7*(hCO3Med-Number(hCO3Input)) >= -2){
        return 'Being Compensated'
      } else {
        return 'Not Being Compensated'
      }
    } else if (pHCause() === 'Metabolic Alkalosis'){
      if (Number(pvCO2Input)-pvCO2Med-0.7*(Number(hCO3Input)-hCO3Med) <= 2 && Number(pvCO2Input)-pvCO2Med-0.7*(Number(hCO3Input)-hCO3Med) >= -2){
        return 'Being Compensated'
      } else {
        return 'Not Being Compensated'
      }
    } else if (pHCause() === 'Respiratory Acidosis'){
      return <select onChange={(e)=>{
        if (e.target.value === 'Acute') {
          if (Number(hCO3Input)-hCO3Med-0.15*(Number(pvCO2Input)-pvCO2Med) <= 2 && Number(hCO3Input)-hCO3Med-0.15*(Number(pvCO2Input)-pvCO2Med) >= -2) {
            setCompen(true);
            setNocompen(false);
            setAspect('Acute')
          } else {
            setNocompen(true);
            setCompen(false);
            setAspect('Acute')
          }
        } else if (e.target.value === 'Chronic'){
          if (Number(hCO3Input)-hCO3Med-0.35*(Number(pvCO2Input)-pvCO2Med) <= 2 && Number(hCO3Input)-hCO3Med-0.35*(Number(pvCO2Input)-pvCO2Med) >= -2) {
            setCompen(true);
            setNocompen(false);
            setAspect('Chronic')
          } else {
            setCompen(false);
            setNocompen(true);
            setAspect('Chronic')
          }
        }
        }}>
        <option>양상</option>
        <option>Acute</option>
        <option>Chronic</option>
      </select>
    } else if (pHCause() === 'Respiratory Alkalosis'){
      return <select onChange={(e)=>{
        if (e.target.value === 'Acute') {
          if (Number(hCO3Input)-hCO3Med+0.25*(pvCO2Med-Number(pvCO2Input)) <= 2 && Number(hCO3Input)-hCO3Med+0.25*(pvCO2Med-Number(pvCO2Input)) >= -2) {
            setCompen(true);
            setNocompen(false);
            setAspect('Acute')
          } else {
            setNocompen(true);
            setCompen(false);
            setAspect('Acute')
          }
        } else if (e.target.value === 'Chronic'){
          if (Number(hCO3Input)-hCO3Med+0.55*(Number(pvCO2Input)-pvCO2Med) <= 2 && Number(hCO3Input)-hCO3Med+0.55*(Number(pvCO2Input)-pvCO2Med) >= -2) {
            setCompen(true);
            setNocompen(false);
            setAspect('Chronic')
          } else {
            setCompen(false);
            setNocompen(true);
            setAspect('Chronic')
          }
        }
        }}>
      <option>양상</option>
      <option>Acute</option>
      <option>Chronic</option>
    </select>
    }
  }

  //보상안되는 원인분석함수
  function whynocompensate () {
    if(pHCause() === 'Metabolic Acidosis'){
      if(pvCO2Med-Number(pvCO2Input)-0.7*(hCO3Med-Number(hCO3Input)) > 2){
        return 'Mixed Metabolic Alkalosis'
      } else if (pvCO2Med-Number(pvCO2Input)-0.7*(hCO3Med-Number(hCO3Input)) < -2){
        return 'Mixed Respiratory Acidosis or Another Metabolic Acidosis'
      }
    } else if(pHCause() === 'Metabolic Alkalosis'){
      if(Number(pvCO2Input)-pvCO2Med-0.7*(Number(hCO3Input)-hCO3Med) > 2){
        return 'Mixed Metabolic Acidosis'
      } else if (Number(pvCO2Input)-pvCO2Med-0.7*(Number(hCO3Input)-hCO3Med) < -2){
        return 'Mixed Respiratory Alkalosis or Another Metabolic Alkalosis'
      }
    } else if(pHCause() === 'Respiratory Acidosis'){
      if (aspect === 'Acute'){
        if(Number(hCO3Input)-hCO3Med+0.25*(pvCO2Med-Number(pvCO2Input)) > 2){
          return 'Mixed Metabolic Alkalosis'
        } else if(Number(hCO3Input)-hCO3Med+0.25*(pvCO2Med-Number(pvCO2Input)) < -2){
          return 'Mixed Metabolic Acidosis'
        }
      } else if (aspect === 'Chronic'){
        if(Number(hCO3Input)-hCO3Med-0.35*(Number(pvCO2Input)-pvCO2Med) > 2){
          return 'Mixed Metabolic Alkalosis'
        } else if (Number(hCO3Input)-hCO3Med-0.35*(Number(pvCO2Input)-pvCO2Med) < -2){
          return 'Mixed Metabolic Acidosis'
        }
      }
    } else if(pHCause() === 'Respiratory Alkalosis'){
      if (aspect === 'Acute'){
        if(Number(hCO3Input)-hCO3Med+0.25*(pvCO2Med-Number(pvCO2Input)) < -2){
          return 'Mixed Metabolic Acidosis'
        } else if(Number(hCO3Input)-hCO3Med+0.25*(pvCO2Med-Number(pvCO2Input)) > 2){
          return 'Mixed Metabolic Alkalosis'
        }
      } else if(aspect === 'Chronic'){
        if(Number(hCO3Input)-hCO3Med+0.55*(Number(pvCO2Input)-pvCO2Med) > 2){
          return 'Mixed Metabolic Alkalosis'
        } else if(Number(hCO3Input)-hCO3Med+0.55*(Number(pvCO2Input)-pvCO2Med) < -2){
          return 'Mixed Metabolic Acidosis'
        }
      }
    }
  }



  return (
    <div>
      <nav className="nav">
        <div>Dog VBGA Calculator </div>
      </nav>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>검사항목</th>
            <th>참고범위 
              <button onClick={() => {
                setModifyComp(true)
              }}>수정</button>
            </th>
            <th>입력</th>
            <th>증가/감소</th>
          </tr>
        </thead>
        <tbody>
          {
            coreData.map((a, i) => {
              return (
              <tr key={i}> 
                <td>{a.title}</td>
                <td>{a.min} ~ {a.max}</td>
                <td>
                  <input onChange={(e) => {
                    inputVal[i].input = e.target.value;
                    settingInput ();
                  }}/>
                </td>
                <td>
                  {upDown[i]}
                </td>
              </tr>
              )
            })
          }
        </tbody>
      </Table>
      {
        modifyComp === true
        ? <Modify setModifyComp={setModifyComp} coreData={coreData} setCoreData={setCoreData}/>
        : null
      }
      <button onClick={() => {
        setStep1(true)
      }}>분석</button>
      <button onClick={() => {window.location.reload()}}>Reset</button>
      
      {/* steps */}
      {
        step1 === true
        ? <PHCheck bloodAcid={bloodAcid} setStep1_1={setStep1_1} setStep2={setStep2}/>
        : null
      }
      {
        step1_1 === true
        ? <NormalpH />
        : null
      }
      {
        step2 === true
        ? <Cause pHCause={pHCause} setStep3={setStep3}/>
        : null
      }
      {
        step3 === true
        ? <Compensation compensate={compensate} compen={compen} nocompen={nocompen} setNocompen={setNocompen} setCompen={setCompen} setStep4={setStep4} setStep3_1={setStep3_1}/>
        : null
      }
      {
        step3_1 === true
        ? <WhyNoCompensate whynocompensate={whynocompensate} setStep4={setStep4}/>
        : null
      }
      {
        step4 === true
        ? <AGCheck />
        : null
      }
    </div>
  );
}

export default App;
