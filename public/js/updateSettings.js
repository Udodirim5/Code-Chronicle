/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alert";

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    let url;
    if (type === "password") {
      url = "/api/v1/users/updateMyPassword";
    } else if (type === "data") {
      url = "/api/v1/users/updateMe";
    } else if (type === "socials") {
      url = `${req.protocol}://${req.get('host')}/api/v1/socials/update-socials`;
    }
    const res = await axios({
      method: "PATCH",
      url,
      data,
    });

    if (res.data.status === "success") {
      showAlert("success", `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const forgotPassword = async (data, type) => {
  try {
    let url;
    if (type === "forgot") {
      url = `${req.protocol}://${req.get('host')}/api/v1/users/forgotPassword`;
    } 
    const res = await axios({
      method: "POST",
      url,
      data,
    });

    if (res.data.status === "success") {
      showAlert("success", `Password reset link sent to your email!`);
    }
  } catch (err) {
    showAlert("error", 'Error sending password reset link');
  }
};
