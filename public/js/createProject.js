// Import statements
import axios from "axios";
import { showAlert } from "./alert";
import { getBaseUrl } from "./baseUrl";

// Add Project Function
const addProject = async (formData, type) => {
  let method;
  let url = `${getBaseUrl()}/api/v1/projects`;
  if (type === "create") {
    url = url
    method = "post";
  } else if (type === "update") {
    url = `${url}/${project._id}`;
    method = "patch";
  }

  try {
    const res = await axios({
      method,
      url,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data.status === "success") {
      if (type === "create") {
        showAlert("success", "Project added successfully");
        location.assign("/admin/myWork");
      } else if (type === "update") {
        showAlert("success", "Project updated successfully");
        location.assign(`/admin/project/${res.data.data._id}`);
      }
    } else {
      showAlert("error", "Unexpected status:", res.data.status);
    }
  } catch (err) {
    showAlert("error", "Something went wrong. Please try again.");
  }
};

// Function to handle form submissions
export const handleProjectFormSubmit = async (form, actionType) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Extract form data
    const title = document.querySelector("#new-project-title").value;
    const description = document.querySelector("#description").value;
    const liveUrl = document.querySelector("#live-url").value;
    const githubUrl = document.querySelector("#github-url").value;

    // Extract selected technologies (checkboxes)
    const technologies = Array.from(
      document.querySelectorAll('input[name="technologies"]:checked')
    ).map((checkbox) => checkbox.value);

    // Extract image files
    const desktopImg = document.querySelector("#desktop-img").files[0];
    const mobileImg = document.querySelector("#mobile-img").files[0];

    // Create FormData object
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("liveUrl", liveUrl);
    formData.append("gitHubUrl", githubUrl);
    formData.append("technologies", technologies);
    formData.append("desktopImg", desktopImg);
    formData.append("mobileImg", mobileImg);

    // Call the addProject function with appropriate action type
    await addProject(formData, actionType);
  });
};
