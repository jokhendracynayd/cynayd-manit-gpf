class ApiResponse {
  constructor(statusCode, data, message="success",show){
      this.statusCode = statusCode
      this.data = data
      this.msg = message
      this.success = statusCode < 400
      this.show = show || false
  }
}

export default ApiResponse;