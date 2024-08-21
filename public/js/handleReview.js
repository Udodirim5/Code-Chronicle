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
    if (response.data.status === "created") {
      showAlert("success", "Review submitted successfully!");
      location.reload();
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const verifyEmailFn = async (email, itemId) => {
  try {
    const response = await axios.post(
      `${getBaseUrl()}/api/v1/purchases/verify-email`,
      {
        email,
        itemId,
      }
    );

    if (response.data.status === "success") {
      const token = response.data.data.token;
      // Redirect user to the download page with the purchase token
      window.location.href = `/payment-success/${token}`;
    } else {
      // Handle the case where no purchase was found
      showAlert("error", "No purchase found with that email for this item.");
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 400) {
        showAlert(
          "error",
          "The token is invalid or has expired. Please request a new one."
        );
      } else {
        showAlert("error", "Something went wrong.");
      }
    } else {
      showAlert("error", "An unexpected error occurred. Please try again.");
    }
    showAlert("error", "Error verifying email:");
  }
};
