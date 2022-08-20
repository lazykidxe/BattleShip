document.addEventListener('DOMContentLoaded', () => {
  const userGrid = document.querySelector('.grid-user')
  const computerGrid = document.querySelector('.grid-computer')
  const userSquares = []
  const computerSquares = []
  const width = 10

  const displayGrid = document.querySelector('.grid-display')
  const ships = document.querySelectorAll('.ship')

  let isHorizontal = true
  let isGameOver = false
  let allShipsPlaced = false

  const setupButtons = document.getElementById('setup-buttons')
  const startButton = document.querySelector('#start')
  const rotateButton = document.querySelector('#rotate')

  const destroyer = document.querySelector('.destroyer-container')
  const submarine = document.querySelector('.submarine-container')
  const cruiser = document.querySelector('.cruiser-container')
  const battleship = document.querySelector('.battleship-container')
  const carrier = document.querySelector('.carrier-container')

  const turnDisplay = document.querySelector('#whose-go')
  const infoDisplay = document.querySelector('#info')

  let currentPlayer = 'user'
  let shotFired = -1
  let gameMode = 'singlePlayer'

  const homeButton = document.getElementById('home');
  const announcement = document.getElementById('announcement')

  /*----------------------------------------------- */
  /*Generate the ocrean map and call it when launches */
  turnDisplay.innerHTML = "";
  createBoard(userGrid, userSquares)
  createBoard(computerGrid, computerSquares)



  function createBoard(grid, squares) {
    for (let i = 0; i < width*width; i++) {
      const square = document.createElement('div')
      square.dataset.id = i
      grid.appendChild(square)
      squares.push(square)
    }
  }

  /*----------------------------------------------- */
  //draggable ships//
  ships.forEach(ship => ship.addEventListener('dragstart', dragStart))
  userSquares.forEach(square => square.addEventListener('dragstart', dragStart))
  userSquares.forEach(square => square.addEventListener('dragover', dragOver))
  userSquares.forEach(square => square.addEventListener('dragenter', dragEnter))
  userSquares.forEach(square => square.addEventListener('dragleave', dragLeave))
  userSquares.forEach(square => square.addEventListener('drop', dragDrop))
  userSquares.forEach(square => square.addEventListener('dragend', dragEnd))

  let selectedShipNameWithIndex
  let draggedShip
  let draggedShipLength

  ships.forEach(ship => ship.addEventListener('mousedown', (e) => {
    selectedShipNameWithIndex = e.target.id
  }))

  function dragStart() {
    draggedShip = this
    draggedShipLength = this.childNodes.length
  }

  function dragOver(e) {
    e.preventDefault()
  }

  function dragEnter(e) {
    e.preventDefault()
  }

  function dragLeave() {
  }


/*---------------------------------------------------------------------*/
//releases the ship on the player map, it will drops the ship inside the grid 
//ships only can be place on player map not on the computer map
//check if all player ships are used 
function dragDrop() {
  let shipNameWithLastId = draggedShip.lastChild.id
  let shipClass = shipNameWithLastId.slice(0, -2)

  let lastShipIndex = parseInt(shipNameWithLastId.substr(-1))
  let shipLastId = lastShipIndex + parseInt(this.dataset.id)

  const notAllowedHorizontal = [0,10,20,30,40,50,60,70,80,90,1,11,21,31,41,51,61,71,81,91,2,22,32,42,52,62,72,82,92,3,13,23,33,43,53,63,73,83,93]
  const notAllowedVertical = [99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70,69,68,67,66,65,64,63,62,61,60]
  
  let newNotAllowedHorizontal = notAllowedHorizontal.splice(0, 10 * lastShipIndex)
  let newNotAllowedVertical = notAllowedVertical.splice(0, 10 * lastShipIndex)

  selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1))

  shipLastId = shipLastId - selectedShipIndex

  if (isHorizontal && !newNotAllowedHorizontal.includes(shipLastId)) {
    for (let i=0; i < draggedShipLength; i++) {
      let directionClass
      if (i === 0) directionClass = 'start'
      if (i === draggedShipLength - 1) directionClass = 'end'
      userSquares[parseInt(this.dataset.id) - selectedShipIndex + i].classList.add('taken', 'horizontal', directionClass, shipClass)
    }
  } else if (!isHorizontal && !newNotAllowedVertical.includes(shipLastId)) {
    for (let i=0; i < draggedShipLength; i++) {
      let directionClass
      if (i === 0) directionClass = 'start'
      if (i === draggedShipLength - 1) directionClass = 'end'
      userSquares[parseInt(this.dataset.id) - selectedShipIndex + width*i].classList.add('taken', 'vertical', directionClass, shipClass)
    }
  } else return

  displayGrid.removeChild(draggedShip)
  if(!displayGrid.querySelector('.ship')) allShipsPlaced = true
}

