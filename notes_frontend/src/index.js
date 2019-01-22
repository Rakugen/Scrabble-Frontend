document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM fully loaded and parsed");
    const board = document.querySelector("#boardtable")

    board.addEventListener('click', (e) => {
      e.target.innerHTML = "A"
    })
});
