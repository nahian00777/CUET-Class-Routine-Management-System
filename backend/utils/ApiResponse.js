class ApiResponse {
  constructor(statuscode, data, message) {
    this.statuscode = statuscode;
    this.data = data;
    this.message = message;
    this.success = this.statuscode < 400;
  }
}

export { ApiResponse };

// const value = new ApiResponse(200, { name: "John Doe" }, "User found");
// console.log(value);
