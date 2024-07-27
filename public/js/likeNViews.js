import { showAlert } from "./alert";

document.addEventListener('DOMContentLoaded', () => {
  const likeButtons = document.querySelectorAll('.like-btn');
  const dislikeButtons = document.querySelectorAll('.dislike-btn');

  const handleResponse = async (url, method) => {
    try {
      const response = await fetch(url, { method });
      const data = await response.json();
      if (data.status === 'success') {
        location.reload(); // Reload the page to show updated likes/dislikes
      } else {
        showAlert("error", 'Something went wrong!');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  likeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const postId = button.getAttribute('data-id');
      handleResponse(`/api/v1/posts/${postId}/like`, 'POST');
    });
  });

  dislikeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const postId = button.getAttribute('data-id');
      handleResponse(`/api/v1/posts/${postId}/dislike`, 'POST');
    });
  });
});