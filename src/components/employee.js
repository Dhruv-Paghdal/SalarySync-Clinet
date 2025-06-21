import React,{useState, useContext, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import { useForm } from "react-hook-form";
import {PlusLg, InfoCircle, ThreeDots, CurrencyDollar, PencilSquare, Trash, CashStack, Sliders} from 'react-bootstrap-icons';
import Dropdown from 'react-bootstrap/Dropdown';
import Pagination from 'react-bootstrap/Pagination';
import Table from 'react-bootstrap/Table';
import AppModal from './modal';
import PayrollContext from '../context/payrollContext';
import { modalTypeEnum, deleteTypeEnum } from '../constValue';
import { employeeList } from '../services/employeeService';
import Spinner from 'react-bootstrap/esm/Spinner';

const Employee = () => {
    const context = useContext(PayrollContext);
    const { setModalShow, setModalType, setModalData,  setAlertData, setAlertShow, setAlertVariant, setFilterPayload, refresh, setRefresh, filterPayload, setDeleteType} = context;
    const [totalPage, setTotalPage] = useState(1);  
    const [callEffect, setCallEffect] = useState(false);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]); 
    const [curr, set_Curr] = useState(1);
    const { register, handleSubmit} = useForm();
    const handleModal = (type, data) => {
        if(type === modalTypeEnum.edit_employee || type === modalTypeEnum.employee_detail){
            setModalData(data)
        }
        if(type === modalTypeEnum.delete_data){
            setDeleteType(deleteTypeEnum.employee_detail);
            setModalData({
                employeeId: data.employeeId,
                _id: data._id
            })
        }
        if(type === modalTypeEnum.employee_increment){
            setModalData({
                employeeId: data.employeeId,
                name: data.name,
                _id: data._id
            })
        }
        setModalType(type);
        setModalShow(true);
    }
    const pageChangeFunction = (p) => {
        if (p >= 1 && p <= totalPage) {
              set_Curr(p);
        }
    };
    const showPageItemsFunction = () => {
        const data = [];
        const numPage = 5;
        if (totalPage <= numPage) {
            for (let i = 1; i <= totalPage; i++) {
                data.push(
                    <Pagination.Item
                        key={i}
                        active={i === curr}
                        onClick={() => pageChangeFunction(i)}
                    >
                        {i}
                    </Pagination.Item>
                );
            }
        } else {
            const leftside = curr - numPage / 2 > 1;
            const rightside = curr + numPage / 2 < totalPage;
            data.push(
                <Pagination.First
                    key="first"
                    onClick={() => pageChangeFunction(1)}
                />
            );
            data.push(
                <Pagination.Prev
                    key="prev"
                    onClick={() => pageChangeFunction(curr - 1)}
                />
            );
            if (leftside) {
                data.push(<Pagination.Ellipsis key="leftEllipsis" />);
            }
            const str = Math.max(1, Math.round(curr - numPage / 2));
            const end = Math.min(totalPage, Math.round(curr + numPage / 2));
            for (let i = str; i <= end; i++) {
                data.push(
                    <Pagination.Item
                        key={i}
                        active={i === curr}
                        onClick={() => pageChangeFunction(i)}
                    >
                        {i}
                    </Pagination.Item>
                );
            }
            if (rightside) {
                data.push(<Pagination.Ellipsis key="rightEllipsis" />);
            }
            data.push(
                <Pagination.Next
                    key="next"
                    onClick={() => pageChangeFunction(curr + 1)}
                />
            );
            data.push(
                <Pagination.Last
                    key="last"
                    onClick={() => pageChangeFunction(totalPage)}
                />
            );
        }
        return data;
    };
    const onChange = (data) => {
        setFilterPayload({...filterPayload, row: data.row ? parseInt(data.row) : 5});
    }
    useEffect(() => {
        if(callEffect){
            (async()=>{
              setLoading(true);
              const { success, data, message } = await employeeList(filterPayload);
              if (!success) {
                  setAlertVariant("danger");
                  setAlertShow(true);
                  setAlertData(message);
                } else {
                    if (data.length) {
                        setData(data[0].list);
                        setTotalPage(parseInt(data[0].page.split(" ")[2]));
                    } else {
                        setData([]);
                        set_Curr(1);
                        setTotalPage(1);
                    }
                }
                setLoading(false);
            })()
            setRefresh(false);
        }
    }, [refresh, filterPayload])
    useEffect(()=>{
        setFilterPayload({
          ...filterPayload,
          page: curr
        })
    },[curr])
    useEffect(()=>{
        setFilterPayload({page: 1, row: 5, search: {}});
        setCallEffect(true)
    }, [])
  return (
    <>
        <div className='m-2 p-3 layoutContentCard' style={{background: "#FFFFFF", borderRadius: "15px"}}>
            <div className='content-flex'>
                <div>
                    <h3 className='navbarTitle'>Employee List</h3>
                    <p>Here're your all employees</p>
                </div>
                <div>
                    <Button className='w-100' onClick={()=>{handleModal(modalTypeEnum.add_employee)}}><PlusLg /> Add Employee</Button>
                </div>
            </div>
            <hr />
            <div>
                <header className='content-flex'>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <p>Show</p>
                        <Form className='px-2' onChange={handleSubmit(onChange)}>
                        <Form.Select {...register("row")}>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </Form.Select>
                        </Form>
                        <p>Entries</p>
                    </div>
                    <div>
                        <ButtonGroup>
                            <Button onClick={()=>handleModal(modalTypeEnum.search_filter)}><Sliders /> Filter</Button>
                            <Button onClick={()=>handleModal(modalTypeEnum.all_employee_increment)}><CashStack /> Increment</Button>
                        </ButtonGroup>
                    </div>
                </header>
                <div className='my-3 custom-table-container'>
                    <Table hover>
                        <thead>
                            <tr>
                                <th>Employee ID</th>
                                <th>Name</th>
                                <th>Mobile</th>
                                <th>Salary</th>
                                <th>Detail</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody style={{textAlign: "left"}}>
                        {loading ? <tr>
                        <td colSpan={6}>
                            <div className='text-center'>
                                <Spinner animation="border" role="status" variant="primary">
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                            </div>
                        </td>
                        </tr> : data.length > 0 ? data.map((data, index)=>{
                            return <tr key={data._id}>
                            <td>
                                {data.employeeId}
                            </td>
                            <td>
                                {
                                    (data?.name?.split(" ")?.length > 1) ? (data?.name.split(" ")[0]?.charAt(0)?.toUpperCase() + data?.name?.split(" ")[0]?.slice(1)?.toLowerCase() + " " + data?.name?.split(" ")[1]?.charAt(0)?.toUpperCase() + data?.name?.split(" ")[1]?.slice(1)?.toLowerCase()) : (data?.name?.charAt(0)?.toUpperCase() + data?.name?.slice(1)?.toLowerCase())
                                }
                            </td>
                            <td>
                                {data?.mobile}
                            </td>
                            <td style={{color: "#198754", fontWeight: "bold"}}>
    
                                <CurrencyDollar /> {parseFloat(data?.wageAmount?.["$numberDecimal"])
    .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td>
                                <InfoCircle className='hoverEffect' onClick={()=>{handleModal(modalTypeEnum.employee_detail, data)}}/>
                            </td>
                            <td>
                            <Dropdown>
                            <Dropdown.Toggle className='p-0 m-0'style={{backgroundColor: "transparent", borderColor: "transparent", color: "#000000"}}>
                                <ThreeDots className='hoverEffect'/>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Header>Action</Dropdown.Header>
                                <Dropdown.Item onClick={()=>handleModal(modalTypeEnum.edit_employee, data)}><PencilSquare color='#0d6efd' /> Edit</Dropdown.Item>
                                <Dropdown.Item onClick={()=>handleModal(modalTypeEnum.delete_data, data)}><Trash color='#dc3545'/> Delete</Dropdown.Item>
                                <Dropdown.Item onClick={()=>handleModal(modalTypeEnum.employee_increment, data)}><CashStack color='#198754'/> Increment</Dropdown.Item>
                            </Dropdown.Menu>
                            </Dropdown>
                            </td>
                            </tr>
                        }) : <tr>
                        <td colSpan={6}>
                            <div className='text-center'>
                                No data to display
                            </div>
                        </td>
                        </tr>}
                        </tbody>
                    </Table>
                </div>
                <footer className='d-flex justify-content-end'>
                    <Pagination className='mb-0'>{showPageItemsFunction()}</Pagination>
                    <AppModal />
                </footer>
            </div>
        </div>
    </>
  )
}

export default Employee