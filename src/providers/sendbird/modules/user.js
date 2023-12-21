import SendbirdAPIHandler from "./api.js";

class SendbirdUserHandler extends SendbirdAPIHandler {
  async getUsers() {
    try {
      const response = await this.request.get(`/users`);
      return response.data;
    } catch (error) {
      console.error("Error getting users:", error.response.data);
      throw error;
    }
  }

  async createUser(userParams) {
    try {
      const response = await this.request.post(`/users`, userParams);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error.response.data);
      throw error;
    }
  }

  // Add more user-specific methods as needed
}

export default SendbirdUserHandler;
