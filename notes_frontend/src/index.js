document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM fully loaded and parsed");
    const board = document.querySelector("#boardtable")

    board.addEventListener('click', (e) => {
      e.target.innerHTML = `<div>
        <span class="ScrabbleLetter">A</span>
        <span class="ScrabbleNumber">1</span>
      </div>`
    })
});
