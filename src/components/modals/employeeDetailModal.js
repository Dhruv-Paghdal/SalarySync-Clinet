import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {CurrencyDollar} from 'react-bootstrap-icons'

const EmployeeDetailModal = (props) => {
  const data = props.modalData;
  return (
    <>
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                {data?.employeeId}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Row className='mb-3'>
                <Col style={{fontWeight: "500"}}>Name</Col>
                <Col>{
                        (data?.name?.split(" ")?.length > 1) ? (data?.name?.split(" ")[0]?.charAt(0)?.toUpperCase() + data?.name?.split(" ")[0]?.slice(1)?.toLowerCase() + " " + data?.name?.split(" ")[1]?.charAt(0)?.toUpperCase() + data?.name?.split(" ")[1].slice(1)?.toLowerCase()) : (data?.name?.charAt(0)?.toUpperCase() + data?.name?.slice(1)?.toLowerCase())
                }</Col>
            </Row>
            <Row className='mb-3'>
                <Col style={{fontWeight: "500"}}>Mobile</Col>
                <Col>{data?.mobile}</Col>
            </Row>
            {data.email && <Row className='mb-3'>
                <Col style={{fontWeight: "500"}}>Email</Col>
                <Col>{data?.email}</Col>
            </Row>}
            <Row className='mb-3'>
                <Col style={{fontWeight: "500"}}>Designation</Col>
                <Col>{data?.degisnation}</Col>
            </Row>
            <Row className='mb-3'>
                <Col style={{fontWeight: "500"}}>Salary (<CurrencyDollar />/hr)</Col>
                <Col style={{color: "#198754", fontWeight: "bold"}}><CurrencyDollar /> {parseFloat(data?.wageAmount?.["$numberDecimal"])
    .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Col>
            </Row>
            <Row className='mb-3'>
                <Col style={{fontWeight: "500"}}>Fixed working hour</Col>
                <Col>{data?.workingHour} hr</Col>
            </Row>
            <Row className='mb-3'>
                <Col style={{fontWeight: "500"}}>Recess time</Col>
                <Col>{data?.recessTime} min</Col>
            </Row>
            <Row className='mb-3'>
                <Col style={{fontWeight: "500"}}>Travel allowance</Col>
                <Col><CurrencyDollar /> {data?.travelAllowance}</Col>
            </Row>
        </Modal.Body>
    </>
  )
}

export default EmployeeDetailModal