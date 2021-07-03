const errorMessages = {
    RECORD_NOT_FOUND: {
        message: 'Record not found',
        code: 4041
    },
    ROUTE_NOT_FOUND: {
        message: 'Route not found',
        code: 4042
    },
    LOGIN_ALREADY_EXIST: {
        message: 'Login already exist',
        code: 4090
    },
    EMAIL_ALREADY_EXIST: {
        message: 'Email already exist',
        code: 4091
    },
    WRONG_EMAIL_OR_PASSWORD: {
        message: 'Email or password is wrong',
        code: 4001
    },
    BAD_REQUEST_BODY: {
        message: 'Body has not allowed key',
        code: 4000
    },
    UNAUTHORIZED: {
        message: 'Yor are not authorized',
        code: 4010
    }
}

module.exports = errorMessages;