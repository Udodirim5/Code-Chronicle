/* eslint-disable */
import "@babel/polyfill";
import { showAlert } from "./alert";
import { getBaseUrl } from "./baseUrl";
import { createPost } from "./createPost";
import { updatePost } from "./updatePost.js";
import { deleteItem } from "./handleDeletes";
import { login, logout, signup } from "./login";
import { formatNumber } from "./formatNumber.js";
import { createComment } from "./createCommentFn";
import { updateSettings } from "./updateSettings";
import { fetchTrafficData } from "./fetchTrafficData.js";
import { handleProjectFormSubmit } from "./createProject";
import { handlePaymentCallback } from "./handlePayment.js";
import { createReview, verifyEmailFn } from "./handleReview";
import { createContactUs, createItem, addCategory } from "./createItems";

// DOM ELEMENTS
const editPost = document.querySelector("#editPost");
const logoutBtn = document.querySelector(".logoutBtn");
const loginForm = document.querySelector("#form--login");
const signupForm = document.querySelector("#signUpForm");
const contactForm = document.querySelector(".contact-form");
const commentForm = document.getElementById("comment-form");
const createPostForm = document.querySelector("#createPost");
const userDataForm = document.querySelector("#form-user-data");
const updateSocialForm = document.querySelector(".updateSocial");
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

      await createContactUs(name, email, message, contactForm);
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
});

document.addEventListener("DOMContentLoaded", function() {
  if (editPost) {
    editPost.addEventListener("submit", async (e) => {
      e.preventDefault();

      const postId = editPost.getAttribute("data-post-id");
      const title = document.getElementById("new-post-title").value;
      const content = document.getElementById("new-post-content").value;
      const excerpt = document.getElementById("excerpt").value;
      const tags = document.getElementById("tags").value.split(",");
      const category = document.getElementById("categories").value;
      const newPostImg = document.getElementById("new-post-img").files[0];

      updatePost(title, content, excerpt, tags, category, newPostImg, postId);
    });
  }

  // Attach event listeners to forms
  const createProjectForm = document.querySelector("#createProject");
  const editProjectForm = document.querySelector("#editProject");

  if (createProjectForm) {
    handleProjectFormSubmit(createProjectForm, "create");
  }

  if (editProjectForm) {
    const projectId = editProjectForm.dataset.projectId;
    handleProjectFormSubmit(editProjectForm, "update", projectId);
  }

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
          payment_options: "card, mobilemoney, ussd ",
          customer: {
            email: email,
            name: name,
          },
          callback: (data) =>
            handlePaymentCallback(data, itemId, name, email, price),
          customizations: {
            title: "Dev Memoirs",
            description: "Buy a project from Dev Memoirs",
            // logo: "https://devmemoirs.com/logo.png",
            logo: "/img/logo.jpg",
          },
        });
      } catch (error) {
        showAlert(
          "error",
          "There was an error initiating the payment, Please try again later"
        );
        showAlert("error", "Error initiating payment:");
      }
    });
  }

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

  const verifyToDownloadItem = document.querySelector(
    ".verify-to-download-form"
  );

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
    const redirectBtn = document.querySelector(".redirect-btn");

    // Automatically submit form after 5 seconds
    setTimeout(() => {
      const submitEvent = new Event("submit", {
        bubbles: true,
        cancelable: true,
      });
      redirectForm.dispatchEvent(submitEvent); // This will trigger the submit event listener
    }, 5000);

    let count = 5;
    const counter = document.querySelector("#counter");
    const interval = setInterval(() => {
      count--;
      counter.innerText = `If you're not redirected in ${count} seconds,`;
      if (count === 0) {
        clearInterval(interval);
      }
    }, 1000);

    redirectForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const form = e.target;
      const email = document.querySelector("#redirect-email").value.trim();
      const itemId = document.querySelector("#item").value.trim();
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

  const createItemForm = document.querySelector("#createItem");

  if (createItemForm) {
    createItemForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.target;
      const name = form.querySelector("#new-item-name").value;
      const description = form.querySelector("#description").value;
      const price = form.querySelector("#price").value;
      const priceDiscount = form.querySelector("#priceDiscount").value;
      const itemImg = form.querySelector("#itemImg").files[0];
      const zipFile = form.querySelector("#zipFile").files[0];

      // Create FormData object
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("priceDiscount", priceDiscount);
      formData.append("image", itemImg);
      formData.append("itemZipFile", zipFile);

      try {
        await createItem(formData);
      } catch (error) {
        showAlert("error", "There was an error creating the item.");
      }
    });
  }

  const newCategory = document.querySelector(".post-group.categories");

  if (newCategory) {
    const addCatBtn = document.querySelector("#addNewCat");
    const addCatDiv = document.querySelector(".new-category");
    const closeCat = document.querySelector("#cancel");

    if (addCatBtn && addCatDiv && closeCat) {
      addCatBtn.addEventListener("click", (e) => {
        e.preventDefault();
        addCatDiv.classList.add("addCat");
        document.body.style.overflow = "hidden";
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

      closeCat.addEventListener("click", (e) => {
        e.preventDefault();
        addCatDiv.classList.remove("addCat");
        document.body.style.overflow = "";
      });
    }

    const addCatForm = document.querySelector("#add-category-form");

    if (addCatForm) {
      addCatForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.querySelector("#category-name").value;
        const description = document.querySelector("#category-description")
          .value;

        const data = { name, description };
        addCatForm.reset();
        try {
          await addCategory(data);
        } catch (err) {
          showAlert("error", "Error adding category:", err);
        }
      });
    }
  }
});
