"use strict";

/**
 * Add event on multiple elements
 */
const addEventOnElements = function(elements, eventType, callback) {
  if (elements) {
    elements.forEach((element) => {
      element.addEventListener(eventType, callback);
    });
  }
};

/**
 * MOBILE NAVBAR
 */
const navbar = document.querySelector("[data-navbar]");
const navToggler = document.querySelector(".nav-toggle-btn");
const navLinks = document.querySelectorAll("[data-nav-link]");

const toggleNav = function() {
  navbar.classList.toggle("active");
  navToggler.classList.toggle("active");
};

navToggler?.addEventListener("click", toggleNav);

const navClose = () => {
  navbar.classList.remove("active");
  navToggler.classList.remove("active");
};

addEventOnElements(navLinks, "click", navClose);

/**
 * HEADER and BACK TOP BTN
 */
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const activeEl = function() {
  if (window.scrollY > 100) {
    header?.classList.add("active");
    backTopBtn?.classList.add("active");
  } else {
    header?.classList.remove("active");
    backTopBtn?.classList.remove("active");
  }
};

window.addEventListener("scroll", activeEl);

/**
 * Button hover ripple effect
 */
const buttons = document.querySelectorAll("[data-btn]");

const buttonHoverRipple = function(event) {
  this.style.setProperty("--top", `${event.offsetY}px`);
  this.style.setProperty("--left", `${event.offsetX}px`);
};

addEventOnElements(buttons, "mousemove", buttonHoverRipple);

/**
 * Scroll reveal
 */
const revealElements = [
  ...document.querySelectorAll("[data-reveal]"),
  ...document.querySelectorAll(".data-reveal"),
];

const revealElementOnScroll = function() {
  revealElements.forEach((element) => {
    const isElementInsideWindow =
      element.getBoundingClientRect().top < window.innerHeight / 1.1;
    element.classList.toggle("revealed", isElementInsideWindow);
  });
};

// Add debouncing to improve performance
const debounce = (func, wait = 20, immediate = true) => {
  let timeout;
  return function() {
    const context = this,
      args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

["scroll", "load", "resize"].forEach((event) =>
  window.addEventListener(event, debounce(revealElementOnScroll))
);

/**
 * Custom cursor
 */
const cursor = document.querySelector("#data-cursor");
const hoverElements = [
  ...document.querySelectorAll("a"),
  ...document.querySelectorAll("button"),
];

const cursorMove = function(event) {
  if (cursor) {
    cursor.style.top = `${event.clientY}px`;
    cursor.style.left = `${event.clientX}px`;
  }
};

window.addEventListener("mousemove", cursorMove);

addEventOnElements(hoverElements, "mouseover", function() {
  cursor?.classList.add("hovered");
});

addEventOnElements(hoverElements, "mouseout", function() {
  cursor?.classList.remove("hovered");
});

/**
 * Admin side JavaScript
 */
// const initializeImagePreview = function(imgSelector, inputSelector) {
//   const imgElement = document.querySelector(imgSelector);
//   const inputElement = document.querySelector(inputSelector);

//   if (inputElement) {
//     inputElement.addEventListener("change", () => {
//       const file = inputElement.files[0];
//       if (file) {
//         imgElement.src = URL.createObjectURL(file);
//       }
//     });
//   }
// };

const initializePasswordToggle = function(
  passwordInputSelector,
  toggleButtonSelector
) {
  const passwordInput = document.querySelector(passwordInputSelector);
  const togglePasswordButton = document.querySelector(toggleButtonSelector);

  if (passwordInput && togglePasswordButton) {
    togglePasswordButton.addEventListener("click", () => {
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      togglePasswordButton.textContent = type === "password" ? "Show" : "Hide";
    });
  }
};

// Forgot Password
const userPasswordForm = document.querySelector(".form-user-password");
if (userPasswordForm) {
  initializePasswordToggle("#passwordCurrent", "#showPasswordCurrent");
  initializePasswordToggle("#password", "#showPassword");
  initializePasswordToggle("#passwordConfirm", "#showPasswordConfirm");
}
// Log In
const loginForm = document.querySelector("#form--login");
if (loginForm) {
  initializePasswordToggle("#password", "#showPassword");
}

// Sign Up
const signupForm = document.querySelector("#signUpForm");
if (signupForm) {
  initializePasswordToggle("#sg-password", "#showPassword");
  initializePasswordToggle("#sg-passwordConfirm", "#showPasswordConfirm");
}

const profileForm = document.querySelector(".form-user-data");
if (profileForm) {
  initializeImagePreview("#imgForImg", "#forImg");
}

// const createPostForm = document.querySelector("#createPost");
// if (createPostForm) {
//   initializeImagePreview("#iPNGimg", "#new-post-img");
// }

// const createProjectForm = document.querySelector("#createProject");
// if (createProjectForm) {
//   initializeImagePreview("#desktop-img-view", "#desktop-img");
//   initializeImagePreview("#mobile-img-view", "#mobile-img");
// }
/**
 * Post single
 */
document.addEventListener("DOMContentLoaded", function() {
  const commentForm = document.getElementById("comment-form");
  const commentInput = document.getElementById("comment");
  const characterCounter = document.getElementById("character-counter");
  const maxCharacters = 1000;

  if (commentForm && commentInput && characterCounter) {
    commentForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const name = document.getElementById("commenter-name").value;
      const comment = commentInput.value;

      if (name && comment) {
        clearForm();
      }
    });

    commentInput.addEventListener("input", handleCharacterCount);
  }

  function clearForm() {
    document.getElementById("commenter-name").value = "";
    commentInput.value = "";
    characterCounter.innerText = "1000/1000";
    commentInput.disabled = false;
  }

  function handleCharacterCount() {
    const remainingCharacters = maxCharacters - commentInput.value.length;
    characterCounter.innerText = `${remainingCharacters}/1000`;

    if (remainingCharacters < 0) {
      characterCounter.style.color = "red";
      commentInput.disabled = true;
    } else {
      characterCounter.style.color = "white";
      commentInput.disabled = false;
    }
  }
});