function dragEnd() {
}

/*------------------------------------------------------------------------------------------*/
//Rotate player ships  ( when rotate button is clicked)

function rotate() {
  if (isHorizontal) {
    destroyer.classList.toggle('destroyer-container-vertical')
    submarine.classList.toggle('submarine-container-vertical')
    cruiser.classList.toggle('cruiser-container-vertical')
    battleship.classList.toggle('battleship-container-vertical')
    carrier.classList.toggle('carrier-container-vertical')
    isHorizontal = false
    return
  }
  if (!isHorizontal) {
    destroyer.classList.toggle('destroyer-container-vertical')
    submarine.classList.toggle('submarine-container-vertical')
    cruiser.classList.toggle('cruiser-container-vertical')
    battleship.classList.toggle('battleship-container-vertical')
    carrier.classList.toggle('carrier-container-vertical')
    isHorizontal = true
    return
  }
}
rotateButton.addEventListener('click', rotate)


/*------------------------------------------------------------------------------------------- */
//Randomly place 5 ships on computer ocrean map ( when start button is clicked)

  // startButton.addEventListener('click', ()=>{
  //   if(allShipsPlaced) startGame()
  //   else alert("Please make sure all ships are placed before starting the game")
  // });

  const shipArray = [
    {
      name: 'destroyer',
      directions: [
        [0, 1],
        [0, width]
      ]
    },
    {
      name: 'submarine',
      directions: [
        [0, 1, 2],
        [0, width, width*2]
      ]
    },
    {
      name: 'cruiser',
      directions: [
        [0, 1, 2],
        [0, width, width*2]
      ]
    },
    {
      name: 'battleship',
      directions: [
        [0, 1, 2, 3],
        [0, width, width*2, width*3]
      ]
    },
    {
      name: 'carrier',
      directions: [
        [0, 1, 2, 3, 4],
        [0, width, width*2, width*3, width*4]
      ]
    },
  ]

  startButton.addEventListener('click', ()=>{
    if(allShipsPlaced) startGame()
    else alert("Please make sure all ships are placed before starting the game")
  });

  function startGame() {
    generate(shipArray[0])
    generate(shipArray[1])
    generate(shipArray[2])
    generate(shipArray[3])
    generate(shipArray[4])

   
    playGameSingle()
    rotateButton.disabled = true;
    startButton.disabled = true;

    
  }

  function generate(ship) {
    let randomDirection = Math.floor(Math.random() * ship.directions.length)
    let current = ship.directions[randomDirection]
    if (randomDirection === 0) direction = 1
    if (randomDirection === 1) direction = 10
    let randomStart = Math.abs(Math.floor(Math.random() * computerSquares.length - (ship.directions[0].length * direction)))

    const isTaken = current.some(index => computerSquares[randomStart + index].classList.contains('taken'))
    const isAtRightEdge = current.some(index => (randomStart + index) % width === width - 1)
    const isAtLeftEdge = current.some(index => (randomStart + index) % width === 0)

    if (!isTaken && !isAtRightEdge && !isAtLeftEdge) current.forEach(index => computerSquares[randomStart + index].classList.add('taken', ship.name))

    else generate(ship)
  }

/*---------------------------------------------------------------------------------------------*/
//Attacking system (Take turn between player and computer)


function playGameSingle() {
  if (isGameOver) return
  if (currentPlayer === 'user') {
    turnDisplay.innerHTML = 'Your Go'
    computerSquares.forEach(square => square.addEventListener('click', function(e) {
      shotFired = square.dataset.id
      revealSquare(square.classList)
    }))
  }
  if (currentPlayer === 'enemy') {
    turnDisplay.innerHTML = 'Computers Go'
    setTimeout(enemyGo, 1000)
  }
}

