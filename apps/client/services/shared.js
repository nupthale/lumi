const success = (data) => {
    return {
        code: 200,
        data: data,
        message: 'success'
    }
}

const fail = (message) => {
    return {
        code: 500,
        data: null,
        message: message
    }
}

module.exports = {
    success,
    fail
};