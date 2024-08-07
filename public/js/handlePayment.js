/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alert";

export const handlePaymentCallback = async (data, itemId, name, email, amount, getBaseUrl) => {
  const reference = data.tx_ref;
  console.log("Payment complete! Reference:", reference);
  console.log(itemId);
  console.log(name);
  console.log(email);
  console.log(amount);
  console.log(getBaseUrl);

  try {
    console.log("Sending POST request to backend...");
    const response = await axios.post(`${getBaseUrl}/api/v1/purchases/create-purchase`, {
      item: itemId,
      buyerName: name,
      buyerEmail: email,
      price: amount,
      paid: true,
    });

    const result = response.data;
    if (result.status === "success") {
      showAlert("success", "Payment complete! Reference: " + reference);
      window.location.href = `${getBaseUrl}/payment-success?tx_ref=${reference}`;
    } else {
      showAlert("error", "Error processing payment. Please try again.");
    }
  } catch (error) {
    console.error("Error sending POST request to backend:", error);
    showAlert("error", "Error processing payment. Please try again.");
  }
};
