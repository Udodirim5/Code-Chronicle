/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alert";
import { getBaseUrl } from "./baseUrl";

export const createReview = async (data, purchaseSecret) => {
  try {
    const response = await axios.post(
      `${getBaseUrl()}/api/v1/reviews?secret=${purchaseSecret}`,
      data
    );
    if (response.data.status === "success") {
      showAlert("success", "Review submitted successfully!");
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

