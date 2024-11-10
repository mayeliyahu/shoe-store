document.addEventListener("DOMContentLoaded", () => {
  const rangeInputs = document.querySelectorAll('input[type="range"]');
  const numberInputs = document.querySelectorAll(".field input");

  rangeInputs.forEach((input) => {
    input.addEventListener("input", handleInputChange);
  });

  numberInputs.forEach((input) => {
    input.addEventListener("input", handleInputChange);
  });

  function handleInputChange(e) {
    let min = parseFloat(rangeInputs[0].value);
    let max = parseFloat(rangeInputs[1].value);

    if (min > max) {
      [min, max] = [max, min];
    }

    rangeInputs[0].value = min;
    rangeInputs[1].value = max;

    numberInputs[0].value = min;
    numberInputs[1].value = max;

    const progress = document.querySelector(".slider .progress");
    const rangeMin = parseFloat(rangeInputs[0].min);
    const rangeMax = parseFloat(rangeInputs[0].max);

    progress.style.left =
      ((min - rangeMin) / (rangeMax - rangeMin)) * 100 + "%";
    progress.style.right =
      100 - ((max - rangeMin) / (rangeMax - rangeMin)) * 100 + "%";
  }
});
