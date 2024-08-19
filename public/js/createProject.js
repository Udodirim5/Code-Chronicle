// Import statements
import axios from "axios";
import { showAlert } from "./alert";
import { getBaseUrl } from "./baseUrl";

// Add Project Function
export const addProject = async (formData) => {
  try {
    const res = await axios.post(`${getBaseUrl()}/api/v1/projects`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Project created successfully!");
      window.setTimeout(() => {
        location.assign("/admin/myWork");
      }, 1500);
    } else {
      showAlert("error", "Unexpected status:", res.data.status);
    }
  } catch (err) {
    showAlert("error", "Something went wrong. Please try again.");
  }
};
