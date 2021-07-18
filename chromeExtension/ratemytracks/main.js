const colorMapping = {
  poor: "#ea373d",
  average: "#FFF27D",
  good: "#6BD175",
};

var observer = new MutationObserver(() => {
  if (
    document.getElementsByClassName("ps_grid-col INSTRUCTOR").length === 1 &&
    document.getElementsByClassName("psc_invisible").length === 0
  ) {
    setUp();
    observer.disconnect();
  }
});

try {
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
} catch (error) {
  console.log("MutationObserver could not be set up.");
}

function setUp() {
  chrome.storage.sync.get("enabled", (data) => {
    if (Boolean(data.enabled)) {
      fetch(chrome.runtime.getURL("profData.json"))
        .then((resp) => resp.json())
        .then((data) => {
          const table = document.getElementsByClassName("ps_grid-flex")[0];
          const head = table.children[0].children[0];
          const rows = table.children[1].children;

          addRatingHeader(head);
          addRowRating(rows, data);
        })
        .catch((err) => console.error(err));
    }
  });
}

function addRatingHeader(head) {
  head.insertCell(7).outerHTML = "<th>Rating</th>";
  head.children[7].classList.add("ps_grid-col");
}

function addRowRating(rows, data) {
  for (row of rows) {
    row.insertCell(7);
    row.children[7].outerHTML = "<td></td>";
    row.children[7].appendChild(document.createElement("div"));
    row.children[7].children[0].appendChild(document.createElement("div"));
    row.children[7].children[0].children[0].appendChild(
      document.createElement("span")
    );
    row.children[7].className = "ps_grid-cell RATING";

    const profNames = row.querySelector(".INSTRUCTOR").children[0].children;
    let profFound = false;
    let prof = null;
    for (x of profNames) {
      if (
        x.children[0].innerHTML !== "Staff" &&
        x.children[0].innerHTML !== "To be Announced"
      ) {
        prof = x.children[0];
        profFound = true;
        break;
      }
    }
    let rating = "N/A";
    let color = "white";
    if (profFound) {
      const originalName = prof.innerHTML;
      const fullName = originalName.toLowerCase();
      const splitName = fullName.split(",");
      const shortName = splitName[0] + "," + splitName[1].split(" ")[0];

      if (fullName in data) {
        if (data[fullName]["profRating"] !== -1.0) {
          rating = data[fullName]["profRating"].toFixed(1) + " / 5.0";
          color = colorMapping[data[fullName]["profRatingClass"]];
          prof.innerHTML = `<a target="_blank" rel="noopener noreferrer">${originalName}</a>`;
          prof.children[0].href = data[fullName]["profUrl"];
        }
      } else if (shortName in data) {
        if (data[shortName]["profRating"] !== -1.0) {
          rating = data[shortName]["profRating"].toFixed(1) + " / 5.0";
          color = colorMapping[data[shortName]["profRatingClass"]];
          prof.innerHTML = `<a target="_blank" rel="noopener noreferrer">${originalName}</a>`;
          prof.children[0].href = data[shortName]["profUrl"];
        }
      }
    }
    row.children[7].children[0].children[0].children[0].innerHTML = rating;
    row.children[7].style.fontWeight = "bold";
    row.children[7].style.backgroundColor = color;
  }
}
