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
      url = "/api/v1/socials/update-socials";
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
