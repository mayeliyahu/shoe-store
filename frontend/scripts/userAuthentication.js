document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  const userData = JSON.parse(localStorage.getItem("user"));
  if (userData) {
    replaceLogintoGreetingModal(userData.name);
  }

  if (userData && userData.isAdmin) {
    document.getElementById("management-button").style.display = "block";
  }

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const loginData = {
      email: document.getElementById("loginEmail").value,
      password: document.getElementById("loginPassword").value,
    };

    try {
      const response = await fetch(`http://localhost:5001/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Login successful!");

        localStorage.setItem("user", JSON.stringify(data));
        replaceLogintoGreetingModal(data.name);

        clearInputs("#loginForm");
        closeModal();

        console.log(data);
      } else {
        alert("Login failed!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });

  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const registerData = {
      name: document.getElementById("registerFullName").value,
      email: document.getElementById("registerEmail").value,
      password: password,
    };

    try {
      const response = await fetch("http://localhost:5001/api/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Registration successful!");

        clearInputs("#registerForm");

        const loginTab = new bootstrap.Tab(
          document.getElementById("login-tab")
        );
        loginTab.show();

        console.log(data);
      } else {
        alert("Registration failed!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });

  function clearInputs(formId) {
    document
      .querySelectorAll(`${formId} input`)
      .forEach((input) => (input.value = ""));
  }

  function closeModal() {
    const modal = document.getElementById("loginModal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
  }

  function replaceLogintoGreetingModal(username) {
    const orderSummaryHTML = `
              <li class="dropdown"  style="padding-right: 1rem;">
                    <a href="#"  data-bs-toggle="dropdown" role="button" aria-expanded="false">
                        <svg class="user">
                        <use xlink:href="#user"></use>
                      </svg>
                      
                    </a>
                    <div class="dropdown-menu animate slide dropdown-menu-start dropdown-menu-lg-end p-3">
                      <h4>
                        <span class="text-primary">Hello ${username}</span>
                       
                      </h4>
                      <button id="logoutBtn" class="btn btn-danger mt-3">Logout</button>
                     
                    </div>
                  </li>
                    
`;

    const loginLink = document.querySelector("li.pe-3");
    loginLink.outerHTML = orderSummaryHTML;

    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("user");
      location.reload();
    });
  }
});
