import axios from 'axios';
import { showAlert } from './alert';

// export const submitComment = async (data, type, method, action, postId) => {
//   try {
//     let url;
//     if (type === "comment") {
//       url: `/api/v1/posts/${postId}/comments`;
//     }
//     // else if( type === 'reply' ) {
//     //   url: `/api/v1/posts/${postId}/comments/${commentId}/replies`
//     // }
//     const res = await axios({
//       method: `${method}`, // "POST"
//       url,
//       data: {
//         data,
//       },
//     });

//     if (res.data.status === "success") {
//       showAlert("success", `${type.toUpperCase()} ${action}ed successfully!`);
//     }
//   } catch (err) {
//     showAlert("error", err.response.data.message);
//   }
// };



export const submitComment = async (content, name, postId) => {
  try {
    const url = `/api/v1/posts/${postId}/comments`;
    const res = await axios({
      method: 'POST',
      url,
      data: {
        content,
        name
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Comment submitted successfully!');
      return res.data.data.comment;
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    throw err;
  }
};

export const createCommentElement = (comment) => {
  const newComment = document.createElement('div');
  newComment.classList.add('comment-out');
  newComment.innerHTML = `
    <div class="comment-card">
      <div class="comment-img">C C</div>
      <div class="textBox">
        <div class="commentContent">
          <p class="commenter">${comment.name}</p>
          <span class="spanDate">${new Date(comment.createdAt).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <p class="comment-main">${comment.content}</p>
      </div>
    </div>`;
  return newComment;
};

export const appendCommentToContainer = (commentElement) => {
  const commentsContainer = document.querySelector('.commentsLists');
  commentsContainer.appendChild(commentElement);
};

export const clearCommentInput = () => {
  document.getElementById('comment-content').value = '';
  document.getElementById('commenter-name').value = '';
};

