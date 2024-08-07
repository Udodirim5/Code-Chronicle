import axios from "axios";
import { showAlert } from "./alert";
import { getBaseUrl } from "./baseUrl";

export const createComment = async (postId, name, comment) => {
  try {
    const res = await axios.post(`${getBaseUrl()}/api/v1/posts/${postId}/comments`, {
      post: postId,
      name,
      comment,
    });

    if (res.data.status === "success") {
      showAlert("success", "Comment sent successfully!");

      const newComment = res.data.data.comment;

      // Display the new comment on the page
      const commentList = document.querySelector('.commentsLists .comment-out');
      const newCommentHTML = `
        <div class="comment-card">
          <div class="comment-img">${newComment.name[0]}</div>
          <div class="textBox">
            <div class="commentContent">
              <p class="commenter">${newComment.name}</p>
              <span class="spanDate">${new Date(newComment.createdAt).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <p class="comment-main">${newComment.comment}</p>
          </div>
        </div>
      `;
      commentList.insertAdjacentHTML('beforeend', newCommentHTML);
    }
  } catch (err) {
    console.error(err);
    showAlert("error", "Something went wrong. Please try again.");
  }
};
