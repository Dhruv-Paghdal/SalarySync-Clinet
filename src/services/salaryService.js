import axios from "axios";

const baseUrl = process.env.REACT_APP_API_URL;

export const calculateSalary = async(payload, companyID) => {
    try {
        const res = await axios.post(`${baseUrl}/salary/${companyID}/calculate`, payload, {
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

export const addAdvanceSalary = async(payload) => {
    try {
        const res = await axios.post(`${baseUrl}/advance-salary/add`, payload, {
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

export const editAdvanceSalary = async(payload) => {
    try {
        const res = await axios.put(`${baseUrl}/advance-salary/${payload.advanveSalaryID}/edit`, payload, {
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

export const advanceSalaryList = async(payload) => {
    try {
        const res = await axios.get(`${baseUrl}/advance-salary/list`, {
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

export const deleteAdvanceSalary = async(payload) => {
    try {
        const res = await axios.put(`${baseUrl}/advance-salary/${payload}/delete`, {}, {
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