document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM fully loaded and parsed");
    const board = document.querySelector("#box-table-b")

    board.addEventListener('click', (e) => {
      console.log(e.target)
      e.target.innerHTML = `<div>
        <span class="ScrabbleLetter">O</span>
        <span class="ScrabbleNumber">1</span>
      </div>`
    })
});
