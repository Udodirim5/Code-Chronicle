/* eslint-disable */
import "@babel/polyfill";
import { showAlert } from "./alert";
import { getBaseUrl } from "./baseUrl";
import { createPost } from "./createPost";
import { createItems } from "./createItems";
import { updatePost } from "./updatePost.js";
import { deleteItem } from "./handleDeletes";
import { addProject } from "./createProject";
import { login, logout, signup } from "./login";
import { formatNumber } from "./formatNumber.js";
import { createComment } from "./createCommentFn";
import { updateSettings } from "./updateSettings";
import { fetchTrafficData } from "./fetchTrafficData.js";
import { handlePaymentCallback } from "./handlePayment.js";
import { createReview, verifyEmailFn } from "./handleReview";

// DOM ELEMENTS
const editPost = document.querySelector("#editPost");
const logoutBtn = document.querySelector(".logoutBtn");
const loginForm = document.querySelector("#form--login");
const signupForm = document.querySelector("#signUpForm");
const contactForm = document.querySelector(".contact-form");
const commentForm = document.getElementById("comment-form");
const createPostForm = document.querySelector("#createPost");
const userDataForm = document.querySelector(".form-user-data");
const updateSocialForm = document.querySelector(".updateSocial");
const createProjectForm = document.querySelector("#createProject");
const updatePasswordForm = document.querySelector(".form-user-password");

document.addEventListener("DOMContentLoaded", async () => {
  if (loginForm) {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
      sidebar.style.display = "none";
    }

    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      login(email, password);
    });
  }

  if (signupForm) {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
      sidebar.style.display = "none";
    }

    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("sg-name").value;
      const email = document.getElementById("sg-email").value;
      const password = document.getElementById("sg-password").value;
      const passwordConfirm = document.getElementById("sg-passwordConfirm")
        .value;
      signup(name, email, password, passwordConfirm);
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
    });
  }

  if (createPostForm) {
    createPostForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("new-post-title").value;
      const content = document.getElementById("new-post-content").value;
      const excerpt = document.getElementById("excerpt").value;
      const tags = document.getElementById("tags").value.split(",");
      const category = document.getElementById("categories").value;
      const newPostImg = document.getElementById("new-post-img").files[0];

      createPost(
        title,
        content,
        excerpt,
        tags,
        category,
        newPostImg,
        "author", // You can replace 'author' with the actual author value
        true // Replace with the actual published value if needed
      );
    });
  }

  if (userDataForm) {
    userDataForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const form = new FormData();
      form.append("name", document.getElementById("name").value);
      form.append("email", document.getElementById("email").value);
      form.append("bio", document.getElementById("bio").value);
      form.append("photo", document.getElementById("forImg").files[0]);
      updateSettings(form, "data");
    });
  }

  if (updateSocialForm) {
    updateSocialForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const form = new FormData();
      form.append("twitter", document.getElementById("twitter").value);
      form.append("facebook", document.getElementById("facebook").value);
      form.append("linkedin", document.getElementById("linkedin").value);
      form.append("github", document.getElementById("github").value);
      form.append("youtube", document.getElementById("youtube").value);
      form.append("instagram", document.getElementById("instagram").value);
      form.append("telegram", document.getElementById("telegram").value);
      form.append("whatsapp", document.getElementById("whatsapp").value);
      updateSettings(form, "socials");
    });
  }

  if (updatePasswordForm) {
    updatePasswordForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      document.querySelector("#save-password").textContent = "Updating...";

      const passwordCurrent = document.getElementById("passwordCurrent").value;
      const password = document.getElementById("password").value;
      const passwordConfirm = document.getElementById("passwordConfirm").value;
      await updateSettings(
        { passwordCurrent, password, passwordConfirm },
        "password"
      );

      document.querySelector("#save-password").textContent = "Update";
      document.getElementById("passwordCurrent").value = "";
      document.getElementById("password").value = "";
      document.getElementById("passwordConfirm").value = "";
    });
  }

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const message = document.getElementById("message").value;

      await createItems(name, email, message, contactForm);
      contactForm.reset(); // Reset form after successful submission
    });
  }

  // Event listener for delete buttons
  const deleteButtons = document.querySelectorAll(".delete-btn");

  if (deleteButtons) {
    deleteButtons.forEach((button) => {
      button.addEventListener("click", function(e) {
        e.preventDefault();
        const id = this.getAttribute("data-id");
        const type = this.getAttribute("data-type"); // Get the type from data attribute
        if (confirm(`Are you sure you want to delete this ${type}?`)) {
          deleteItem(type, id);
        }
      });
    });
  }

  if (commentForm) {
    commentForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const form = e.target;
      const postId = form.getAttribute("data-post-id");
      const name = form.querySelector("#commenter-name").value;
      const email = form.querySelector("#email").value;
      const comment = form.querySelector("#comment").value;

      await createComment(postId, name, email, comment);
    });
  }

  // Fetch Traffic Data
  const { dailyCount, monthlyCount, allTimeCount } = await fetchTrafficData();

  document.getElementById("dailyCount").innerText = formatNumber(dailyCount);
  document.getElementById("monthlyCount").innerText = formatNumber(
    monthlyCount
  );
  document.getElementById("allTimeCount").innerText = formatNumber(
    allTimeCount
  );

  // Optionally, you can update the detailed spans as well
  document.getElementById("daily").querySelector("span").innerText = dailyCount;
  document
    .getElementById("monthly")
    .querySelector("span").innerText = monthlyCount;
  document
    .getElementById("allTime")
    .querySelector("span").innerText = allTimeCount;

  // FIXME: editPost Not working
  if (editPost) {
    const tagsInput = document.querySelector("#tags");
    editPost.addEventListener("submit", async (e) => {
      e.preventDefault();
      let tags = tagsInput.value;
      tags = tags.replace(/[\[\]"]+/g, "");
      tagsInput.value = tags;

      const postId = editPost.getAttribute("data-post-id");

      const form = new FormData();
      form.append("title", document.getElementById("new-post-title").value);
      form.append("content", document.getElementById("new-post-content").value);
      form.append("excerpt", document.getElementById("excerpt").value);
      form.append("tags", document.getElementById("tags").value);
      form.append("category", document.getElementById("categories").value);
      if (document.getElementById("new-post-img").files[0]) {
        form.append("photo", document.getElementById("new-post-img").files[0]);
      }

      await updatePost(form, postId);
    });
  }

  // FIXME: createProjectForm Not working
  if (createProjectForm) {
    createProjectForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Extract form data
      const title = document.querySelector("#new-project-title").value;
      const description = document.querySelector("#description").value;
      const liveUrl = document.querySelector("#live-url").value;
      const githubUrl = document.querySelector("#github-url").value;
      const technologies = Array.from(
        document.querySelectorAll('input[name="technologies"]:checked')
      ).map((el) => el.value);

      const desktopImg = document.querySelector("#desktop-img").files[0];
      const mobileImg = document.querySelector("#mobile-img").files[0];

      // Create FormData object
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("liveUrl", liveUrl);
      formData.append("githubUrl", githubUrl);
      formData.append("technologies", JSON.stringify(technologies)); // Correctly format technologies
      formData.append("desktopImg", desktopImg);
      formData.append("mobileImg", mobileImg);

      // Call the addProject function
      await addProject(formData);
    });
  }
});

