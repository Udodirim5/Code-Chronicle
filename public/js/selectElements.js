// export const selectElements = (elements) => {
//   const selectedElements = {};

//   for (const [key, selector] of Object.entries(elements)) {
//     selectedElements[key] =
//       document.querySelector(selector) || document.querySelectorAll(selector);
//   }

//   return selectedElements;
// };

// const elements = selectElements({
//   sidebar: ".sidebar",
//   editPost: "#editPost",
//   logoutBtn: ".logoutBtn",
//   loginForm: "#form--login",
//   signupForm: "#signUpForm",
//   contactForm: ".contact-form",
//   commentForm: "#comment-form",
//   createPostForm: "#createPost",
//   userDataForm: ".form-user-data",
//   deleteButtons: ".delete-btn",
//   submitReviews: "#submit-review",
//   updateSocialForm: ".updateSocial",
//   itemPurchaseForm: "#purchase-form",
//   createProjectForm: "#createProject",
//   updatePasswordForm: ".form-user-password",
// });

// // USAGE: 
// // elements.editPost