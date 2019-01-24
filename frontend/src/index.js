document.addEventListener("DOMContentLoaded", e => {
    console.log("DOM fully loaded and parsed");
    const renderedBoard = document.querySelector("#boardtable")
    const tileHolder = document.querySelector("#tile-holder")
    const submitBtn = document.querySelector("#submit-btn")
    const buttons = tileHolder.getElementsByTagName("button")
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
    let currentPlayer = user1;
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
            activeBtnId = e.target.dataset.id
            activeTile = user1.tiles[activeBtnId]
         } else if(e.target.tagName === "SPAN"){
            activeBtnId = e.target.parentElement.dataset.id
            activeTile = user1.tiles[activeBtnId]
         }
    })

    renderedBoard.addEventListener('click', e => {
        if(activeTile !== 0){
            const pickedLetter = `
            <div class="ScrabbleBlock">
            <span class="ScrabbleLetter">${activeTile.letter}</span>
            <span class="ScrabbleNumber">${activeTile.value}</span>
            </div>`

            if(e.target.tagName === "TD"){
                const row = e.target.parentNode.id
                const col = e.target.id
                let foundTile = false;
                for (var i = 0; i < currentlyPlayedTiles.length; i++) {
                  if (currentlyPlayedTiles[i][0] === activeTile){
                    foundTile = true
                  }
                }

              if (foundTile === false) {
                  currentlyPlayedTiles.push([activeTile, row, col])
                  e.target.innerHTML = pickedLetter
              }
              activeTile = 0
            }
        } else {
            if(e.target.tagName === "SPAN"){
                const row = e.target.parentNode.parentElement.parentElement.id
                const col = e.target.parentNode.parentElement.id

                for (var i = 0; i < currentlyPlayedTiles.length; i++) {
                    if(currentlyPlayedTiles[i][1] == row && currentlyPlayedTiles[i][2] == col ){
                        currentlyPlayedTiles.splice(i, 1)
                    }
                }

                e.target.parentNode.remove()
            }
        }
        console.log(currentlyPlayedTiles)
    })

      submitBtn.addEventListener('click', e => {
          let points = calculatePoints(currentlyPlayedTiles, user1)
          console.log(user1.score);
      })

});
