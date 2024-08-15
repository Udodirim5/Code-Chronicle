/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alert";
import { getBaseUrl } from "./baseUrl";

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    let url;
    if (type === "password") {
      url = `${getBaseUrl()}/api/v1/users/updateMyPassword`;
    } else if (type === "data") {
      url = `${getBaseUrl()}/api/v1/users/updateMe`;
    } else if (type === "socials") {
      url = `${getBaseUrl()}/api/v1/socials/update-socials`;
    }
    const res = await axios({
      method: "PATCH",
      url,
      data,
    });

    if (res.data.status === "success") {
      showAlert("success", `${type.toUpperCase()} updated successfully!`);
      location.reload();
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
