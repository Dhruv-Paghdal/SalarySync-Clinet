import axios from 'axios';

const baseUrl = process.env.REACT_APP_API_URL;

export const login = async(payload) => {
    try {
        const res = await axios.post(`${baseUrl}/index/login`, payload);
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

export const forgotPassword = async(payload) => {
    try {
        const res = await axios.post(`${baseUrl}/index/password/forgot`, payload);
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

export const resetPassword = async(payload) => {
    try {
        const res = await axios.post(`${baseUrl}/index/password/reset`, payload);
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

export const otpVerify = async(payload) => {
    try {
        const res = await axios.post(`${baseUrl}/index/password/otp/verify`, payload);
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

export const companyId = async() => {
    try {
        const res = await axios.get(`${baseUrl}/misc/company/id`, {
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