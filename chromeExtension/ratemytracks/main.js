const colorMapping = {
  poor: "#ea373d",
  average: "#FFF27D",
  good: "#6BD175",
};

var loadObserver = new MutationObserver((changes) => {
  changes.forEach((change) => {
    if (
      change.removedNodes.length === 1 &&
      change.removedNodes[0].textContent === "Loading Complete" &&
      document.querySelector(".ps_grid-col.INSTRUCTOR") !== null &&
      document.querySelector(".psc_invisible") === null
    ) {
      setUp();
    }
  });
});

var initialObserver = new MutationObserver(() => {
  if (
    document.querySelector(".ps_grid-col.INSTRUCTOR") !== null &&
    document.querySelector(".psc_invisible") === null
  ) {
    setUp();
    initialObserver.disconnect();
    const showMore = document.querySelector("#SSR_CLSRCH_F_WK_SSR_CHANGE_BTN");
    if (showMore !== null) {
      showMore.addEventListener("click", () => {
        loadObserver.observe(document.body, {
          childList: true,
          subtree: true,
        });
      });
    }
  }
});

try {
  initialObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
} catch (error) {
  console.warn(error);
}

function setUp() {
  chrome.storage.sync.get("enabled", (data) => {
    if (Boolean(data.enabled)) {
      fetch(chrome.runtime.getURL("profData.json"))
        .then((resp) => resp.json())
        .then((data) => {
          const table = document.querySelector(".ps_grid-flex");
          const head = table.firstElementChild.firstElementChild;
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
    row.children[7].firstElementChild.appendChild(
      document.createElement("div")
    );
    row.children[7].firstElementChild.firstElementChild.appendChild(
      document.createElement("span")
    );
    row.children[7].className = "ps_grid-cell RATING";

    const profNames =
      row.querySelector(".INSTRUCTOR").firstElementChild.children;
    let profFound = false;
    let prof = null;
    for (x of profNames) {
      if (
        x.firstElementChild.innerHTML !== "Staff" &&
        x.firstElementChild.innerHTML !== "To be Announced"
      ) {
        prof = x.firstElementChild;
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
          prof.firstElementChild.href = data[fullName]["profUrl"];
        }
      } else if (shortName in data) {
        if (data[shortName]["profRating"] !== -1.0) {
          rating = data[shortName]["profRating"].toFixed(1) + " / 5.0";
          color = colorMapping[data[shortName]["profRatingClass"]];
          prof.innerHTML = `<a target="_blank" rel="noopener noreferrer">${originalName}</a>`;
          prof.firstElementChild.href = data[shortName]["profUrl"];
        }
      }
    }
    row.children[7].firstElementChild.firstElementChild.firstElementChild.innerHTML =
      rating;
    row.children[7].style.fontWeight = "bold";
    row.children[7].style.backgroundColor = color;
  }
}
