document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM fully loaded and parsed");
    const board = document.querySelector("#boardtable")


    // fetch(`http://localhost:3000//api/v1/users/`, {
    //   method: "POST",
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json'
    //   },
    //   body:JSON.stringify({
    //     "name": "Connor",
    //     "score": 0,
    //     "board_id": 1,
    //     "bag_id": 1
    //   })
    // })
    // .then(res => res.json())
    // .then(res => console.log(res))

    // fetch(`http://localhost:3000//api/v1/boards/`, {
    //   method: "POST",
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json'
    //   },
    //   body:JSON.stringify({
    //     "size": 15
    //   })
    // })
    // .then(res => res.json())
    // .then(res => console.log(res))

    // fetch(`http://localhost:3000//api/v1/users/3`, {
    //   method: "PATCH",
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json'
    //   },
    //   body:JSON.stringify({
    //     "score": 5043
    //   })
    // })
    // .then(res => res.json())
    // .then(res => console.log(res))

    board.addEventListener('click', (e) => {
      const pickedLetter = `<div><span class="ScrabbleLetter">B</span>
      <span class="ScrabbleNumber">1</span></div>`
        // if(e.target.tagName === "SPAN"){
        //   console.log(e.target.parentNode)
        //   e.target.parentNode.remove()
        // } else if(e.target.tagName === "TD"){
        //   e.target.innerHTML = pickedLetter
        // }
        console.log(e.target.parentNode)
    })
});
