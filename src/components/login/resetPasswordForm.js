import React, {useContext, useState} from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import PayrollContext from '../../context/payrollContext';
import { loginEnum } from '../../constValue';
import { useForm } from "react-hook-form";
import { resetPassword } from '../../services/indexService';

const ResetPasswordForm = () => {
  const context = useContext(PayrollContext);
  const {setLoginCard, setAlertData, setAlertShow, setAlertVariant} = context;
  const [errorMessage, setErrorMessage] = useState('');
  const { register, handleSubmit, formState: { errors }, watch} = useForm();
  const newPasswordWatch = watch("new_password");
  const onSubmit = async(payload) => {
    if (!localStorage.getItem("password_reset_id")) {
      return setErrorMessage("Compnay ID not found")
    }
    payload["id"] = localStorage.getItem("password_reset_id");
    const { success, status, data, message} = await resetPassword(payload);
    if(!success) {
        setAlertVariant("danger");
        setAlertShow(true);
        setAlertData(message);
    }
    else {
        setAlertVariant("success");
        setAlertShow(true);
        setAlertData(message);
        localStorage.removeItem("password_reset_id");
        setLoginCard(loginEnum.login)
    }
  }
  return (
    <>
      <Card.Title className='pb-3 text-center'>Reset your password</Card.Title>
      <Card.Text>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="formBasicNewPassword">
            <Form.Control className='loginText' type="text" placeholder="New password *" {...register("new_password", { required: {value: true, message: "New password is required"}, minLength: { value: 4, message: 'Minimum 4 characters are required'}})}/>
          </Form.Group>
          <p style={{fontSize: "13px", textAlign: "left", color: "#6c8080"}}> {errors.new_password && errors.new_password.message}</p>
          <Form.Group className="mb-4" controlId="formBasicConfirmPassword">
            <Form.Control className='loginText' type="text" placeholder="Confirm password *"  {...register("confirm_password", { required: {value: true, message: "Confirm password is required"}, minLength: { value: 4, message: 'Minimum 4 characters are required'}, validate: v => v === newPasswordWatch || 'New password and confirm password does not match.'})}/>
          </Form.Group>
          <p style={{fontSize: "13px", textAlign: "left", color: "#6c8080"}}> {errors.confirm_password && errors.confirm_password.message}</p>
          <p style={{fontSize: "13px", textAlign: "left", color: "#6c8080"}}> {errorMessage} </p>
          <div>
            <Button className='w-100' type='submit'>Reset Password</Button>
          </div>
        </Form>
      </Card.Text>
    </>
  )
}

export default ResetPasswordForm