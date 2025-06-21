import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const SalaryDetailModal = (props) => {
  const data = props.modalData.salaryDetails
  const employeeData = props.modalData.employeeDetails
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Salary details of {props.modalData?.month} - {props.modalData?.year}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{maxHeight: "80vh", overflowX: "hidden"}}>
        {
          data.map((ele, index)=>{
                    return <Accordion className='mb-2'>
                      <Accordion.Item eventKey={index}> 
                        <Accordion.Header>{ele.employee} {employeeData?.map((element)=>{
                          if((element?._id === ele?.employeeId)){
                            return (element?.name?.split(" ")?.length > 1) ? (element?.name?.split(" ")[0]?.charAt(0)?.toUpperCase() + element?.name?.split(" ")[0]?.slice(1)?.toLowerCase() + " " + element?.name?.split(" ")[1]?.charAt(0)?.toUpperCase() + element?.name?.split(" ")[1]?.slice(1)?.toLowerCase()) : (element?.name?.charAt(0)?.toUpperCase() + element?.name?.slice(1)?.toLowerCase())
                          }
                          else {
                            return " "
                          }
                        })}</Accordion.Header>
                        <Accordion.Body>
                          <Card style={{ width: "auto" }}>
                            <Card.Body>
                              <Card.Text>
                                <Row className="mb-2">
                                  <Col className='text-dark'>Total working hours</Col>
                                  <Col>{parseFloat(ele.totalFixedHourWorked["$numberDecimal"]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} x {parseFloat(ele.fixedSalary["$numberDecimal"])
                            .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Col>
                                  <Col className='text-success'>{(parseFloat(ele.totalFixedHourWorked["$numberDecimal"])*parseFloat(ele.fixedSalary["$numberDecimal"])).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Col>
                                </Row>
                                {ele.totalTravelAllowance ? <Row className="mb-2">
                                    <Col className='text-dark'>Total travel allowance</Col>
                                    <Col>{ele.totalWorkingDays} x {ele.travelAllowance}</Col>
                                    <Col className='text-success'>{ele.totalTravelAllowance.toLocaleString()}</Col>
                                </Row> : <></>}
                                {ele.totalOverTimePeriod ? <Row className="mb-2">
                                    <Col className='text-dark'>Total overtime hour</Col>
                                    <Col>{parseFloat(ele.totalOverTimePeriod["$numberDecimal"])
                            .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Col>
                                    <Col className='text-success'>{parseFloat(ele.OverTimeSalary["$numberDecimal"])
                            .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Col>
                                </Row> : <></>}
                                {ele.totalAdvanceSalary ? <Row className="mb-2">
                                    <Col className='text-dark'>Total Advance salary</Col>
                                    <Col></Col>
                                    <Col className='text-danger'>{(ele.totalAdvanceSalary["$numberDecimal"])
                            .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Col>
                                </Row> : <></>}
                                {ele.loan ? <Row className="mb-2">
                                    <Col className='text-dark'>Total loan</Col>
                                    <Col></Col>
                                    <Col className='text-danger'>{(ele.loan["$numberDecimal"])
                            .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Col>
                                </Row> : <></>}
                                <Row className="mb-2">
                                    <Col className='text-dark'>Final salary</Col>
                                    <Col></Col>
                                    <Col className='text-primary' style={{fontWeight: 'bold'}}>{parseFloat(ele.finalSalary["$numberDecimal"])
                            .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Col>
                                </Row>
                                <hr />
                                {ele.totalAdvanceSalary ? <><Row>
                                    <Col className='text-dark'>Advance salary list</Col>
                                    <Col>{ele.advanceList.map((advanceData)=>{
                                      return <>{advanceData.date} <br /></>
                                    })}</Col>
                                    <Col>{ele.advanceList.map((advanceData)=>{
                                      return <>{(advanceData.amount["$numberDecimal"])
                                        .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <br /></>
                                    })}</Col>
                                </Row>
                                <hr />
                                </> : <></>}
                                {ele.absent ? <>
                                  <Row>
                                    <Col className='text-dark'>Absent list - <span className='text-danger'>{ele.absent.length}</span></Col>
                                    <Col>
                                    {ele.absent.slice(0, Math.ceil(ele.absent.length / 2)).map((absentDate, index) => (
                                      <div key={index}>{absentDate}</div>
                                    ))}
                                    </Col>
                                    <Col>
                                      {ele.absent.slice(Math.ceil(ele.absent.length / 2)).map((absentDate, index) => (
                                        <div key={index}>{absentDate}</div>
                                      ))}
                                    </Col>
                                  </Row>
                                </> : <></>}
                              </Card.Text>
                            </Card.Body>
                          </Card>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
          })
        }
      </Modal.Body>
    </>
  )
}

export default SalaryDetailModal;