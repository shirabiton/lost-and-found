import axios from "axios";
export async function signupAuthenticationCookies(
  email: string,
  phone: string,
  fullName: string,
  password: string
) {
  try {
    const response = await axios.post(
      "/api/sign/signUp",
      {
        email,
        password,
        fullName,
        phone,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response && response.data && response.data.token) {
      return response;
    }
  } catch {
    throw new Error("Error in signupAuthenticationCookies");
  }
}
