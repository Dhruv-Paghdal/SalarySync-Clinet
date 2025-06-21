import React,{useState, useContext, useEffect} from 'react';
import { useForm } from "react-hook-form";
import Button from 'react-bootstrap/Button';
import AppModal from './modal';
import Form from 'react-bootstrap/Form';
import {PlusLg, PencilSquare, Sliders, CurrencyDollar, ThreeDots, Trash} from 'react-bootstrap-icons';
import Pagination from 'react-bootstrap/Pagination';
import Table from 'react-bootstrap/Table';
import moment from 'moment';
import PayrollContext from '../context/payrollContext';
import Dropdown from 'react-bootstrap/Dropdown';
import { modalTypeEnum, deleteTypeEnum } from '../constValue';
import { loanList } from '../services/loanService';
import Spinner from 'react-bootstrap/esm/Spinner';
import './css/salary.css';

const Loan = () => {
    const context = useContext(PayrollContext);
    const { setModalShow, setModalType, setModalData, setAlertData, setAlertShow, setAlertVariant, filterPayload, setFilterPayload, refresh, setRefresh, setDeleteType} = context;
    const [loanListData, setLoanListData] = useState([])
    const { register, handleSubmit} = useForm();
    const [callEffect, setCallEffect] = useState(false);
    const [loading, setLoading] = useState(true);
    const [curr, set_Curr] = useState(1);  
    const [totalPage, setTotalPage] = useState(1);  
    const handleModal = (type, data) => {
      if(type === modalTypeEnum.edit_loan) {
        setModalData([data])
      }
      if(type === modalTypeEnum.delete_data) {
        setDeleteType(deleteTypeEnum.loan);
        setModalData({
            employeeId: data.employeeDetail[0].employeeId,
            date: moment.utc(data.date).format("DD-MM-YYYY"),
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
              const { success, status, data, message} = await loanList(filterPayload);
              if (!success) {
                setAlertVariant("danger");
                setAlertShow(true);
                setAlertData(message);
              } else {
                if (data.length) {
                  setLoanListData(data[0].list);
                  setTotalPage(parseInt(data[0].page.split(" ")[2]));
                } else {
                  setLoanListData([]);
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
            <div>
                <div className='content-flex'>
                    <div>
                        <h3 className='navbarTitle'>Loan</h3>
                        <p>Manage loan of employees</p>
                    </div>
                    <div>
                        <Button className='w-100' onClick={()=>{handleModal(modalTypeEnum.loan)}}><PlusLg /> Add loan</Button>
                    </div>
                </div>
                <hr />
                <div>
                    <header className='content-flex mt-3'>
                        <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
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
                            <Button onClick={()=>handleModal(modalTypeEnum.date_search_filter)}><Sliders /> Filter</Button>
                        </div>
                    </header>
                    <div className='my-3 custom-table-container'>
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Employee ID</th>
                                    <th>Date</th>
                                    <th>Amount</th>
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
                            </tr> : loanListData?.length > 0 ? loanListData.map((ele)=>{
                                        return <tr key={ele._id}>
                                            <td>{(ele?.employeeDetail[0]?.name?.split(" ")?.length > 1) ? (ele?.employeeDetail[0]?.name?.split(" ")[0]?.charAt(0)?.toUpperCase() + ele?.employeeDetail[0]?.name?.split(" ")[0]?.slice(1)?.toLowerCase() + " " + ele?.employeeDetail[0]?.name?.split(" ")[1]?.charAt(0)?.toUpperCase() + ele?.employeeDetail[0]?.name?.split(" ")[1]?.slice(1)?.toLowerCase()) : (ele?.employeeDetail[0]?.name?.charAt(0)?.toUpperCase() + ele?.employeeDetail[0]?.name?.slice(1)?.toLowerCase())}</td>
                                            <td>{ele?.employeeDetail[0]?.employeeId}</td>
                                            <td>{moment.utc(ele?.date).format("DD-MM-YYYY")}</td>
                                            <td style={{color: "#198754", fontWeight: "bold"}}><CurrencyDollar /> {parseFloat(ele?.amount?.["$numberDecimal"])
    .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                            <td>
                                                <Dropdown>
                                                <Dropdown.Toggle className='p-0 m-0'style={{backgroundColor: "transparent", borderColor: "transparent", color: "#000000"}}>
                                                    <ThreeDots className='hoverEffect'/>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Header>Action</Dropdown.Header>
                                                    <Dropdown.Item onClick={()=>{handleModal(modalTypeEnum.edit_loan, ele)}}><PencilSquare color='#0d6efd'/> Edit</Dropdown.Item>
                                                    <Dropdown.Item onClick={()=>{handleModal(modalTypeEnum.delete_data, ele)}}><Trash color='#dc3545'/> Delete</Dropdown.Item>
                                                </Dropdown.Menu>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    }) :
                                    <tr>
                                    <td colSpan={5}>
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
                    </footer>
                </div>
            </div>
            <AppModal />
        </div>
    </>
  )
}

export default Loan;