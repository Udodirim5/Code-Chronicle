import axios from "axios";
import { showAlert } from "./alert";

export const createItems = async (name, email, message, contactForm) => {
  try {
    const res = await axios.post(
      `${req.protocol}://${req.get("host")}/api/v1/contact-us`,
      {
        name,
        email,
        message,
      }
    );

    if (res.data.status === "success") {
      showAlert("success", "Message sent successfully!");
    }
  } catch (err) {
    console.error(err);
    showAlert("error", "Something went wrong. Please try again.");
  }
};
