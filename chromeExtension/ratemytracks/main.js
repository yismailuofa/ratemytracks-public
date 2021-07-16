instructors = document.getElementsByClassName("ps_grid-col INSTRUCTOR")

if (instructors.length) {
    table = document.getElementsByClassName("ps_grid-flex")[0]
    head = table.children[0].children[0]
    body = table.children[1].children[0]

    ratingHeader = head.insertCell(7)
    ratingHeader.outerHTML = "<th>Rating</th>"
    head.children[7].classList.add("ps_grid-col")
}