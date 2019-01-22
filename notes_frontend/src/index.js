document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM fully loaded and parsed");
    const board = document.querySelector("#boardtable")

    board.addEventListener('click', (e) => {
      const pickedLetter = `<div><span class="ScrabbleLetter">B</span>
      <span class="ScrabbleNumber">1</span></div>`
        if(e.target.tagName === "SPAN"){
          console.log(e.target.parentNode)
          e.target.parentNode.remove()
        } else if(e.target.tagName === "TD"){
          e.target.innerHTML = pickedLetter
        }
    })
});
