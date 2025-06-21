import axios from 'axios';

const baseUrl = process.env.REACT_APP_API_URL;

export const allEmployeeList = async() => {
    try {
        const res = await axios.get(`${baseUrl}/misc/employee/list`, {
            headers: {
                authorization: localStorage.getItem("token")
            },
        });
        return {success: true, status: res.data.status, data: res.data.data , message: res.data.message}        
    } catch (error) {
        if (!error.response) {
            return {success: false, status: 503, message: 'Error: Network Error', data: ""}
        } else {
            let message = ""
            const errMsg = typeof(error.response.data.message) == "object" ? (()=>{
                for (const msg of error.response.data.message) {    
                    message += `${msg.msg}, `
                }
                return message;
            })() : error.response.data.message;
            return {success: false, status: error.response.data.status, message:errMsg, data: ""}
        }
    }
}

export const employeeList = async(payload) => {
    try {
        const res = await axios.get(`${baseUrl}/employee/list`, {
            headers: {
                authorization: localStorage.getItem("token")
            },
            params: payload
        });
        return {success: true, status: res.data.status, data: res.data.data , message: res.data.message}        
    } catch (error) {
        if (!error.response) {
            return {success: false, status: 503, message: 'Error: Network Error', data: ""}
        } else {
            let message = ""
            const errMsg = typeof(error.response.data.message) == "object" ? (()=>{
                for (const msg of error.response.data.message) {    
                    message += `${msg.msg}, `
                }
                return message;
            })() : error.response.data.message;
            return {success: false, status: error.response.data.status, message:errMsg, data: ""}
        }
    }
}

export const addEmployee = async(payload) => {
    try {
        const res = await axios.post(`${baseUrl}/employee/add`, payload, {
            headers: {
                authorization: localStorage.getItem("token")
            },
        });
        return {success: true, status: res.data.status, data: res.data.data , message: res.data.message}
    } catch (error) {
        if (!error.response) {
            return {success: false, status: 503, message: 'Error: Network Error', data: ""}
        } else {
            let message = ""
            const errMsg = typeof(error.response.data.message) == "object" ? (()=>{
                for (const msg of error.response.data.message) {    
                    message += `${msg.msg}, `
                }
                return message;
            })() : error.response.data.message;
            return {success: false, status: error.response.data.status, message:errMsg, data: ""}
        }
    }
}

export const editEmployee = async(payload) => {
    try {
        const res = await axios.put(`${baseUrl}/employee/${payload.id}/edit`, payload, {
            headers: {
                authorization: localStorage.getItem("token")
            }
        });
        return {success: true, status: res.data.status, data: res.data.data , message: res.data.message}
    } catch (error) {
        if (!error.response) {
            return {success: false, status: 503, message: 'Error: Network Error', data: ""}
        } else {
            let message = ""
            const errMsg = typeof(error.response.data.message) == "object" ? (()=>{
                for (const msg of error.response.data.message) {    
                    message += `${msg.msg}, `
                }
                return message;
            })() : error.response.data.message;
            return {success: false, status: error.response.data.status, message:errMsg, data: ""}
        }
    }
}

export const deleteEmployee = async(payload) => {
    try {
        const res = await axios.put(`${baseUrl}/employee/${payload}/delete`, {}, {
            headers: {
                authorization: localStorage.getItem("token")
            }
        });
        return {success: true, status: res.data.status, data: res.data.data , message: res.data.message}
    } catch (error) {
        if (!error.response) {
            return {success: false, status: 503, message: 'Error: Network Error', data: ""}
        } else {
            let message = ""
            const errMsg = typeof(error.response.data.message) == "object" ? (()=>{
                for (const msg of error.response.data.message) {    
                    message += `${msg.msg}, `
                }
                return message;
            })() : error.response.data.message;
            return {success: false, status: error.response.data.status, message:errMsg, data: ""}
        }
    }
}

export const allEmployeeIncrement = async(payload) => {
    try {
        const res = await axios.post(`${baseUrl}/employee/appraisal/all`, payload, {
            headers: {
                authorization: localStorage.getItem("token")
            }
        });
        return {success: true, status: res.data.status, data: res.data.data , message: res.data.message}
    } catch (error) {
        if (!error.response) {
            return {success: false, status: 503, message: 'Error: Network Error', data: ""}
        } else {
            let message = ""
            const errMsg = typeof(error.response.data.message) == "object" ? (()=>{
                for (const msg of error.response.data.message) {    
                    message += `${msg.msg}, `
                }
                return message;
            })() : error.response.data.message;
            return {success: false, status: error.response.data.status, message:errMsg, data: ""}
        }
    }
}

export const employeeIncrement = async(payload) => {
    try {
        const res = await axios.put(`${baseUrl}/employee/${payload.id}/appraisal`, payload, {
            headers: {
                authorization: localStorage.getItem("token")
            }
        });
        return {success: true, status: res.data.status, data: res.data.data , message: res.data.message}
    } catch (error) {
        if (!error.response) {
            return {success: false, status: 503, message: 'Error: Network Error', data: ""}
        } else {
            let message = ""
            const errMsg = typeof(error.response.data.message) == "object" ? (()=>{
                for (const msg of error.response.data.message) {    
                    message += `${msg.msg}, `
                }
                return message;
            })() : error.response.data.message;
            return {success: false, status: error.response.data.status, message:errMsg, data: ""}
        }
    }
}