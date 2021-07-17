instructors = document.getElementsByClassName("ps_grid-col INSTRUCTOR");

if (instructors.length) {
  fetch(chrome.runtime.getURL("profData.json"))
    .then((resp) => resp.json())
    .then((data) => {
      const table = document.getElementsByClassName("ps_grid-flex")[0];
      const head = table.children[0].children[0];
      const rows = table.children[1].children;

      addRatingHeader(head);
      addRowRating(rows, data);
    })
    .catch((err) => console.err(err));
}

function addRatingHeader(head) {
  head.insertCell(7).outerHTML = "<th>Rating</th>";
  head.children[7].classList.add("ps_grid-col");
}

function addRowRating(rows, data) {
  for (row of rows) {
    row.insertCell(7);
    row.children[7].outerHTML = "<td><div><div><span></span></div></div></td>";
    row.children[7].className = "ps_grid-cell RATING psc_valign-top";

    // const seats = row.querySelector(".SEATS").children[0].children[0]

    const fullName = row
      .querySelector(".INSTRUCTOR")
      .children[0].children[0].children[0].innerHTML.toLowerCase();
    const splitName = fullName.split(",");
    const shortName = splitName[0] + "," + splitName[1].split(" ")[0];

    let rating = "N/A";
    if (fullName in data) {
      if (data[fullName]["profRating"] !== -1.0) {
        rating = data[fullName]["profRating"].toFixed(1);
      }
    } else if (shortName in data) {
      if (data[shortName]["profRating"] !== -1.0) {
        rating = data[shortName]["profRating"].toFixed(1);
      }
    }
    row.children[7].innerHTML = rating;
  }
}
