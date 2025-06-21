import React, {useContext, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button'; 
import PayrollContext from '../../context/payrollContext';
import {useForm} from "react-hook-form";
import { editEmployee } from '../../services/employeeService';
import Spinner from 'react-bootstrap/esm/Spinner';

const EditEmployeeModal = (props) => {
  const employeeData = props.modalData;
  const [loading, setLoading] = useState(false);
  const context = useContext(PayrollContext);
  const {setAlertData, setAlertShow, setAlertVariant, setModalShow, setRefresh} = context;
  const {register, formState: {errors}, handleSubmit} = useForm({
    defaultValues: {
        "name": employeeData?.name,
        "mobile": employeeData?.mobile,
        "email": employeeData?.email.trim(),
        "degisnation": employeeData?.degisnation,
        "wage_amount": parseFloat(employeeData?.wageAmount?.["$numberDecimal"])
            .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        "working_hour": employeeData?.workingHour,
        "recess_time": employeeData?.recessTime,
        "travel_allowance": employeeData?.travelAllowance,
    }
  });
  const onSubmit = async(payload) => {
    setLoading(true);
    if(!payload.email){
        payload.email = " "
    }
    payload["id"] = employeeData?._id;
    const {success, status, data, message} = await editEmployee(payload);
    if(!success) {
        setAlertVariant("danger");
    }
    else{
        setAlertVariant("success");
        setRefresh(true);
    }
    setAlertShow(true);
    setAlertData(message);
    setModalShow(false);
    setLoading(false);
  }
  return (
    <>
      <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                Edit employee
            </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{height: "75vh", overflowX: "hidden"}}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="mb-3">
              <Col><Form.Label>Name</Form.Label></Col>
              <Col><Form.Control type="text" style={{background: "#FFFFFF"}} placeholder="" {...register("name",{required: {value: true, message: "Employee name is requried"}, minLength: {value: 3, message: "Employee name must be greater then 3 character"}})}/> <p style={{fontSize: "13px", textAlign: "left", color: "#6c8080"}}> {errors.name && errors.name.message}</p></Col>
          </Row>
          <Row className="mb-3">
              <Col><Form.Label>Mobile</Form.Label></Col>
              <Col><Form.Control type="tel" style={{background: "#FFFFFF"}} placeholder="" {...register("mobile",{required: {value: true, message: "Employee mobile is requried"}, minLength: {value: 10, message: "Exactly 10 digits required"}, maxLength: {value: 10, message: "Exactly 10 digits required"}})}/> <p style={{fontSize: "13px", textAlign: "left", color: "#6c8080"}}> {errors.mobile && errors.mobile.message}</p></Col>
          </Row>
          <Row className="mb-3">
              <Col><Form.Label>Email</Form.Label></Col>
              <Col><Form.Control type="email" style={{background: "#FFFFFF"}} placeholder="" {...register("email", {pattern: { value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message: 'Invalid email address'}})}/> <p style={{fontSize: "13px", textAlign: "left", color: "#6c8080"}}> {errors.email && errors.email.message}</p></Col>
          </Row>
          <Row className="mb-3">
              <Col><Form.Label>Degisnation</Form.Label></Col>
              <Col><Form.Control type="text" style={{background: "#FFFFFF"}} placeholder="" {...register("degisnation",{required: {value: true, message: "Employee degisnation is requried"}})}/> <p style={{fontSize: "13px", textAlign: "left", color: "#6c8080"}}> {errors.degisnation && errors.degisnation.message}</p></Col>
          </Row>
          <Row className="mb-3">
              <Col><Form.Label>Salary</Form.Label></Col>
              <Col><Form.Control type="tel" style={{background: "#FFFFFF"}} placeholder="" {...register("wage_amount",{required: {value: true, message: "Employee salary is requried"}, minLength: {value: 2, message: "Minimum 2 digits required"}})}/> <p style={{fontSize: "13px", textAlign: "left", color: "#6c8080"}}> {errors.wage_amount && errors.wage_amount.message}</p></Col>
          </Row>
          <Row className="mb-3">
              <Col><Form.Label>Working hour</Form.Label></Col>
              <Col><Form.Control type="tel" style={{background: "#FFFFFF"}} placeholder="" {...register("working_hour",{required: {value: true, message: "Employee working hour is requried"}, minLength: {value: 1, message: "Minimum 1 digit required"}})}/> <p style={{fontSize: "13px", textAlign: "left", color: "#6c8080"}}> {errors.working_hour && errors.working_hour.message}</p></Col>
          </Row>
          <Row className="mb-3">
              <Col><Form.Label>Recess time (in minutes)</Form.Label></Col>
              <Col><Form.Control type="tel" style={{background: "#FFFFFF"}} placeholder="" {...register("recess_time",{required: {value: true, message: "Employee recess time is requried"}, minLength: {value: 1, message: "Minimum 1 digit required"}})}/> <p style={{fontSize: "13px", textAlign: "left", color: "#6c8080"}}> {errors.recess_time && errors.recess_time.message}</p></Col>
          </Row>
          <Row className="mb-3">
              <Col><Form.Label>Travel allowance</Form.Label></Col>
              <Col><Form.Control type="tel" style={{background: "#FFFFFF"}} placeholder="" {...register("travel_allowance",{required: {value: true, message: "Employee travel allowace is requried", minLength: {value: 1, message: "Minimum 1 digit required"}}})}/> <p style={{fontSize: "13px", textAlign: "left", color: "#6c8080"}}> {errors.travel_allowance && errors.travel_allowance.message}</p></Col>
          </Row>
          <Row className='my-2'>
              <Col></Col>
              <Col>
              {loading && <div className='text-center'>
                  <Spinner animation="border" role="status" variant="primary">
                      <span className="visually-hidden">Loading...</span>
                  </Spinner>
              </div>}
              </Col>
          </Row>
          <Row>
              <Col></Col>
              <Col className='text-end'><Button type='submit' className='w-100'>Edit</Button></Col>
          </Row>
        </Form>       
      </Modal.Body>
    </>
  )
}

export default EditEmployeeModal