document.addEventListener("DOMContentLoaded", function() {
  const itemPurchaseForm = document.querySelector("#purchase-form");
  // const getBaseUrl = `${window.location.protocol}//${window.location.host}`;

  if (itemPurchaseForm) {
    itemPurchaseForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const name = document.getElementById("name").value;
      const itemId = itemPurchaseForm.dataset.itemId;
      const price = itemPurchaseForm.dataset.price; // Accessing the price

      try {
        // Initiate Flutter wave checkout
        FlutterwaveCheckout({
          public_key: "FLWPUBK_TEST-b3755023095a7d59d52636b219e61c79-X",
          tx_ref: "AK_" + Math.floor(Math.random() * 1000000000 + 1),
          amount: price,
          currency: "USD",
          payment_options: "card",
          customer: {
            email: email,
            name: name,
          },
          callback: (data) =>
            handlePaymentCallback(data, itemId, name, email, price),
          customizations: {
            title: "Dev Memoirs",
            description: "FlutterWave Integration in Javascript.",
            // logo: "flutterwave/usecover.gif",
          },
        });
      } catch (error) {
        console.error("Error initiating payment:", error);
      }
    });
  }
});

const submitReviews = document.querySelector("#submit-review");
if (submitReviews) {
  submitReviews.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = event.target;
    const itemId = form.getAttribute("data-item-id");
    const rating = form.querySelector('input[name="rating"]:checked').value;
    const reviewTitle = form.querySelector("#review-title").value;
    const reviewContent = form.querySelector("textarea").value;
    const purchaseSecret = form.getAttribute("data-purchase-secret");

    const data = {
      title: reviewTitle,
      review: reviewContent,
      rating,
      item: itemId,
    };

    try {
      await createReview(data, purchaseSecret);
    } catch (error) {
      showAlert("error", "There was an error submitting your review.");
    }
  });
}

