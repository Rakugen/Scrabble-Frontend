document.addEventListener("DOMContentLoaded", e => {
    console.log("DOM fully loaded and parsed");
    const renderedBoard = document.querySelector("#boardtable");
    const tileHolder = document.querySelector("#tile-holder");
    const submitBtn = document.querySelector("#submit-btn");
    const buttons = tileHolder.getElementsByTagName("button");
    const scoreBoard = document.querySelector("#score-board");
    const options = document.querySelector("#options");
    const modal = document.querySelector('#myModal');
    const newGameForm = document.querySelector("#new-form");
    const newGameBtn = document.querySelector("#new-btn");
    let user1Input = document.querySelector("#user1-input");
    let user2Input = document.querySelector("#user2-input");
    let user1;
    let user2;
    let board = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    let bag;
    let tiles;
    let activeTile;
    let currentPlayer;
    let currentlyPlayedTiles = [];
    let foundLetters = [];
    let direction;
    let addedWord = false;

    function newGame(name1, name2){
        fetch(`http://localhost:3000//api/v1/games`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body:JSON.stringify({
                "user1": name1,
                "user2": name2
            })
        })
        .then(res => res.json())
        .then(res => {
            user1 = res[0]
            user2 = res[1]
            bag = res[2]
            tiles = bag.tiles
            currentPlayer = user1
            console.log(user1, user2, bag, board, tiles)
            createScoreboard()
        })
    }



    function createScoreboard(){
      if( currentPlayer === user1){
        scoreBoard.innerHTML = `<div data-id=${user1.id}>
              <h1><i class="arrow right"></i>  ${user1.name}</h1>
                <h2>${user1.score}</h2>
            </div>
            <div data-id=${user2.id}>
                <h1>${user2.name}</h1>
                <h2>${user2.score}</h2>
            </div>`
      } else if ( currentPlayer === user2){
        scoreBoard.innerHTML = `<div data-id=${user1.id}>
                <h1>${user1.name}</h1>
                <h2>${user1.score}</h2>
            </div>
            <div data-id=${user2.id}>
                <h1><i class="arrow right"></i>  ${user2.name}</h1>
                <h2>${user2.score}</h2>
            </div>`
      }
    }

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
        tileHolder.innerHTML = ""
        for(let i = 0; i < user.tiles.length; i++){
            tileHolder.innerHTML += `
            <button type="button" name="button" data-id="${i}" class="col2 letter-select ScrabbleBlock">
                <span class="ScrabbleLetter1">${user.tiles[i].letter}</span>
                <span class="ScrabbleNumber1">${user.tiles[i].value}</span>
            </button>
            `
        }
    }

    function calculatePoints(array, user){
        array.forEach(data => {
            user.score += data.value
        })
    }

    function removePlayerTiles(user){
        for(let i = 0; i < currentlyPlayedTiles.length; i++){
            for(let j = 0; j < user.tiles.length; j++){
                if(currentlyPlayedTiles[i][0] === user.tiles[j]){
                    const tempTile = user.tiles.splice(j, 1)
                    board[currentlyPlayedTiles[i][1]][currentlyPlayedTiles[i][2]] = tempTile[0]
                }
            }
        }
    }

    function findDirection(array){
      if (array[0][1] === array[1][1]){
        return "horizontal"
      } else {
        return "vertical"
      }
    }

    function verticalSideWords(letter){
      let coordinate = [letter[1], letter[2]]
      ++coordinate[0]
      while(board[coordinate[0]][coordinate[1]] !== 0 ) {
        foundLetters.push(board[coordinate[0]][coordinate[1]])
        addedWord = true;
        if(coordinate[0] == 15){
          break
        } else {
          ++coordinate[0]
        }
      }
      coordinate = [letter[1], letter[2]]
      --coordinate[0]
      while(board[coordinate[0]][coordinate[1]] !== 0) {
        foundLetters.unshift(board[coordinate[0]][coordinate[1]])
        addedWord = true;
        --coordinate[0]
      }
    }

    function horizontalSideWords(letter){
      let coordinate = [letter[1], letter[2]]
      ++coordinate[1]
      while(board[coordinate[0]][coordinate[1]] !== 0 ) {
        foundLetters.push(board[coordinate[0]][coordinate[1]])
        addedWord = true;
        if(coordinate[1] == 15){
          break
        } else {
          ++coordinate[1]
        }
      }
      coordinate = [letter[1], letter[2]]
      --coordinate[1]
      while(board[coordinate[0]][coordinate[1]] !== 0) {
        foundLetters.unshift(board[coordinate[0]][coordinate[1]])
        addedWord = true;
        --coordinate[1]
      }
    }

    function verticalFindWord(array){
      let coordinate = [array[0][1], array[0][2]]
      while(board[coordinate[0]][coordinate[1]] !== 0 ) {
        foundLetters.push(board[coordinate[0]][coordinate[1]])
        if(coordinate[0] == 15){
          break
        } else {
          ++coordinate[0]
        }
      }
      coordinate = [array[0][1], array[0][2]]
      --coordinate[0]
      while(board[coordinate[0]][coordinate[1]] !== 0) {
        foundLetters.unshift(board[coordinate[0]][coordinate[1]])
        --coordinate[0]
      }
    }

    function horizontalFindWord(array){
      let coordinate = [array[0][1], array[0][2]]
      while(board[coordinate[0]][coordinate[1]] !== 0 ) {
        foundLetters.push(board[coordinate[0]][coordinate[1]])
        if(coordinate[1] == 15){
          break
        } else {
          ++coordinate[1]
        }
      }
      coordinate = [array[0][1], array[0][2]]
      --coordinate[1]
      while(board[coordinate[0]][coordinate[1]] !== 0) {
        foundLetters.unshift(board[coordinate[0]][coordinate[1]])
        --coordinate[1]
      }
    }

    tileHolder.addEventListener('click', e => {
        for (i of buttons) {
            i.style.borderColor = 'white'
        }

        if(e.target.tagName === "BUTTON"){
            e.target.style.borderColor = 'green'
            e.target.style.borderWidth = '4px'
            e.target.style.borderStyle = 'solid'

            activeTile = currentPlayer.tiles[e.target.dataset.id]

        } else if(e.target.tagName === "SPAN"){
            e.target.parentElement.style.borderColor = 'green'
            e.target.parentElement.style.borderWidth = '4px'
            e.target.parentElement.style.borderStyle = 'solid'

            activeTile = currentPlayer.tiles[e.target.parentElement.dataset.id]
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
              for (i of buttons) {
                  i.style.borderColor = 'white'
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

        if (currentlyPlayedTiles.length >= 2){
          direction = findDirection(currentlyPlayedTiles)
        }

        if(direction === "horizontal"){
          currentlyPlayedTiles.sort(function(a, b){
            return a[2] - b[2]
          })
        } else if(direction === "vertical") {
          currentlyPlayedTiles.sort(function(a, b){
            return a[1] - b[1]
          })
        }
    })

    options.addEventListener('click', e => {
        if(e.target.innerHTML === "Submit"){
            console.log(direction)
            removePlayerTiles(currentPlayer)
            if (direction === "horizontal"){
              horizontalFindWord(currentlyPlayedTiles)
              for(let i = 0; i < currentlyPlayedTiles.length; i++){
                verticalSideWords(currentlyPlayedTiles[i])
                if(addedWord === true){
                  foundLetters.push(currentlyPlayedTiles[i][0])
                  addedWord = false;
                }
              }
            } else {
              verticalFindWord(currentlyPlayedTiles)
              for(let i = 0; i < currentlyPlayedTiles.length; i++){
                horizontalSideWords(currentlyPlayedTiles[i])
                if(addedWord === true){
                  foundLetters.push(currentlyPlayedTiles[i][0])
                  addedWord = false;
                }
              }
            }
            calculatePoints(foundLetters, currentPlayer)
            console.log(foundLetters)
            foundLetters = []
            currentlyPlayedTiles = []
            activeTile = 0
            tileHolder.innerHTML = ""
            currentPlayer === user1 ? currentPlayer = user2 : currentPlayer = user1
            createScoreboard()
        } else if(e.target.innerHTML === "Ready"){
            refillHand(currentPlayer)
      }
    })

    newGameBtn.addEventListener("click", (e) => {
        modal.style.display = "block"
    })

    newGameForm.addEventListener("submit", e => {
        e.preventDefault()
        const user1Name = user1Input.value
        const user2Name = user2Input.value

        modal.style.display = "none"
        boardtable.innerHTML = `<tbody><tr id="1">
            <td id="1" class="tripleWord">
            </td><td id="2">
            </td><td id="3">
            </td><td id="4" class="doubleLetter">
            </td><td id="5">
            </td><td id="6">
            </td><td id="7">
            </td><td id="8" class="tripleWord">
            </td><td id="9">
            </td><td id="10">
            </td><td id="11">
            </td><td id="12" class="doubleLetter">
            </td><td id="13">
            </td><td id="14">
            </td><td id="15" class="tripleWord">
          </td></tr><tr id="2">
            <td id="1">
            </td><td id="2" class="doubleWord">
            </td><td id="3">
            </td><td id="4">
            </td><td id="5">
            </td><td id="6" class="tripleLetter">
            </td><td id="7">
            </td><td id="8">
            </td><td id="9">
            </td><td id="10" class="tripleLetter">
            </td><td id="11">
            </td><td id="12">
            </td><td id="13">
            </td><td id="14" class="doubleWord">
            </td><td id="15">
          </td></tr><tr id="3">
            <td id="1">
            </td><td id="2">
            </td><td id="3" class="doubleWord">
            </td><td id="4">
            </td><td id="5">
            </td><td id="6">
            </td><td id="7" class="doubleLetter">
            </td><td id="8">
            </td><td id="9" class="doubleLetter">
            </td><td id="10">
            </td><td id="11">
            </td><td id="12">
            </td><td id="13" class="doubleWord">
            </td><td id="14">
            </td><td id="15">
          </td></tr><tr id="4">
            <td id="1" class="doubleLetter">
            </td><td id="2">
            </td><td id="3">
            </td><td id="4" class="doubleWord">
            </td><td id="5">
            </td><td id="6">
            </td><td id="7">
            </td><td id="8" class="doubleLetter">
            </td><td id="9">
            </td><td id="10">
            </td><td id="11">
            </td><td id="12" class="doubleWord">
            </td><td id="13">
            </td><td id="14">
            </td><td id="15" class="doubleLetter">
          </td></tr><tr id="5">
            <td id="1">
            </td><td id="2">
            </td><td id="3">
            </td><td id="4">
            </td><td id="5" class="doubleWord">
            </td><td id="6">
            </td><td id="7">
            </td><td id="8">
            </td><td id="9">
            </td><td id="10">
            </td><td id="11" class="doubleWord">
            </td><td id="12">
            </td><td id="13">
            </td><td id="14">
            </td><td id="15">
          </td></tr><tr id="6">
            <td id="1">
            </td><td id="2" class="tripleLetter">
            </td><td id="3">
            </td><td id="4">
            </td><td id="5">
            </td><td id="6" class="tripleLetter">
            </td><td id="7">
            </td><td id="8">
            </td><td id="9">
            </td><td id="10" class="tripleLetter">
            </td><td id="11">
            </td><td id="12">
            </td><td id="13">
            </td><td id="14" class="tripleLetter">
            </td><td id="15">
          </td></tr><tr id="7">
            <td id="1">
            </td><td id="2">
            </td><td id="3" class="doubleLetter">
            </td><td id="4">
            </td><td id="5">
            </td><td id="6">
            </td><td id="7" class="doubleLetter">
            </td><td id="8">
            </td><td id="9" class="doubleLetter">
            </td><td id="10">
            </td><td id="11">
            </td><td id="12">
            </td><td id="13" class="doubleLetter">
            </td><td id="14">
            </td><td id="15">
          </td></tr><tr id="8">
            <td id="1" class="tripleWord">
            </td><td id="2">
            </td><td id="3">
            </td><td id="4" class="doubleLetter">
            </td><td id="5">
            </td><td id="6">
            </td><td id="7">
            </td><td id="8" class="starterSpot">
            </td><td id="9">
            </td><td id="10">
            </td><td id="11">
            </td><td id="12" class="doubleLetter">
            </td><td id="13">
            </td><td id="14">
            </td><td id="15" class="tripleWord">
          </td></tr><tr id="9">
            <td id="1">
            </td><td id="2">
            </td><td id="3" class="doubleLetter">
            </td><td id="4">
            </td><td id="5">
            </td><td id="6">
            </td><td id="7" class="doubleLetter">
            </td><td id="8">
            </td><td id="9" class="doubleLetter">
            </td><td id="10">
            </td><td id="11">
            </td><td id="12">
            </td><td id="13" class="doubleLetter">
            </td><td id="14">
            </td><td id="15">
          </td></tr><tr id="10">
            <td id="1">
            </td><td id="2" class="tripleLetter">
            </td><td id="3">
            </td><td id="4">
            </td><td id="5">
            </td><td id="6" class="tripleLetter">
            </td><td id="7">
            </td><td id="8">
            </td><td id="9">
            </td><td id="10" class="tripleLetter">
            </td><td id="11">
            </td><td id="12">
            </td><td id="13">
            </td><td id="14" class="tripleLetter">
            </td><td id="15">
          </td></tr><tr id="11">
            <td id="1">
            </td><td id="2">
            </td><td id="3">
            </td><td id="4">
            </td><td id="5" class="doubleWord">
            </td><td id="6">
            </td><td id="7" class="doubleLetter">
            </td><td id="8">
            </td><td id="9" class="doubleLetter">
            </td><td id="10">
            </td><td id="11" class="doubleWord">
            </td><td id="12">
            </td><td id="13">
            </td><td id="14">
            </td><td id="15">
          </td></tr><tr id="12">
            <td id="1" class="doubleLetter">
            </td><td id="2">
            </td><td id="3">
            </td><td id="4" class="doubleWord">
            </td><td id="5">
            </td><td id="6">
            </td><td id="7">
            </td><td id="8" class="doubleLetter">
            </td><td id="9">
            </td><td id="10">
            </td><td id="11">
            </td><td id="12" class="doubleWord">
            </td><td id="13">
            </td><td id="14">
            </td><td id="15" class="doubleLetter">
          </td></tr><tr id="13">
            <td id="1">
            </td><td id="2">
            </td><td id="3" class="doubleWord">
            </td><td id="4">
            </td><td id="5">
            </td><td id="6">
            </td><td id="7">
            </td><td id="8">
            </td><td id="9">
            </td><td id="10">
            </td><td id="11">
            </td><td id="12">
            </td><td id="13" class="doubleWord">
            </td><td id="14">
            </td><td id="15">
          </td></tr><tr id="14">
              <td id="1">
              </td><td id="2" class="doubleWord">
              </td><td id="3">
              </td><td id="4">
              </td><td id="5">
              </td><td id="6" class="tripleLetter">
              </td><td id="7">
              </td><td id="8">
              </td><td id="9">
              </td><td id="10" class="tripleLetter">
              </td><td id="11">
              </td><td id="12">
              </td><td id="13">
              </td><td id="14" class="doubleWord">
              </td><td id="15">
          </td></tr><tr id="15">
              <td id="1" class="tripleWord">
              </td><td id="2">
              </td><td id="3">
              </td><td id="4" class="doubleLetter">
              </td><td id="5">
              </td><td id="6">
              </td><td id="7">
              </td><td id="8" class="tripleWord">
              </td><td id="9">
              </td><td id="10">
              </td><td id="11">
              </td><td id="12" class="doubleLetter">
              </td><td id="13">
              </td><td id="14">
              </td><td id="15" class="tripleWord">

        </td></tr></tbody>`
        tileHolder.innerHTML = ""
        newGame(user1Name, user2Name)
    })

});
