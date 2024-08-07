/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alert";
import { getBaseUrl } from "./baseUrl";

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: `${getBaseUrl()}/api/v1/users/login`,
      data: {
        email,
        password,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Login successful");

      window.setTimeout(() => {
        location.assign("/express-admin");
      }, 1000);
    } else {
      showAlert("error", "Unexpected response from the server");
    }
  } catch (err) {
    showAlert(
      "error",
      err.response ? err.response.data.message : "Error logging in"
    );
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: `${getBaseUrl()}/api/v1/users/logout`,
    });
    if (res.data.status === "success") {
      location.assign("/login");
    }
  } catch (err) {
    showAlert("error", "Error logging out! Try again.");
  }
};

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: "POST",
      url: `${getBaseUrl()}/api/v1/users/signup`,
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });
    if (res.data.status === "success") {
      window.setTimeout(() => {
        location.assign("/express-admin");
      }, 1000);
    }

    showAlert("success", "Sign up successful:");
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
