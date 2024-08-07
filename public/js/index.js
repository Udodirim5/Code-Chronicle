/* eslint-disable */
import "@babel/polyfill";
import { createPost } from "./createPost";
import { updatePost } from "./updatePost.js";
import { createItems } from "./createItems";
import { deleteItem } from "./handleDeletes";
import { addProject } from "./createProject";
import { login, logout, signup } from "./login";
import { createComment } from "./createCommentFn";
import { updateSettings } from "./updateSettings";
import { fetchTrafficData } from "./fetchTrafficData.js";
import { handlePaymentCallback } from "./handlePayment.js";

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

  // FIXME: updateSocialForm Not working
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

  // FIXME: commentForm Not working
  if (commentForm) {
    commentForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const postId = commentForm.getAttribute("data-post-id"); // Ensure postId is fetched correctly
      const name = document.getElementById("commenter-name").value;
      const comment = document.getElementById("comment").value;

      await createComment(postId, name, comment); // Pass postId to createComment
    });
  }

  function formatNumber(num) {
    if (num >= 1_000_000_000_000) {
      return (num / 1_000_000_000_000).toFixed(1) + "T";
    } else if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1) + "B";
    } else if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1) + "M";
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(1) + "K";
    } else {
      return num.toString();
    }
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


document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#purchase-form");
  const getBaseUrl = `${window.location.protocol}//${window.location.host}`;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const amount = document.querySelector(".pay").innerText.replace("Pay $", "");
    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;
    const itemId = form.dataset.itemId;

    try {
      console.log("Initiating Flutterwave checkout...");

      // Initiate Flutter wave checkout
      FlutterwaveCheckout({
        public_key: "FLWPUBK_TEST-b3755023095a7d59d52636b219e61c79-X",
        tx_ref: "AK_" + Math.floor(Math.random() * 1000000000 + 1),
        amount: amount,
        currency: "USD",
        payment_options: "card",
        customer: {
          email: email,
          name: name,
        },
        callback: (data) => handlePaymentCallback(data, itemId, name, email, amount, getBaseUrl),
        customizations: {
          title: "AppKinda",
          description: "FlutterWave Integration in Javascript.",
          // logo: "flutterwave/usecover.gif",
        },
      });
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  });
});
