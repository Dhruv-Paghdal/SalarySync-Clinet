import React, {useContext, useEffect} from 'react'
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import PayrollContext from '../../context/payrollContext';
import { useForm } from "react-hook-form"; 
import moment from 'moment';

const SearchFilterModal = (props) => {
    const context = useContext(PayrollContext);
    const {filterPayload, setFilterPayload, setModalShow} = context;
    const { register, handleSubmit, formState: { errors }, getValues,setValue} = useForm({
        defaultValues: {
            "start": props.showDate && moment.utc().startOf('month').format("YYYY-MM-DD"),
            "end": props.showDate && moment.utc().endOf('month').format("YYYY-MM-DD"),
        }
    });
    const onSubmit = async(data) => {
        setFilterPayload({...filterPayload, search: data});
        setModalShow(false);
    }
    const onReset = async() => {
        setFilterPayload({page: 1, row: 5, search: {}});
        setModalShow(false);
    }
    useEffect(()=>{
        if(filterPayload.search) {
            if(filterPayload.search.start){
                setValue("start", filterPayload.search.start ? moment.utc(filterPayload.search.start).format("YYYY-MM-DD") : moment.utc().startOf('month').format("YYYY-MM-DD"))
            }
            if(filterPayload.search.end){
                setValue("end", filterPayload.search.end ? moment.utc(filterPayload.search.end).format("YYYY-MM-DD") : moment.utc().endOf('month').format("YYYY-MM-DD"))
            }
            setValue("name", filterPayload.search.name ? filterPayload.search.name : "")
            setValue("mobile", filterPayload.search.mobile ? filterPayload.search.mobile : "")
            setValue("email", filterPayload.search.email ? filterPayload.search.email : "")
            setValue("employeeId", filterPayload.search.employeeId ? filterPayload.search.employeeId : "")
        }
    }, [])
  return (
    <>
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                Customise search
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleSubmit(onSubmit)} onReset={onReset}>
                {props.showDate && <Row className="mb-3">
                    <Col><Form.Label>Start date <span style={{fontWeight: "300"}}>(dd-mm-yyyy)</span></Form.Label></Col>
                    <Col><Form.Control type="date" style={{background: "#FFFFFF"}} {...register("start", {valueAsDate: true, required: {value: true, message: "Start date is required"}})}/> <p style={{fontSize: "13px", textAlign: "left", color: "#6c8080"}}> {errors.start && errors.start.message}</p></Col>
                </Row>}
                {props.showDate && <Row className="mb-3">
                    <Col><Form.Label>End date <span style={{fontWeight: "300"}}>(dd-mm-yyyy)</span></Form.Label></Col>
                    <Col><Form.Control type="date" style={{background: "#FFFFFF"}} {...register("end",{valueAsDate: true, required: {value: true, message: "End date is required"}, validate: value => moment.utc(value).format("YYYY-MM-DD").toString() >  moment.utc(getValues("start")).format("YYYY-MM-DD").toString() || "End date must be after start date"})}/> <p style={{fontSize: "13px", textAlign: "left", color: "#6c8080"}}> {errors.end && errors.end.message}</p></Col>
                </Row>}
                <Row className="mb-3">
                    <Col><Form.Label>Name</Form.Label></Col>
                    <Col><Form.Control type="text" style={{background: "#FFFFFF"}} {...register("name")}/></Col>
                </Row>
                <Row className="mb-3">
                    <Col><Form.Label>Email</Form.Label></Col>
                    <Col><Form.Control type="text" style={{background: "#FFFFFF"}} {...register("email")}/></Col>
                </Row>
                <Row className="mb-3">
                    <Col><Form.Label>Mobile</Form.Label></Col>
                    <Col><Form.Control type="tel" style={{background: "#FFFFFF"}} {...register("mobile")}/></Col>
                </Row>
                <Row className="mb-3">
                    <Col><Form.Label>Employee ID</Form.Label></Col>
                    <Col><Form.Control type="text" style={{background: "#FFFFFF"}} {...register("employeeId")}/></Col>
                </Row>
                <Row>
                    <Col></Col>
                    <Col>
                        <Row>
                            <Col className='mb-2'><Button type='reset' variant='danger' className='w-100'>Reset filter</Button></Col>                    
                            <Col><Button type='submit' className='w-100'>Show results</Button></Col>
                        </Row>
                    </Col>
                </Row>
            </Form>       
        </Modal.Body>
    </>
  )
}

export default SearchFilterModal;