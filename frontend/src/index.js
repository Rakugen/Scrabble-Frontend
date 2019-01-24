document.addEventListener("DOMContentLoaded", e => {
    console.log("DOM fully loaded and parsed");
    const renderedBoard = document.querySelector("#boardtable")
    const tileHolder = document.querySelector("#tile-holder")
    const submitBtn = document.querySelector("#submit-btn")
    let user1;
    let user2;
    let board = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    let bag;
    let tiles;
    let activeTile;
    let currentlyPlayedTiles = []

    fetch(`http://localhost:3000//api/v1/games`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body:JSON.stringify({
            "user1": "Woody",
            "user2": "Buzz"
        })
    })
    .then(res => res.json())
    .then(res => {
        user1 = res[0]
        user2 = res[1]
        bag = res[2]
        tiles = bag.tiles
        console.log(user1, user2, bag, board, tiles)
        refillHand(user1)
    })

    function refillHand(user){
        for(let i = user.tiles.length; i < 7; i++){
            dealLetter(user)
        }

        displayLetters(user)
    }

    function dealLetter(user){
        let rand = Math.floor(Math.random() * bag.tiles.length)

        tile = tiles.splice(rand, 1)
        user.tiles.push(tile[0])
        bag.num_tiles -= 1
    }

    function displayLetters(user){
        for(let i = 0; i < user.tiles.length; i++){
            tileHolder.innerHTML += `
            <button type="button" name="button" data-id="${i}" class="col2 letter-select">
                <span class="ScrabbleLetter1">${user.tiles[i].letter}</span>
                <span class="ScrabbleNumber1">${user.tiles[i].value}</span>
            </button>
            `
        }
    }

    function calculatePoints(array, user){
        array.forEach(data => {
            user.score += data[0].value
        })
    }

    tileHolder.addEventListener('click', e => {

        if(e.target.tagName === "BUTTON"){
          console.log(e.target)
            activeTile = user1.tiles[e.target.dataset.id]
        } else if(e.target.parentNode.tagName === "BUTTON"){
            console.log(e.target.parentNode)
            activeTile = user1.tiles[e.target.parentNode.dataset.id]
        }
    })

    renderedBoard.addEventListener('click', e => {
        const pickedLetter = `
            <div>
                <span class="ScrabbleLetter">${activeTile.letter}</span>
                <span class="ScrabbleNumber">${activeTile.value}</span>
            </div>`

        if(e.target.tagName === "SPAN"){
            const row = e.target.parentNode.parentElement.parentElement.id
            const col = e.target.parentNode.parentElement.id

            for (var i = 0; i < currentlyPlayedTiles.length; i++) {
                if(currentlyPlayedTiles[i][1] == row && currentlyPlayedTiles[i][2] == col ){
                    currentlyPlayedTiles.splice(i, 1)
                }
            }

            e.target.parentNode.remove()

        } else if(e.target.tagName === "TD"){
            const row = e.target.parentNode.id
            const col = e.target.id

            currentlyPlayedTiles.push([activeTile, row, col])
            e.target.innerHTML = pickedLetter
        }
    })

      submitBtn.addEventListener('click', e => {
          let points = calculatePoints(currentlyPlayedTiles, user1)
          console.log(user1.score);
      })

});
