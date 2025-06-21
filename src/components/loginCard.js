import React, {useContext} from 'react';
import Card from 'react-bootstrap/Card';
import LoginForm from './login/loginForm';
import ForgotPasswordForm from './login/forgotPasswordForm';
import ResetPasswordForm from './login/resetPasswordForm';
import OtpVerify from './login/otpVerify';
import PayrollContext from '../context/payrollContext';
import ErrorMessage from './errorMessage';
import { loginEnum } from '../constValue';
import "./css/login.css"

const LoginCard = () => {
  const context = useContext(PayrollContext);
  const {loginCard} = context;
  return (
    <>
      <ErrorMessage />
      <div className='login'>
        <div>
          <p className='mainTitle pb-4 m-0 fs-2'>Salary-Sync</p>
          <Card className="p-md-5 cardContainer">
            <Card.Body>
              {loginCard === loginEnum.login && <LoginForm />}
              {loginCard === loginEnum.forgot_password && <ForgotPasswordForm />}
              {loginCard === loginEnum.otp && <OtpVerify />}
              {loginCard === loginEnum.reset_password && <ResetPasswordForm />}
            </Card.Body>
          </Card>
        </div>
        <div className='imageContainer'>
        </div>
      </div>
    </>
  )
}

export default LoginCard