/**
 * Handle open and close buttons
 */
document.querySelectorAll(".open-btn").forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const id = button.getAttribute("data-id");
    document
      .querySelector(`.msg-content[data-id="${id}"]`)
      .classList.add("msg-content--show");
  });
});

document.querySelectorAll(".close-btn").forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const id = button.getAttribute("data-id");
    document
      .querySelector(`.msg-content[data-id="${id}"]`)
      .classList.remove("msg-content--show");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".elements button");
  const textarea = document.getElementById("new-post-content");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const element = button.getAttribute("data-element");
      let insertText = "";

      switch (element) {
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
          insertText = `<${element}>Heading</${element}>\n`;
          break;
        case "ul":
          insertText = `<${element}>\n  <li>List item</li>\n</${element}>\n`;
          break;
        case "li":
          insertText = `<${element}>List item</${element}>\n`;
          break;
        case "p":
          insertText = `<${element}>Paragraph</${element}>\n`;
          break;
        case "a":
          insertText = `<${element} href="#">Link</${element}>\n`;
          break;
        case "code":
          insertText = `<${element}>Code snippet</${element}>\n`;
          break;
        case "pre":
          insertText = `<${element}>\nCode block\n</${element}>\n`;
          break;
        case "img":
          insertText = `<${element} src="path/to/image" alt="description"/>\n`;
          break;
        default:
          insertText = `<${element}></${element}>\n`;
      }

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;

      textarea.value =
        text.substring(0, start) + insertText + text.substring(end);
      textarea.focus();
      textarea.setSelectionRange(
        start + insertText.length,
        start + insertText.length
      );
    });
  });
});

