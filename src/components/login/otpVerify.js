import React, {useState, useContext} from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import OtpInput from 'react-otp-input';
import { useForm } from "react-hook-form";
import PayrollContext from '../../context/payrollContext';
import { loginEnum } from '../../constValue';
import { otpVerify } from '../../services/indexService';

const OtpVerify = () => {
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const context = useContext(PayrollContext);
  const {setLoginCard, setAlertData, setAlertShow, setAlertVariant} = context;
  const { handleSubmit } = useForm();
  const onSubmit = async() => {
    if(otp.length !== 6){
      return setErrorMessage("OTP must contain 6 digits.");
    }
    if(otp.length === 6){
      setErrorMessage("")
    }
    if (!localStorage.getItem("password_reset_id")) {
      return setErrorMessage("Compnay ID not found")
    }
    const payload = {
      id: localStorage.getItem("password_reset_id"),
      otp: otp
    }
    const { success, status, data, message} = await otpVerify(payload);
    if(!success) {
      setAlertVariant("danger");
      setAlertShow(true);
      setAlertData(message);
    }
    else {
      setAlertVariant("success");
      setAlertShow(true);
      setAlertData(message);
      setLoginCard(loginEnum.reset_password);
    }
  }
  return (
    <>
      <Card.Title className='pb-3 text-center'>Please enter OTP recieved on your email</Card.Title>
      <Card.Text>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="otpInput mb-4" controlId="formBasicOtp">
            <OtpInput
            inputType='tel'
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderSeparator={<span>•</span>} 
            renderInput={(props) => <input {...props} />}
            />
          </Form.Group>
          <p style={{fontSize: "13px", textAlign: "left", color: "#6c8080"}}> {errorMessage} </p>
          <div>
              <Button className='w-100' type='submit' >Verify</Button>
          </div>
          <p className='pt-3 m-0 text-center hoverEffect' style={{fontWeight: "bold",color: "#0d6efd"}} onClick={() => {setLoginCard(loginEnum.login)}}>Back to login</p>
        </Form>
      </Card.Text>
    </>
  )
}

export default OtpVerify