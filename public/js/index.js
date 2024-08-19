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

      const form = e.target;
      const twitter = document.getElementById("twitter").value;
      const facebook = document.getElementById("facebook").value;
      const linkedin = document.getElementById("linkedin").value;
      const github = document.getElementById("github").value;
      const youtube = document.getElementById("youtube").value;
      const instagram = document.getElementById("instagram").value;
      const telegram = document.getElementById("telegram").value;
      const whatsapp = document.getElementById("whatsapp").value;

      const data = {
        twitter,
        facebook,
        linkedin,
        github,
        youtube,
        instagram,
        telegram,
        whatsapp,
      };

      updateSettings(data, "socials");
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
  // if (editPost) {
    editPost.addEventListener("submit", async (e) => {
      e.preventDefault();

      const postId = editPost.getAttribute("data-post-id");
      const title = document.getElementById("new-post-title").value;
      const content = document.getElementById("new-post-content").value;
      const excerpt = document.getElementById("excerpt").value;
      const tags = document.getElementById("tags").value.split(",");
      const category = document.getElementById("categories").value;
      const newPostImg = document.getElementById("new-post-img").files[0];

      updatePost(
        title,
        content,
        excerpt,
        tags,
        category,
        newPostImg,
        postId
      );

    });
  // }

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

    const form = e.target;
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
