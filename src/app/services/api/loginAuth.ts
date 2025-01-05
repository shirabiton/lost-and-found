import axios from "axios";

export async function loginAuthenticationCookies(
  email: string,
  password: string
) {
  try {
    const response = await axios.post(
      "/api/sign/signIn",
      { email, password },
      { withCredentials: true }
    );

    // Check if the token and user are already in the response (user already logged in)
    if (response.data.token && response.data.user) {
      // Return the user data and token for later use
      return {
        token: response.data.token,
        user: response.data.user,
      };
    } else if (response.status === 200) {

      // If the user is already logged in, just return the user data
      return {
        token: response.data.token,
      };
    }
  } catch {
    throw new Error("Failed");
    return false;
  }
}
