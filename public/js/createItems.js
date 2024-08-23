import axios from "axios";
import { showAlert } from "./alert";
import { getBaseUrl } from "./baseUrl";

export const createContactUs = async (name, email, message, contactForm) => {
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
    showAlert("error", "Something went wrong. Please try again.");
  }
};

export const createItem = async (formData) => {
  try {
    const res = await axios.post(`${getBaseUrl()}/api/v1/items`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (res.data.status === "created") {
      showAlert("success", "Item created successfully!");
    }
  } catch (err) {
    showAlert("error", "Something went wrong. Please try again.");
  }
};

export const addCategory = async (data) => {
  try {
    const res = await axios.post(`${getBaseUrl()}/api/v1/categories`, data);

    if (res.data.status === "created") {
      showAlert("success", "Category added successfully!");
    } else {
      showAlert("error", "Failed to add the category.");
    }
  } catch (err) {
    showAlert("error", "Something went wrong. Please try again.");
  }
};
