import React, {useContext, useEffect, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import { useForm, Controller } from "react-hook-form";
import { calculateSalary } from '../../services/salaryService';
import { companyId } from '../../services/indexService';
import Spinner from 'react-bootstrap/esm/Spinner';
import PayrollContext from '../../context/payrollContext';
import moment from 'moment';

const CalculateSalaryModal = () => {
    const context = useContext(PayrollContext);
    const [loading, setLoading] = useState(false);
    const {setAlertData, setAlertShow, setAlertVariant, setModalShow, setRefresh} = context;
    const { register, handleSubmit, formState: { errors }, control, setValue} = useForm();
    const onSubmit = async(formData) => {
        const payload = new FormData();
        setLoading(true);
        for (const key in formData) {
            if (key === "file") {
                payload.append(key, formData[key][0]);
            } else {
                payload.append(key, formData[key]);
            }
        }
        const {success, status, data, message} = await companyId();
        const companyID = data._id;
        if(!success){
            setAlertVariant("danger");
            setAlertShow(true);
            setAlertData(message);
            setModalShow(false);
        }
        else{
            const {success, status, data, message} = await calculateSalary(payload, companyID);
            if(!success) {
                setAlertVariant("danger");
                setAlertShow(true);
                setAlertData(message);
                setModalShow(false);
            }
            else{
                setAlertVariant("success");
                setAlertShow(true);
                setAlertData(message);
                setModalShow(false);
                setRefresh(true);
            }
        }
        setLoading(false);
    }
    useEffect(() => {
        (async()=>{
            const {success, status, data, message} = await companyId();
            setValue("working_year", (data.workingYear ? data.workingYear : ""))
        })()
    }, [])
    
  return (
    <>
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                Monthly salary
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row className="mb-3">
                    <Col><Form.Label>Month</Form.Label></Col>
                    <Col><Form.Control type="number" style={{background: "#FFFFFF"}} placeholder="" {...register("month", {required: {value: true, message: "Month is required"}, min: {value: 1, message: "Invalid month"}, max: {value:12, message: "Invalid month"}, minLength: {value:1, message: "Invalid month"}, maxLength: {value: 2, message: "Invalid month"}})}/> <p className="pt-2 mb-0" style={{fontSize: "13px", textAlign: "left", color: "#6c8080"}}> {errors.month && errors.month.message}</p> </Col>
                </Row>
                <Row className="mb-3">
                    <Col><Form.Label>Year</Form.Label></Col>
                    <Col><Form.Control type="number" style={{background: "#FFFFFF"}} placeholder="" {...register("year", {required: {value: true, message: "Year is required"}, min: {value: 1000, message: "Invalid year"}, max: {value:9999, message: "Invalid year"}, minLength: {value:4, message: "Invalid year"}, maxLength: {value: 4, message: "Invalid year"}})}/> <p className="pt-2 mb-0" style={{fontSize: "13px", textAlign: "left", color: "#6c8080"}}> {errors.year && errors.year.message}</p> </Col>
                </Row>
                <Row className="mb-3">
                    <Col><Form.Label>Holidays <span style={{fontWeight: "300"}}>(mm-dd-yyyy)</span></Form.Label></Col>
                    <Col><Form.Control type="text" style={{background: "#FFFFFF"}} placeholder="Seperated by ," {...register("holidays", {
            validate: (value) => {
              if (!value) return true;
              
              const dates = value.split(",").map(date => date.trim());
              
              for (let date of dates) {
                if (!moment.utc(date, "MM-DD-YYYY", true).isValid()) {
                  return `Invalid date: ${date}. Use MM-DD-YYYY format.`;
                }
              }
              
              return true;
            }
          })}/> <p style={{ fontSize: "13px", textAlign: "left", color: "#6c8080" }}>
          {errors.holidays?.message}
        </p> </Col>
                </Row>
                <Row className="mb-3">
                    <Col><Form.Label>Over Time Pay Rate</Form.Label></Col>
                    <Col><Form.Control type="number" step="any" style={{background: "#FFFFFF"}} {...register("over_time_pay_rate", { valueAsNumber: true, min: {value: 0.1, message: "Invalid rate"}})}/> <p className="pt-2 mb-0" style={{fontSize: "13px", textAlign: "left", color: "#6c8080"}}> {errors.over_time_pay_rate && errors.over_time_pay_rate.message}</p> </Col>
                </Row>
                <Row className="mb-3">
                    <Col><Form.Label>Working year</Form.Label></Col>
                    <Col><Form.Control type="text" placeholder="" disabled {...register("working_year")}/></Col>
                </Row>
                <Row>
                    <Col><Form.Label>Attendance sheet</Form.Label></Col>
                    <Col>
                        <Controller
                            control={control}
                            name={"sheet"}
                            rules={{required: {value: true, message: "Attendance sheet is required"}}}
                            render={({ field: { value, onChange, ...field } }) => {
                            return (
                                <input type="file" {...field} value={value?.fileName}
                                onChange={(event) => {
                                    onChange(event.target.files[0]);
                                }} style={{
                                    "backgroundColor": "rgb(255, 255, 255)",
                                    "display": "block",
                                    "width": "100%",
                                    "padding":" 0.375rem 0.75rem 0.375rem 0rem",
                                    "fontSize": "1rem",
                                    "fontWeight": "400",
                                    "lineHeight": "1.5",
                                    "color": "var(--bs-body-color)",
                                    "appearance": "none",
                                    "backgroundClip": "padding-box",
                                    "border": "var(--bs-border-width) solid var(--bs-border-color)",
                                    "borderRadius": "var(--bs-border-radius)",
                                    "transition": "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
                                }}/>
                            );
                            }}
                        />
                        <p className="pt-2 mb-0" style={{fontSize: "13px", textAlign: "left", color: "#6c8080"}}> {errors.sheet && errors.sheet.message}</p>
                    </Col>
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
                    <Col className='text-end'><Button type='submit' className='w-100'>Calculate</Button></Col>
                </Row>
            </Form>       
        </Modal.Body>
    </>
  )
}

export default CalculateSalaryModal