const dateInput = document.getElementById("dateInput");
const loadDateBtn = document.getElementById("loadDateBtn");
const randomBtn = document.getElementById("randomBtn");
const todayBtn = document.getElementById("todayBtn");

const statusBox = document.getElementById("status");
const apodCard = document.getElementById("apodCard");
const apodImage = document.getElementById("apodImage");
const apodVideo = document.getElementById("apodVideo");
const apodDate = document.getElementById("apodDate");
const mediaType = document.getElementById("mediaType");
const apodTitle = document.getElementById("apodTitle");
const apodExplanation = document.getElementById("apodExplanation");
const openMedia = document.getElementById("openMedia");

const API_URL = "https://api.nasa.gov/planetary/apod";

// NASA APOD archive currently begins in 1995.
const MIN_DATE = "1995-06-16";

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function setStatus(message, isError = false) {
  statusBox.textContent = message;
  statusBox.classList.remove("hidden", "error");
  if (isError) statusBox.classList.add("error");
}

function hideStatus() {
  statusBox.classList.add("hidden");
}

function setLoading() {
  setStatus("Loading NASA data...");
  apodCard.classList.add("hidden");
}

function validateDate(date) {
  if (!date) {
    setStatus("Please select a date.", true);
    return false;
  }

  if (date < MIN_DATE || date > getToday()) {
    setStatus(`Choose a date between ${MIN_DATE} and ${getToday()}.`, true);
    return false;
  }

  return true;
}

async function loadAPOD(date = "") {
  if (date && !validateDate(date)) return;

  setLoading();

  const params = new URLSearchParams({
    api_key: NASA_API_KEY
  });

  if (date) params.set("date", date);

  try {
    const response = await fetch(`${API_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.msg || `NASA API returned HTTP ${response.status}`);
    }

    const data = await response.json();
    displayAPOD(data);
  } catch (error) {
    console.error(error);
    setStatus(
      `Unable to load NASA data. ${error.message}. Check your API key and internet connection.`,
      true
    );
  }
}

function displayAPOD(data) {
    hideStatus();
    apodCard.classList.remove("hidden");

    apodDate.textContent = formatDate(data.date);
    mediaType.textContent = data.media_type === "video" ? "Video" : "Image";
    apodTitle.textContent = data.title || "NASA Astronomy Picture of the Day";
    apodExplanation.textContent = data.explanation || "No explanation available.";

    openMedia.href = data.hdurl || data.url || "#";

    if (data.media_type === "image") {
        // Prefer the high-resolution NASA image
        const imageUrl = data.hdurl || data.url;

        apodImage.src = imageUrl;
        apodImage.alt = data.title || "NASA Astronomy Picture of the Day";

        apodImage.classList.remove("hidden");
        apodVideo.src = "";
        apodVideo.classList.add("hidden");
    } else {
        apodImage.src = "";
        apodImage.classList.add("hidden");

        apodVideo.src = data.url;
        apodVideo.classList.remove("hidden");
    }
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(`${dateString}T00:00:00`));
}

function randomDate() {
  const start = new Date(`${MIN_DATE}T00:00:00`);
  const end = new Date(`${getToday()}T00:00:00`);

  const timestamp =
    start.getTime() + Math.random() * (end.getTime() - start.getTime());

  return new Date(timestamp).toISOString().split("T")[0];
}

loadDateBtn.addEventListener("click", () => {
  loadAPOD(dateInput.value);
});

randomBtn.addEventListener("click", () => {
  const date = randomDate();
  dateInput.value = date;
  loadAPOD(date);
});

todayBtn.addEventListener("click", () => {
  const today = getToday();
  dateInput.value = today;
  loadAPOD(today);
});

dateInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    loadAPOD(dateInput.value);
  }
});

// Initial page load: today's APOD.
dateInput.value = getToday();
loadAPOD();
