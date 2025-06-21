import React, {useContext, useState} from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { useForm } from "react-hook-form";
import InputGroup from 'react-bootstrap/InputGroup';
import {EnvelopeAtFill, PersonCircle} from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button';
import PayrollContext from '../../context/payrollContext';
import { loginEnum } from '../../constValue';
import { forgotPassword } from '../../services/indexService';
import Spinner from 'react-bootstrap/Spinner';

const ForgotPasswordForm = () => {
  const context = useContext(PayrollContext);
  const {setLoginCard, setAlertData, setAlertShow, setAlertVariant} = context;
  const [spinnerVisiblity, setSpinnerVisiblity] = useState("d-none");
  const { register, handleSubmit, formState: { errors }, watch} = useForm();
  const usernameWatch = watch('username');
  const emailWatch = watch('email');
  const onSubmit = async(payload) => {
      setSpinnerVisiblity("visible");
      const { success, status, data, message} = await forgotPassword(payload);
      if (!success) {
        setSpinnerVisiblity("d-none");
        setAlertVariant("danger")
        setAlertShow(true);
        setAlertData(message);
      } else {
        setSpinnerVisiblity("d-none");
        setAlertVariant("success")
        setAlertShow(true);
        setAlertData(message);
        setLoginCard(loginEnum.otp);
        localStorage.setItem("password_reset_id", data)
      }
  }
  return (
    <>
        <Card.Title className='pb-3 text-center'>Reset your password</Card.Title>
        <Card.Text>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <InputGroup className='pb-3' style={{width: "100%"}}>
                        <InputGroup.Text style={{backgroundColor: "#f1f1f1", borderTopLeftRadius: "15px", borderBottomLeftRadius:"15px"}}><EnvelopeAtFill color='#0d6efd'/></InputGroup.Text>
                        <Form.Control className='loginText' type="email" placeholder="Email" {...register("email", { required: {value: (usernameWatch ? false : true), message: "Email is required"}, pattern: { value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message: 'Invalid email address'}})}/>
                    </InputGroup>
                <p style={{fontSize: "13px", textAlign: "left", color: "#6c8080"}}> {errors.email && errors.email.message}</p>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <InputGroup className='pb-3' style={{width: "100%"}}>
                        <InputGroup.Text style={{backgroundColor: "#f1f1f1", borderTopLeftRadius: "15px", borderBottomLeftRadius:"15px"}}><PersonCircle color='#0d6efd'/></InputGroup.Text>
                        <Form.Control className='loginText' type="text" placeholder="Username" {...register("username", { required: {value: (emailWatch ? false : true), message: "Username is required"}, minLength: {value: 5, message: "Minimum 5 characters required"}})}/>
                    </InputGroup>
                    <p style={{fontSize: "13px", textAlign: "left", color: "#6c8080"}}> {errors.username && errors.username.message}</p>
                </Form.Group>
                <div className='pb-3'>
                    <Button className='w-100' type='submit'>Send Request</Button>
                </div>
                <div className='text-center pb-3'>
                    <Spinner animation="border" role="status" variant="primary" className={spinnerVisiblity}>
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
                <p className='m-0 text-center hoverEffect' style={{fontWeight: "bold",color: "#0d6efd"}} onClick={() => {setLoginCard(loginEnum.login)}}>Back to login</p>
            </Form>
        </Card.Text>
    </>
  )
}

export default ForgotPasswordForm;