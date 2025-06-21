import axios from 'axios';

const baseUrl = process.env.REACT_APP_API_URL;

export const attendaneSheetDownload = async(payload) => {
    try {
        const res = await axios.post(`${baseUrl}/salary/sheet`, payload, {
            headers: {
                authorization: localStorage.getItem("token")
            },
        });
        return {success: true, status: res.status, data: res.data.data , message: res.statusText}
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

export const workingYearList = async() => {
    try {
        const res = await axios.get(`${baseUrl}/misc/workinYear/list`, {
            headers: {
                authorization : localStorage.getItem("token")
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

export const salaryList = async(payload) => {
    try {
        const res = await axios.get(`${baseUrl}/salary/list`, {
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

export const reportDownload = async(payload) => {
    try {
        const res = await axios.get(`${baseUrl}/salary/${payload.id}/report/${payload.type}`, {
            headers: {
                authorization: localStorage.getItem("token")
            }
        });
        return {success: true, status: res.status, data: res.data , message: res.statusText}
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

export const deleteSalaryReport = async(payload) => {
    try {
        const res = await axios.put(`${baseUrl}/salary/${payload}/delete`, {}, {
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