const verifyToDownloadItem = document.querySelector(".verify-to-download-form");

if (verifyToDownloadItem) {
  const verifyButton = document.querySelector(".access-download");
  const verifyBtn = document.querySelector(".access-download button.action");

  verifyButton.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const email = document.querySelector("#verify-email").value;
    const itemId = form.getAttribute("data-purchased-item-id");

    // Ensure email and itemId are provided
    if (!email || !itemId) {
      showAlert("error", "Please provide your email.");
      return;
    }

    verifyBtn.innerHTML = "Processing!...";
    verifyBtn.disabled = true;
    // Call the verification function
    await verifyEmailFn(email, itemId);
    setTimeout(() => {
      verifyBtn.innerHTML = "Verify Me";
      verifyBtn.disabled = false;
      verifyButton.reset();
    }, 5000);
  });
}

const redirectForm = document.querySelector(".redirect-form");

if (redirectForm) {
  // Automatically submit form after 5 seconds (if required)
  setTimeout(() => {
    redirectForm.submit();
  }, 5000);

  const redirectBtn = document.querySelector(".redirect-btn");
  redirectForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const email = document.querySelector("#redirect-email").value.trim();
    const itemId = form.getAttribute("data-purchased-item-id");

    // Ensure email and itemId are provided
    if (!email || !itemId) {
      showAlert("error", "Please provide your email.");
      return;
    }

    redirectBtn.innerHTML = "Processing!...";
    redirectBtn.disabled = true;

    try {
      // Call the verification function
      await verifyEmailFn(email, itemId);
    } catch (error) {
      showAlert("error", "Verification failed. Please try again.");
    } finally {
      // Reset the button after 5 seconds or based on the verification process
      setTimeout(() => {
        redirectBtn.innerHTML = "Click Here";
        redirectBtn.disabled = false;
      }, 5000);
    }
  });
}

// /* eslint-disable */
// import "@babel/polyfill";
// import { showAlert } from "./alert";
// import { createPost } from "./createPost";
// import { updatePost } from "./updatePost.js";
// import { createItems } from "./createItems";
// import { deleteItem } from "./handleDeletes";
// import { addProject } from "./createProject";
// import { login, logout, signup } from "./login";
// import { createComment } from "./createCommentFn";
// import { updateSettings } from "./updateSettings";
// import { createReview } from "./handleReview";
// import { formatNumber } from "./formatNumber.js";
// import { fetchTrafficData } from "./fetchTrafficData.js";
// import { handlePaymentCallback } from "./handlePayment.js";

// // DOM ELEMENTS
// const editPost = document.querySelector("#editPost");
// const logoutBtn = document.querySelector(".logoutBtn");
// const loginForm = document.querySelector("#form--login");
// const signupForm = document.querySelector("#signUpForm");
// const contactForm = document.querySelector(".contact-form");
// const commentForm = document.querySelector("#comment-form");
// const createPostForm = document.querySelector("#createPost");
// const userDataForm = document.querySelector(".form-user-data");
// const deleteButtons = document.querySelectorAll(".delete-btn");
// const submitReviews = document.querySelector("#submit-review");
// const updateSocialForm = document.querySelector(".updateSocial");
// const itemPurchaseForm = document.querySelector("#purchase-form");
// const createProjectForm = document.querySelector("#createProject");
// const verifyToDownloadItem = document.querySelector(".verify-to-download-form");
// const updatePasswordForm = document.querySelector(".form-user-password");
// const getBaseUrl = `${window.location.protocol}//${window.location.host}`;
// const { dailyCount, monthlyCount, allTimeCount } = await fetchTrafficData();

// if (loginForm) {
//   const sidebar = document.querySelector(".sidebar");
//   if (sidebar) {
//     sidebar.style.display = "none";
//   }

//   loginForm.addEventListener("submit", (e) => {
//     e.preventDefault();
//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;
//     login(email, password);
//   });
// }

// if (signupForm) {
//   const sidebar = document.querySelector(".sidebar");
//   if (sidebar) {
//     sidebar.style.display = "none";
//   }

//   signupForm.addEventListener("submit", (e) => {
//     e.preventDefault();
//     const name = document.getElementById("sg-name").value;
//     const email = document.getElementById("sg-email").value;
//     const password = document.getElementById("sg-password").value;
//     const passwordConfirm = document.getElementById("sg-passwordConfirm").value;
//     signup(name, email, password, passwordConfirm);
//   });
// }

