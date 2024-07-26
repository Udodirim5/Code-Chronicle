import axios from "axios";
import { showAlert } from "./alert";

export const addProject = async ({
  title,
  description,
  liveUrl,
  githubUrl,
  technologies,
  desktopImg,
  mobileImg,
}) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://localhost:3000/api/v1/projects",
      data: {
        title,
        description,
        liveUrl,
        githubUrl,
        technologies,
        desktopImg,
        mobileImg,
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Project created successfully!");
      window.setTimeout(() => {
        location.assign("/admin/myWork");
      }, 1500);
    }
  } catch (err) {
    const errorMsg =
      err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : "Something went wrong. Please try again.";
    showAlert("error", errorMsg);
  }
};
