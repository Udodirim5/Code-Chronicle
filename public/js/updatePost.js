/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alert";
import { getBaseUrl } from "./baseUrl";

export const updatePost = async (
  title,
  content,
  excerpt,
  tags,
  category,
  photo,
  postId
) => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("excerpt", excerpt);
    formData.append("tags", tags);
    formData.append("category", category);
    formData.append("photo", photo);

    for (let pair of formData.entries()) {
    }

    const res = await axios({
      method: "PATCH",
      url: `${getBaseUrl()}/api/v1/posts/${postId}`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Post updated successfully!");
      window.setTimeout(() => {
        location.assign("/admin/admin-posts");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

// export const updatePost = async (formData, postId) => {
//   try {
//     const response = await axios({
//       method: "PATCH",
//       url: `${getBaseUrl()}/api/v1/posts/${postId}`,
//       data: formData,
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });

// if (response.status === 200) {
//   showAlert("success", "Post updated successfully!");
//   // Redirect to the post page or perform any other actions
//   location.assign(`/admin/admin-posts`);
// }
//   } catch (error) {
//     showAlert("error", "An error occurred while updating the post.");
//   }
// };
