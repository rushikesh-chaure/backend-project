class ApiError extends Error {
    constructor(
        statusCode,
        message="Something went wrong",
        error=[],
        stack = "",
    ){
        super(message)
        this.statusCode = statusCode
        this.dat = null
        this.errors = error
        this.success = false
        this.message = message

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}