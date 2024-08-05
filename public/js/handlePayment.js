/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alert";

export const handlePayment = async (name, email) => {
  try {
    const res = await axios.post(
      `${req.protocol}://${req.get(
        "host"
      )}/api/v1/purchases/checkout-session/${itemId}`,
      {
        name,
        email,
      }
    );

    if (res.data.status === "success") {
      showAlert("success", "Ready to process the payment.");
      // Redirect to the checkout session link
      window.location.href = res.data.session.link;
    }
  } catch (err) {
    console.error(err);
    showAlert("error", "Error processing payment. Please try again.");
  }
};