// if (logoutBtn) {
//   logoutBtn.addEventListener("click", (e) => {
//     e.preventDefault();
//     logout();
//   });
// }

// if (createPostForm) {
//   createPostForm.addEventListener("submit", (e) => {
//     e.preventDefault();
//     const title = document.getElementById("new-post-title").value;
//     const content = document.getElementById("new-post-content").value;
//     const excerpt = document.getElementById("excerpt").value;
//     const tags = document.getElementById("tags").value.split(",");
//     const category = document.getElementById("categories").value;
//     const newPostImg = document.getElementById("new-post-img").files[0];

//     createPost(
//       title,
//       content,
//       excerpt,
//       tags,
//       category,
//       newPostImg,
//       "author", // You can replace 'author' with the actual author value
//       true // Replace with the actual published value if needed
//     );
//   });
// }

// if (userDataForm) {
//   userDataForm.addEventListener("submit", (e) => {
//     e.preventDefault();
//     const form = new FormData();
//     form.append("name", document.getElementById("name").value);
//     form.append("email", document.getElementById("email").value);
//     form.append("bio", document.getElementById("bio").value);
//     form.append("photo", document.getElementById("forImg").files[0]);
//     updateSettings(form, "data");
//   });
// }

// if (contactForm) {
//   contactForm.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const name = document.getElementById("name").value;
//     const email = document.getElementById("email").value;
//     const message = document.getElementById("message").value;

//     await createItems(name, email, message, contactForm);
//     contactForm.reset(); // Reset form after successful submission
//   });
// }

// if (deleteButtons) {
//   deleteButtons.forEach((button) => {
//     button.addEventListener("click", function(e) {
//       e.preventDefault();
//       const id = this.getAttribute("data-id");
//       const type = this.getAttribute("data-type"); // Get the type from data attribute
//       if (confirm(`Are you sure you want to delete this ${type}?`)) {
//         deleteItem(type, id);
//       }
//     });
//   });
// }

// if (commentForm) {
//   commentForm.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const form = event.target;
//     const postId = form.getAttribute("data-post-id");
//     const name = form.querySelector("#commenter-name").value;
//     const email = form.querySelector("#email").value;
//     const comment = form.querySelector("#comment").value;

//     await createComment(postId, name, email, comment);
//   });
// }

// if (updatePasswordForm) {
//   updatePasswordForm.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     document.querySelector("#save-password").textContent = "Updating...";

//     const passwordCurrent = document.getElementById("passwordCurrent").value;
//     const password = document.getElementById("password").value;
//     const passwordConfirm = document.getElementById("passwordConfirm").value;
//     await updateSettings(
//       { passwordCurrent, password, passwordConfirm },
//       "password"
//     );

//     document.querySelector("#save-password").textContent = "Update";
//     document.getElementById("passwordCurrent").value = "";
//     document.getElementById("password").value = "";
//     document.getElementById("passwordConfirm").value = "";
//   });
// }

// if (submitReviews) {
//   submitReviews.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const form = event.target;
//     const itemId = form.getAttribute("data-item-id");
//     const rating = form.querySelector('input[name="rating"]:checked').value;
//     const reviewTitle = form.querySelector("#review-title").value;
//     const reviewContent = form.querySelector("textarea").value;
//     const purchaseSecret = form.getAttribute("data-purchase-secret");

//     const data = {
//       title: reviewTitle,
//       review: reviewContent,
//       rating,
//       item: itemId,
//     };

//     try {
//       await createReview(data, purchaseSecret);
//     } catch (error) {
//       showAlert("error", "There was an error submitting your review.");
//     }
//   });
// }

// if (itemPurchaseForm) {
//   itemPurchaseForm.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     alert('working');

//     const email = document.getElementById("email").value;
//     const name = document.getElementById("name").value;
//     const itemId = itemPurchaseForm.dataset.itemId;
//     const price = itemPurchaseForm.dataset.price;

//     try {
//       // Initiate Flutter wave checkout
//       FlutterwaveCheckout({
//         public_key: "FLWPUBK_TEST-b3755023095a7d59d52636b219e61c79-X",
//         tx_ref: "AK_" + Math.floor(Math.random() * 1000000000 + 1),
//         amount: price,
//         currency: "USD",
//         payment_options: "card",
//         customer: {
//           email: email,
//           name: name,
//         },
//         callback: (data) =>
//           handlePaymentCallback(data, itemId, name, email, price, getBaseUrl),
//         customizations: {
//           title: "Dev Memoirs",
//           description: "FlutterWave Integration in Javascript.",
//           // logo: "flutterwave/usecover.gif",
//         },
//       });
//     } catch (error) {
//       console.error("Error initiating payment:", error);
//     }
//   });
// }