let destroyerCount = 0
let submarineCount = 0
let cruiserCount = 0
let battleshipCount = 0
let carrierCount = 0

function revealSquare(classList) {
  const enemySquare = computerGrid.querySelector(`div[data-id='${shotFired}']`)
  const obj = Object.values(classList)
  if (!enemySquare.classList.contains('boom') && currentPlayer === 'user' && !isGameOver) {
    if (obj.includes('destroyer')) destroyerCount++
    if (obj.includes('submarine')) submarineCount++
    if (obj.includes('cruiser')) cruiserCount++
    if (obj.includes('battleship')) battleshipCount++
    if (obj.includes('carrier')) carrierCount++
  }
  if (obj.includes('taken')) {
    enemySquare.classList.add('boom')
  } else {
    enemySquare.classList.add('miss')
  }
  checkWin()
  console.log('computer go')
  currentPlayer = 'enemy'
  if(gameMode === 'singlePlayer') playGameSingle()
}

let cpuDestroyerCount = 0
let cpuSubmarineCount = 0
let cpuCruiserCount = 0
let cpuBattleshipCount = 0
let cpuCarrierCount = 0


function enemyGo(square) {
  square = Math.floor(Math.random() * userSquares.length)
  if (!userSquares[square].classList.contains('boom')) {
    const hit = userSquares[square].classList.contains('taken')
    userSquares[square].classList.add(hit ? 'boom' : 'miss')
    if (userSquares[square].classList.contains('destroyer')) cpuDestroyerCount++
    if (userSquares[square].classList.contains('submarine')) cpuSubmarineCount++
    if (userSquares[square].classList.contains('cruiser')) cpuCruiserCount++
    if (userSquares[square].classList.contains('battleship')) cpuBattleshipCount++
    if (userSquares[square].classList.contains('carrier')) cpuCarrierCount++
  
    console.log('you turn')
  } else if (gameMode === 'singlePlayer') enemyGo()
  currentPlayer = 'user'
  turnDisplay.innerHTML = 'Your Go'
  checkWin()
}


/*---------------------------------------------------------------------------*/
//Win condition

function checkWin(){
  console.log("destroyerCount" + destroyerCount)
  console.log("submarineCount" + submarineCount)
  console.log("cruiserCount" + cruiserCount)
  console.log("battleshipCount" + battleshipCount)
  console.log("carrierCount" + carrierCount)

  if(destroyerCount == 2) {
    announcement.innerHTML = "Enemy destroyer was destroyed!";
  }
  if(cpuDestroyerCount == 2) {
    announcement.innerHTML = "Your destroyer was destroyed!";
  }
  if(submarineCount == 3) {
    announcement.innerHTML = "Enemy submarine was destroyed!";
  }
  if(cpuSubmarineCount == 3) {
    announcement.innerHTML = "Your submarine was destroyed!";
  }
  if(cruiserCount == 3) {
    announcement.innerHTML = "Enemy cruiser was destroyed!";
  }
  if(cpuCruiserCount == 3) {
    announcement.innerHTML = "Your cruiser was destroyed!";
  }
  if(battleshipCount == 4) {
    announcement.innerHTML = "Enemy battleship was destroyed!";
  }
  if(cpuBattleshipCount == 4) {
    announcement.innerHTML = "Your battleship was destroyed!";
  }
  if(carrierCount == 5) {
    announcement.innerHTML = "Enemy carrier was destroyed!";
  }
  if(cpuCarrierCount == 5) {
    announcement.innerHTML = "Your carrier was destroyed!";
  }
  if((destroyerCount + submarineCount + cruiserCount + battleshipCount + carrierCount) === 17 ){
    console.log("Player wins!")
    gameOver();
  }
  if((cpuDestroyerCount + cpuSubmarineCount + cpuCruiserCount + cpuBattleshipCount + cpuCarrierCount) === 17){
    console.log("Computer wins!")
    gameOver();
  }
}


function gameOver(){
  isGameOver = true
  turnDisplay.innerHTML = "Game Over! Click below go to the main page"
  playGameSingle.disabled = true;
}

})

