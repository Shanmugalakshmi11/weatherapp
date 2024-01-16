/*SEARCH BY USING A CITY NAME (e.g. Pune, Delhi) */
const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");
const input_history = [];

/*SUBSCRIBE HERE FOR API KEY: https://home.openweathermap.org/users/sign_up*/
const apiKey = "8774eb2043a13010575b487a157aa40e";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let inputVal = input.value;

  //check if there's already a city
  const listItems = list.querySelectorAll(".ajax-section .city");
  const listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter((el) => {
      let content = "";

      if (inputVal.includes(",")) {
        //invalid country code, so we keep only the first part of inputVal
        if (inputVal.split(",")[1].length > 2) {
          inputVal = inputVal.split(",")[0];
          content = el
            .querySelector(".city-name span")
            .textContent.toLowerCase();
        } else {
          content = el.querySelector(".city-name").dataset.name.toLowerCase();
        }
      } else {
        //athens
        content = el.querySelector(".city-name span").textContent.toLowerCase();
      }
      return content == inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) {
      msg.textContent = `You already know the weather for ${
        filteredArray[0].querySelector(".city-name span").textContent
      } ...otherwise be more specific by providing the country code as well 😉`;
      form.reset();
      input.focus();
      return;
    }
  }

  //ajax here
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;
  if (input_history.includes(inputVal.toLowerCase())) {
    msg.textContent = "Please search for a valid city 😩";

    alert("City already added !!");
  } else {
    input_history.push(inputVal.toLowerCase());
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const { main, name, weather } = data;
        const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]["icon"]}.svg`;

        const li = document.createElement("li");
        li.classList.add("city");
        const markup = `
      <h2 class="city-name" data-name="${name}">
      <span>
      <span>${name}</span>
      </span>
      </h2>
      <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
      <figure>
        <img class="city-icon" src="${icon}" alt="${weather[0]["description"]}">
        <figcaption>${weather[0]["description"]}</figcaption>
      </figure>
    `;
        li.innerHTML = markup;
        const firstItem = list.firstChild;
        list.insertBefore(li, firstItem);
      })
      .catch(() => {
        msg.textContent = "Please search for a valid city 😩";
      });
  }

  msg.textContent = "";
  form.reset();
  input.focus();
});
