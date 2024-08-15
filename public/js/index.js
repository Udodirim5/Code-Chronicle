/* eslint-disable */
import "@babel/polyfill";
import { showAlert } from "./alert.js";
import { createPost } from "./createPost.js";
import { updatePost } from "./updatePost.js";
import { createItems } from "./createItems.js";
import { deleteItem } from "./handleDeletes.js";
import { addProject } from "./createProject.js";
import { formatNumber } from "./formatNumber.js";
import { createReview } from "./handleReview.js";
import { login, logout, signup } from "./login.js";
import { createComment } from "./createCommentFn.js";
import { updateSettings } from "./updateSettings.js";
import { fetchTrafficData } from "./fetchTrafficData.js";
import { handlePaymentCallback } from "./handlePayment.js";

// DOM ELEMENTS
const editPost = document.querySelector("#editPost");
const logoutBtn = document.querySelector(".logoutBtn");
const loginForm = document.querySelector("#form--login");
const signupForm = document.querySelector("#signUpForm");
const contactForm = document.querySelector(".contact-form");
const commentForm = document.querySelector("#comment-form");
const createPostForm = document.querySelector("#createPost");
const userDataForm = document.querySelector(".form-user-data");
const deleteButtons = document.querySelectorAll(".delete-btn");
const submitReviews = document.querySelector("#submit-review");
const updateSocialForm = document.querySelector(".updateSocial");
const itemPurchaseForm = document.querySelector("#purchase-form");
const createProjectForm = document.querySelector("#createProject");
const updatePasswordForm = document.querySelector(".form-user-password");
const getBaseUrl = `${window.location.protocol}//${window.location.host}`;
const { dailyCount, monthlyCount, allTimeCount } = await fetchTrafficData();

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
    const passwordConfirm = document.getElementById("sg-passwordConfirm").value;
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

    const form = event.target;
    const postId = form.getAttribute("data-post-id");
    const name = form.querySelector("#commenter-name").value;
    const email = form.querySelector("#email").value;
    const comment = form.querySelector("#comment").value;

    await createComment(postId, name, email, comment);
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
          handlePaymentCallback(data, itemId, name, email, price, getBaseUrl),
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

if (updateSocialForm) {
  updateSocialForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      twitter: document.getElementById("twitter").value,
      facebook: document.getElementById("facebook").value,
      linkedin: document.getElementById("linkedin").value,
      github: document.getElementById("github").value,
      youtube: document.getElementById("youtube").value,
      instagram: document.getElementById("instagram").value,
      telegram: document.getElementById("telegram").value,
      whatsapp: document.getElementById("whatsapp").value,
    };
    
    await updateSettings(data, "socials");
    
      console.log(data);
    
    // Log the FormData entries
    // for (const [key, value] of form.entries()) {
    //   console.log(`${key}: ${value}`);
    // }
  });
}


// Fetch Traffic Data
document.getElementById("dailyCount").innerText = formatNumber(dailyCount);
document.getElementById("monthlyCount").innerText = formatNumber(
  monthlyCount
);
document.getElementById("allTimeCount").innerText = formatNumber(
  allTimeCount
);

document.getElementById("daily").querySelector("span").innerText = dailyCount;
document
  .getElementById("monthly")
  .querySelector("span").innerText = monthlyCount;
document
  .getElementById("allTime")
  .querySelector("span").innerText = allTimeCount;









// FIXME: editPost Not working
if (editPost) {
  console.log("Form found:", editPost);

  const tagsInput = document.querySelector("#tags");
  editPost.addEventListener("submit", async (e) => {
    e.preventDefault();
    alert("Form submitted!"); // Add this line for debugging
    console.log("Form submitted!");
    console.log("Post ID:", postId);

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
    console.log("Form data:", [...form.entries()]);

    await updatePost(form, postId);
  });
} else {
  console.error("Form not found!");
}

// FIXME: createProjectForm Not working
alert("index js available!"); // Add this line for debugging
if (createProjectForm) {
  console.log("Form found and event listener attached"); // Debugging log
  alert("form available!"); // Add this line for debugging

  createProjectForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Form submission intercepted"); // Debugging log

    const form = new FormData();
    form.append("title", document.getElementById("new-project-title").value);
    form.append("description", document.getElementById("description").value);
    form.append("liveUrl", document.getElementById("live-url").value);
    form.append("githubUrl", document.getElementById("github-url").value);
    form.append("desktopImg", document.getElementById("desktop-img").files[0]);
    form.append("mobileImg", document.getElementById("mobile-img").files[0]);

    // Collect technologies
    const technologies = Array.from(
      document.querySelectorAll('input[name="technologies"]:checked')
    ).map((checkbox) => checkbox.value);
    technologies.forEach((tech) => form.append("technologies", tech));

    // Create FormData object
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("liveUrl", liveUrl);
    formData.append("githubUrl", githubUrl);
    formData.append("technologies", JSON.stringify(technologies)); // Correctly format technologies
    // formData.append("desktopImg", desktopImg);
    // formData.append("mobileImg", mobileImg);

    // Call the addProject function
    await addProject(formData);
    alert("Form submitted!"); // Add this line for debugging
  });
}

const viewOTPForm = document.querySelector(".verify-to-download-form");

if (viewOTPForm) {
  const input1 = document.querySelector("#otp-input1");
  const input2 = document.querySelector("#otp-input2");
  const input3 = document.querySelector("#otp-input3");
  const input4 = document.querySelector("#otp-input4");
  const input5 = document.querySelector("#otp-input5");
  const input6 = document.querySelector("#otp-input6");

  const verifyButton = document.querySelector(".access-download");
  const getBaseUrl = `${window.location.protocol}//${window.location.host}`;

  verifyButton.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputValue = `${input1.value}${input2.value}${input3.value}${input4.value}${input5.value}${input6.value}`;

    if (inputValue === "123456") {
      window.location.href = `${getBaseUrl}/payment-success`; //?tx_ref=${reference}`;
    } else {
      showAlert("error", "Verification failed. Please try again.");
    }
  });
}
