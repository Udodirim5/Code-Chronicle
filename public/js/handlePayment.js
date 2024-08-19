/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alert";
import { getBaseUrl } from "./baseUrl";

export const handlePaymentCallback = async (
  data,
  itemId,
  name,
  email,
  amount
) => {
  const reference = data.tx_ref;

  try {
    const response = await axios.post(
      `${getBaseUrl()}/api/v1/purchases/create-purchase`,
      // `${getBaseUrl()}/api/v1/purchases/webhook`,
      {
        item: itemId,
        buyerName: name,
        buyerEmail: email,
        price: amount,
        paid: true,
      }
    );

    const result = response.data;
    if (result.status === "success") {
      const purchaseId = response.data.data.purchaseId;
      console.log(purchaseId);
      showAlert("success", "Payment complete! Reference: " + reference);
      window.location.href = `/redirect/`;
    } else {
      showAlert("error", "Error processing payment. Please try again.");
    }
  } catch (error) {
    showAlert("error", "Error processing payment. Please try again.");
  }
};
