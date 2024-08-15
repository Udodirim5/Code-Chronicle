import axios from "axios";
import { showAlert } from "./alert";
import { getBaseUrl } from "./baseUrl";

export const createItems = async (name, email, message, contactForm) => {
  try {
    const res = await axios.post(`${getBaseUrl()}/api/v1/contact-us`, {
      name,
      email,
      message,
    });

    if (res.data.status === "created") {
      showAlert("success", "Message sent successfully!");
    }
  } catch (err) {
    console.error(err);
    showAlert("error", "Something went wrong. Please try again.");
  }
};
