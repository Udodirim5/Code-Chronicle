/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alert";
import { getBaseUrl } from "./baseUrl";

export const createPost = async (
  title,
  content,
  excerpt,
  tags,
  category,
  photo,
  author,
  published
) => {
  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('excerpt', excerpt);
    formData.append('tags', tags);
    formData.append('category', category);
    formData.append('photo', photo);
    formData.append('author', author);
    formData.append('published', published);

    for (let pair of formData.entries()) {
    }

    const res = await axios({
      method: "POST",
      url: `${getBaseUrl()}/api/v1/posts/submit-post`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (res.data.status === "success") {
      showAlert("success", "Post created successfully!");
      window.setTimeout(() => {
        location.assign("/admin/admin-posts");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