// if (updateSocialForm) {
//   updateSocialForm.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const data = {
//       twitter: document.getElementById("twitter").value,
//       facebook: document.getElementById("facebook").value,
//       linkedin: document.getElementById("linkedin").value,
//       github: document.getElementById("github").value,
//       youtube: document.getElementById("youtube").value,
//       instagram: document.getElementById("instagram").value,
//       telegram: document.getElementById("telegram").value,
//       whatsapp: document.getElementById("whatsapp").value,
//     };

//     await updateSettings(data, "socials");

//     console.log(data);

//     // Log the FormData entries
//     // for (const [key, value] of form.entries()) {
//     //   console.log(`${key}: ${value}`);
//     // }
//   });
// }

// if (verifyToDownloadItem) {
//   const email = document.querySelector("#email");

//   const verifyButton = document.querySelector(".access-download");
//   const getBaseUrl = `${window.location.protocol}//${window.location.host}`;

//   verifyButton.addEventListener("submit", (e) => {
//     e.preventDefault();

//     if (inputValue === "123456") {
//       window.location.href = `${getBaseUrl}/payment-success`;
//     } else {
//       showAlert("error", "Verification failed. Please try again.");
//     }
//   });
// }

// // Fetch Traffic Data
// document.getElementById("dailyCount").innerText = formatNumber(dailyCount);
// document.getElementById("monthlyCount").innerText = formatNumber(monthlyCount);
// document.getElementById("allTimeCount").innerText = formatNumber(allTimeCount);

// document.getElementById("daily").querySelector("span").innerText = dailyCount;
// document
//   .getElementById("monthly")
//   .querySelector("span").innerText = monthlyCount;
// document
//   .getElementById("allTime")
//   .querySelector("span").innerText = allTimeCount;

// // FIXME: editPost Not working
// if (editPost) {
//   console.log("Form found:", editPost);

//   const tagsInput = document.querySelector("#tags");
//   editPost.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     alert("Form submitted!"); // Add this line for debugging
//     console.log("Form submitted!");
//     console.log("Post ID:", postId);

//     let tags = tagsInput.value;
//     tags = tags.replace(/[\[\]"]+/g, "");
//     tagsInput.value = tags;

//     const postId = editPost.getAttribute("data-post-id");

//     const form = new FormData();
//     form.append("title", document.getElementById("new-post-title").value);
//     form.append("content", document.getElementById("new-post-content").value);
//     form.append("excerpt", document.getElementById("excerpt").value);
//     form.append("tags", document.getElementById("tags").value);
//     form.append("category", document.getElementById("categories").value);
//     if (document.getElementById("new-post-img").files[0]) {
//       form.append("photo", document.getElementById("new-post-img").files[0]);
//     }
//     console.log("Form data:", [...form.entries()]);

//     await updatePost(form, postId);
//   });
// } else {
//   console.error("Form not found!");
// }

// // FIXME: createProjectForm Not working
// alert("index js available!"); // Add this line for debugging
// if (createProjectForm) {
//   console.log("Form found and event listener attached"); // Debugging log
//   alert("form available!"); // Add this line for debugging

//   createProjectForm.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     console.log("Form submission intercepted"); // Debugging log

//     const form = new FormData();
//     form.append("title", document.getElementById("new-project-title").value);
//     form.append("description", document.getElementById("description").value);
//     form.append("liveUrl", document.getElementById("live-url").value);
//     form.append("githubUrl", document.getElementById("github-url").value);
//     form.append("desktopImg", document.getElementById("desktop-img").files[0]);
//     form.append("mobileImg", document.getElementById("mobile-img").files[0]);

//     // Collect technologies
//     const technologies = Array.from(
//       document.querySelectorAll('input[name="technologies"]:checked')
//     ).map((checkbox) => checkbox.value);
//     technologies.forEach((tech) => form.append("technologies", tech));

//     // Create FormData object
//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("description", description);
//     formData.append("liveUrl", liveUrl);
//     formData.append("githubUrl", githubUrl);
//     formData.append("technologies", JSON.stringify(technologies)); // Correctly format technologies
//     // formData.append("desktopImg", desktopImg);
//     // formData.append("mobileImg", mobileImg);

//     // Call the addProject function
//     await addProject(formData);
//     alert("Form submitted!"); // Add this line for debugging
//   });
// }
