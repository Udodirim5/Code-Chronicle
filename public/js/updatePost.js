/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alert";

export const updatePost = async (formData, postId) => {
  try {
    const response = await axios({
      method: "PATCH",
      url: `http://localhost:3000/api/v1/posts/${postId}`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 200) {
      showAlert("success", "Post updated successfully!");
      // Redirect to the post page or perform any other actions
      location.assign(`/admin/admin-posts`);
    }
  } catch (error) {
    console.error("Error updating the post:", error);
    showAlert("error", "An error occurred while updating the post.");
  }
};
