class apiError extends Error{
    constructor(
        statusCOde,
        message = "Something went wrong",
        errors = [],
        stack = ""
    )
    {
        super(message)
        this.statusCode = statusCOde
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors
        
        if(stack){
            this.stack = stack 
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export default apiError