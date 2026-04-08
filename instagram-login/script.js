const profiles = [
  { ip: "23.17.44.201", location: "New York, USA", timezone: "UTC-04:00" },
  { ip: "41.88.132.54", location: "Nairobi, Kenya", timezone: "UTC+03:00" },
  { ip: "78.31.220.14", location: "Berlin, Germany", timezone: "UTC+02:00" },
  { ip: "103.91.188.77", location: "Hyderabad, India", timezone: "UTC+05:30" },
  { ip: "185.72.44.16", location: "Amsterdam, Netherlands", timezone: "UTC+02:00" },
  { ip: "196.12.55.109", location: "Cape Town, South Africa", timezone: "UTC+02:00" },
  { ip: "60.241.90.17", location: "Sydney, Australia", timezone: "UTC+10:00" },
  { ip: "201.44.91.203", location: "Sao Paulo, Brazil", timezone: "UTC-03:00" },
  { ip: "51.144.38.120", location: "London, United Kingdom", timezone: "UTC+01:00" },
  { ip: "118.201.74.11", location: "Singapore", timezone: "UTC+08:00" },
  { ip: "92.51.101.88", location: "Madrid, Spain", timezone: "UTC+02:00" },
  { ip: "149.33.62.19", location: "Toronto, Canada", timezone: "UTC-04:00" },
  { ip: "202.166.14.45", location: "Kathmandu, Nepal", timezone: "UTC+05:45" },
  { ip: "154.21.177.80", location: "Lagos, Nigeria", timezone: "UTC+01:00" },
  { ip: "37.18.205.212", location: "Paris, France", timezone: "UTC+02:00" },
  { ip: "114.77.39.23", location: "Tokyo, Japan", timezone: "UTC+09:00" },
  { ip: "171.25.66.145", location: "Bangkok, Thailand", timezone: "UTC+07:00" },
  { ip: "190.7.118.64", location: "Bogota, Colombia", timezone: "UTC-05:00" },
  { ip: "84.42.119.201", location: "Prague, Czech Republic", timezone: "UTC+02:00" },
  { ip: "122.54.201.33", location: "Manila, Philippines", timezone: "UTC+08:00" }
];

const profileSelect = document.getElementById("profile-select");
const profileList = document.getElementById("profile-list");
const ipValue = document.getElementById("ip-value");
const locationValue = document.getElementById("location-value");
const timezoneValue = document.getElementById("timezone-value");
const randomizeBtn = document.getElementById("randomize-btn");

function renderList() {
  profileList.innerHTML = profiles
    .map(
      (profile, index) => `
        <li>
          <strong>${index + 1}. ${profile.location}</strong>
          <span>${profile.ip} | ${profile.timezone}</span>
        </li>
      `
    )
    .join("");

  profileSelect.innerHTML = profiles
    .map(
      (profile, index) =>
        `<option value="${index}">${index + 1}. ${profile.location}</option>`
    )
    .join("");
}

function updateProfile(index) {
  const profile = profiles[index];
  ipValue.textContent = profile.ip;
  locationValue.textContent = profile.location;
  timezoneValue.textContent = profile.timezone;
  profileSelect.value = String(index);
}

profileSelect.addEventListener("change", (event) => {
  updateProfile(Number(event.target.value));
});

randomizeBtn.addEventListener("click", () => {
  const randomIndex = Math.floor(Math.random() * profiles.length);
  updateProfile(randomIndex);
});

renderList();
updateProfile(0);
