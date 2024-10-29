document.addEventListener("DOMContentLoaded", () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  if (userData && userData.isAdmin) {
    document.getElementById("management-button-navbar").style.display = "block";
  }
});
