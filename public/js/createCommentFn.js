/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alert";
import { getBaseUrl } from "./baseUrl";

export const createComment = async (postId, name, email, comment) => {
  try {
    const response = await axios.post(`${getBaseUrl()}/api/v1/comments`, {
      post: postId,
      name,
      email,
      comment,
    });

    if (response.data.status === "created") {
      showAlert("success", "Comment submitted successfully!");
      location.reload(); // Reload the page to show the new comment
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