document.addEventListener("DOMContentLoaded", function() {
  const searchInput = document.getElementById("search-input");
  const searchResults = document.querySelector(".search-results");
  const searchResultUl = document.querySelector(".search-results ul");

  if (searchInput && searchResults) {
    searchInput.addEventListener("input", function(e) {
      const query = searchInput.value.trim();

      if (query) {
        fetch(`/api/v1/search?q=${query}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((posts) => {
            searchResultUl.innerHTML = ""; // Clear previous results

            if (posts.length > 0) {
              posts.forEach((post, index) => {
                const listItem = document.createElement("li");
                listItem.classList.add("search-result-item");
                listItem.setAttribute("data-index", index);
                const link = document.createElement("a");
                link.href = `/blog/${post.slug}`;
                link.innerText = post.title;
                listItem.appendChild(link);

                searchResultUl.appendChild(listItem);
              });
            } else {
              searchResultUl.innerHTML = "<li>No results found</li>";
            }
          })
          .catch((error) => {
            searchResultUl.innerHTML = "<li>Error fetching results</li>";
          });

        // Show the results
        searchResults.style.visibility = "visible";
        searchResults.style.zIndex = "10";
        searchResults.style.top = "50px";
      } else {
        searchResults.style.visibility = "hidden";
        searchResults.style.zIndex = "-1";
        searchResults.style.top = "-500px";
      }
    });

    searchInput.addEventListener("blur", function() {
      setTimeout(() => {
        searchResults.style.visibility = "hidden";
        searchResults.style.zIndex = "-1";
        searchResults.style.top = "-500px";
      }, 200); // Adding a delay to allow clicking on search results
    });

    document
      .querySelector("#search-form button")
      .addEventListener("click", (e) => {
        e.preventDefault();
      });
  }
});

document.addEventListener("DOMContentLoaded", function() {
  const preloader = document.querySelector(".preloader.news-list");
  const newsList = document.querySelector(".news-list.hidden");
  const noResults = document.querySelector(".no-results.hidden");

  // Simulate fetching data with a delay
  setTimeout(() => {
    // Hide preloader
    preloader.style.display = "none";
    // Show actual content
    newsList.classList.remove("hidden");
    noResults.classList.remove("hidden");
  }, 2000); // Adjust the delay as needed
});

document.addEventListener("DOMContentLoaded", function() {
  const buttons = document.querySelectorAll(".menu-bottom");
  const items = document.querySelectorAll(".menu-body-item");

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      buttons.forEach((btn) => btn.classList.remove("active"));
      // Add active class to the clicked button
      button.classList.add("active");

      // Hide all menu body items
      items.forEach((item) => {
        item.classList.remove("active-item");
      });

      // Show the corresponding menu body item
      items[index].classList.add("active-item");
    });
  });
});

document.addEventListener("DOMContentLoaded", function() {
  const showMoreButtons = document.querySelectorAll(".read-more-btn");
  const hideButtons = document.querySelectorAll(".item-close-btn");

  showMoreButtons.forEach((showMore) => {
    showMore.addEventListener("click", (e) => {
      e.preventDefault();
      const readMoreBox = showMore
        .closest(".menu-body-item-content")
        .querySelector(".item-read-more");
      if (readMoreBox) {
        readMoreBox.classList.add("show-more");
      }
    });
  });

  hideButtons.forEach((hide) => {
    hide.addEventListener("click", (e) => {
      e.preventDefault();
      const readMoreBox = hide
        .closest(".menu-body-item-content")
        .querySelector(".item-read-more");
      if (readMoreBox) {
        readMoreBox.classList.remove("show-more");
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const checkboxes = document.querySelectorAll(
    '.checkboxes input[type="checkbox"]'
  );

  checkboxes.forEach((checkbox) => {
    const label = document.querySelector(`label[for="${checkbox.id}"]`);

    // Add event listener for checkbox change
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        label.classList.add("selected");
      } else {
        label.classList.remove("selected");
      }
    });
  });

  const toggleAdminMenu = document.querySelector(".toggle-box");
  const adminMenu = document.querySelector(".sidebar");

  if (toggleAdminMenu) {
    toggleAdminMenu.addEventListener("click", () => {
      adminMenu.classList.toggle("menu-visible");
    });
  }
});

const adminActionButtons = document.querySelectorAll(".fa-ellipsis-v");
if (adminActionButtons) {
  adminActionButtons.forEach((showMore) => {
    showMore.addEventListener("click", (e) => {
      e.preventDefault();
      const actionsInner = showMore.nextElementSibling;
      if (actionsInner) {
        actionsInner.classList.toggle("show-actions");
      }
    });
  });
}

const clickToPay = document.querySelector("#buy-now-btn");
const closeClickToPay = document.querySelector("#close-pay-btn");
const payForm = document.querySelector(".purchase-form-container");

if (payForm) {
  clickToPay.addEventListener("click", () => {
    payForm.classList.add("add-pay-active");
    document.body.style.overflow = "hidden";
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  closeClickToPay.addEventListener("click", () => {
    payForm.classList.remove("add-pay-active");
    document.body.style.overflow = "";
  });
}

const clickToView = document.querySelector("#view-download");
const closeClickToView = document.querySelector("#otp-close");
const viewOTPForm = document.querySelector(".verify-to-download-form");

if (viewOTPForm) {
  clickToView.addEventListener("click", () => {
    viewOTPForm.classList.add("view-active");
    document.body.style.overflow = "hidden";
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  closeClickToView.addEventListener("click", () => {
    viewOTPForm.classList.remove("view-active");
    document.body.style.overflow = "";
  });
}

document.addEventListener("DOMContentLoaded", function() {
  const inputContainer = document.querySelector(".login-pass");
  const inputs = document.querySelectorAll(".login-pass input");

  if (inputContainer) {
    // Handle navigation between inputs
    inputs.forEach((input, index) => {
      input.addEventListener("keyup", (e) => {
        const nextInput = inputs[index + 1];
        const prevInput = inputs[index - 1];

        if (input.value.length === 1 && nextInput) {
          nextInput.focus();
        } else if (e.key === "Backspace" && prevInput) {
          prevInput.focus();
        }
      });
    });

    const getIn = document.getElementById("getIn");
    const adminLoginPass = document.querySelector(".admin-login-pass");

    // Function to get the combined value of all input fields
    function getInputValue() {
      return Array.from(inputs)
        .map((input) => input.value)
        .join("");
    }

    // Event listener for input changes
    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        const inputValue = getInputValue();

        // Check if the combined value matches the correct passcode
        if (inputValue === "123456") {
          getIn.classList.add("get-active");
          adminLoginPass.style.display = "none";
        } else {
          getIn.classList.remove("get-active");
          adminLoginPass.style.display = "block";
        }
      });
    });
  }
});
