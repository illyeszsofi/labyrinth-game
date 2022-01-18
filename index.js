function hideStart()
{
    let x = document.getElementById("start-menu");
    if (x.style.display === "none")
    {
        x.style.display = "block";
    }
    else
    {
        x.style.display = "none";
    }
}

function showGameDescription()
{
    const description = document.querySelector("#description")
    if (description.style.display === "none")
    {
        description.style.display = "block";
    }
    else
    {
        description.style.display = "none";
    }
}

const playerAmount = document.querySelector("#player-amount")
const playerOut = document.querySelector("#p-out")
const treasureAmount = document.querySelector("#treasure-amount")
const treasureOut = document.querySelector("#t-out")
var treasureAll = "2"
var players = "2"

playerAmount.addEventListener("input", playerChange)
function playerChange()
{
    playerOut.innerText = this.value
    players = this.value
    treasureAmount.max = 24 / this.value
    treasureOut.innerText = treasureAmount.value
    treasureAll = treasureAmount.value
}
treasureAmount.addEventListener("input", treasureChange)
function treasureChange()
{
    treasureOut.innerText = this.value
    treasureAll = this.value
}

let imgArray = []
for (let i = 0; i < 34; i++)
{
    imgArray.push(i)
}

function shuffleArray(array)
{
    for (let i = array.length - 1; i > 0; i--)
    {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
shuffleArray(imgArray)
let extra = imgArray.shift()

function randomNumber(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomRotate()
{
    if (randomNumber(1, 4) === 1)
    {
        return 0
    }
    else if (randomNumber(1, 4) === 2)
    {
        return 90
    }
    else if (randomNumber(1, 4) === 3)
    {
        return 180
    }
    else
    {
        return 270
    }
}

let data = Array(7)
for (let i = 0; i < 7; i++)
{
    data[i] = Array(7)
}
for (let i = 0; i < data.length; i++)
{
    for (let j = 0; j < data.length; j++)
    {
        data[i][j] = {
            id: null,
            type: null,
            rotation: null,
            players: [],
            hasTreasure: false,
            treasure: null,
            isFixed: false,
            x: null,
            y: null
        }
    }
}

let fixedType = ["curve", "branching", "branching", "curve", "branching", "branching", "branching", "branching", "branching", "branching", "branching", "branching", "curve", "branching", "branching", "curve"]
let fixedRotation = [90, 90, 90, 180, 0, 0, 90, 180, 0, 270, 180, 180, 0, 270, 270, 270]

let playersData = [
    {
        id: document.querySelector("#player-1"),
        num: 1,
        color: "#726C91",
        isCurrent: false,
        points: 0,
        position: document.querySelector("#mPlayer-1"),
        startPos: "fix_00"
    },
    {
        id: document.querySelector("#player-2"),
        num: 2,
        color: "#726C91",
        isCurrent: false,
        points: 0,
        position: document.querySelector("#mPlayer-2"),
        startPos: "fix_06"
    },
    {
        id: document.querySelector("#player-3"),
        num: 3,
        color: "#726C91",
        isCurrent: false,
        points: 0,
        position: document.querySelector("#mPlayer-3"),
        startPos: "fix_60"
    },
    {
        id: document.querySelector("#player-4"),
        num: 4,
        color: "#726C91",
        isCurrent: false,
        points: null,
        position: document.querySelector("#mPlayer-4"),
        startPos: "fix_66"
    },
]
const playerData = document.querySelector("#player-data")
const player1 = document.querySelector("#player-1")
const player2 = document.querySelector("#player-2")
const player3 = document.querySelector("#player-3")
const player4 = document.querySelector("#player-4")

function getType(imgNumber)
{
    if (imgNumber >= 0 && imgNumber <= 12)
    {
        return "straight"
    }
    else if (imgNumber >= 13 && imgNumber <= 27)
    {
        return "curve"
    }
    else
    {
        return "branching"
    }
}

function setCurrentPlayer(playerNum)
{
    for (let i = 0; i < 4; i++)
    {
        playersData[i].isCurrent = false
        playersData[i].id.classList.remove(`current-player${i + 1}`);
    }

    if (playerNum == 1)
    {
        playersData[0].isCurrent = true
        playersData[0].id.classList.add("current-player1");
    }
    else if (playerNum == 2)
    {
        playersData[1].isCurrent = true
        playersData[1].id.classList.add("current-player2");
    }
    else if (playerNum == 3)
    {
        playersData[2].isCurrent = true
        playersData[2].id.classList.add("current-player3");
    }
    else
    {
        playersData[3].isCurrent = true
        playersData[3].id.classList.add("current-player4");
    }
}

const container = document.querySelector(".wrapper")
function makeRows(rows, cols)
{
    for (i = 0; i < rows; i++)
    {
        for (let j = 0; j < cols; j++)
        {
            let cell = document.createElement("div")
            if (i % 2 === 0 && j % 2 === 0)
            {
                cell.innerHTML = `<img src='style/fix/img_${i}${j}.png'></img>`
                cell.id = `fix_${i}${j}`

                data[i][j].id = `fix_${i}${j}`
                data[i][j].isFixed = true
                data[i][j].type = fixedType.shift()
                data[i][j].rotation = fixedRotation.shift()
            }
            else
            {
                let pop = imgArray.pop()
                let rotate = randomRotate()
                cell.innerHTML = `<img src="style/random/${pop}.png" style="transform: rotate(${rotate}deg)"></img>`
                cell.id = pop

                data[i][j].id = pop
                data[i][j].type = getType(pop)
                data[i][j].rotation = rotate
            }
            container.appendChild(cell).className = "item"
            cell.style.top = i * 70 + "px"
            cell.style.left = j * 70 + "px"

            data[i][j].x = i
            data[i][j].y = j
        }
    }
}

function startButton() 
{
    makeRows(7, 7)
    playerData.style.display = "block"
    let currPlayer = playersData[0]
    let playerMoving = false
    setCurrentPlayer(1)

    for (let i = 0; i < 7; i++)
    {
        if (i % 2 != 0)
        {
            let cell = document.createElement("div")
            cell.innerHTML = "<img src='style/arrow.png'></img>"
            container.appendChild(cell).className = "item arrow"
            cell.id = i + "_down"
            cell.style.top = -70 + "px"
            cell.style.left = i * 70 + "px"
        }
        if (i % 2 != 0)
        {
            let cell = document.createElement("div")
            cell.innerHTML = "<img src='style/arrow.png' style='transform: rotate(180deg)'></img>"
            container.appendChild(cell).className = "item arrow"
            cell.id = i + "_up"
            cell.style.top = 490 + "px"
            cell.style.left = i * 70 + "px"
        }
        if (i % 2 != 0)
        {
            let cell = document.createElement("div")
            cell.innerHTML = "<img src='style/arrow.png' style='transform: rotate(270deg)'></img>"
            container.appendChild(cell).className = "item arrow"
            cell.id = i + "_right"
            cell.style.top = i * 70 + "px"
            cell.style.left = -70 + "px"
        }
        if (i % 2 != 0)
        {
            let cell = document.createElement("div")
            cell.innerHTML = "<img src='style/arrow.png' style='transform: rotate(90deg)'></img>"
            container.appendChild(cell).className = "item arrow"
            cell.id = i + "_left"
            cell.style.top = i * 70 + "px"
            cell.style.left = 490 + "px"
        }
    }

    if (players == "2")
    {
        player1.innerHTML = `<img class="player-color" src="style/p1.png" alt=""> Játékos 1: <span>0</span>/${treasureAll} <img class="treasure-icon" src="style/treasure-icon.png" alt="">`
        player2.innerHTML = `<img class="player-color" src="style/p2.png" alt=""> Játékos 2: <span>0</span>/${treasureAll} <img class="treasure-icon" src="style/treasure-icon.png" alt="">`
        player1.style.display = "flex"
        player2.style.display = "flex"
        playersData[0].position.style.display = "flex"
        playersData[1].position.style.display = "flex"
        data[0][0].players.push(playersData[0])
        data[0][6].players.push(playersData[1])
    }
    else if (players == "3")
    {
        player1.innerHTML = `<img class="player-color" src="style/p1.png" alt=""> Játékos 1: <span>0</span>/${treasureAll} <img class="treasure-icon" src="style/treasure-icon.png" alt="">`
        player2.innerHTML = `<img class="player-color" src="style/p2.png" alt=""> Játékos 2: <span>0</span>/${treasureAll} <img class="treasure-icon" src="style/treasure-icon.png" alt="">`
        player3.innerHTML = `<img class="player-color" src="style/p3.png" alt=""> Játékos 3: <span>0</span>/${treasureAll} <img class="treasure-icon" src="style/treasure-icon.png" alt="">`
        player1.style.display = "flex"
        player2.style.display = "flex"
        player3.style.display = "flex"
        playersData[0].position.style.display = "flex"
        playersData[1].position.style.display = "flex"
        playersData[2].position.style.display = "flex"
        data[0][0].players.push(playersData[0])
        data[0][6].players.push(playersData[1])
        data[6][0].players.push(playersData[2])
    }
    else
    {
        player1.innerHTML = `<img class="player-color" src="style/p1.png" alt=""> Játékos 1: <span>0</span>/${treasureAll} <img class="treasure-icon" src="style/treasure-icon.png" alt="">`
        player2.innerHTML = `<img class="player-color" src="style/p2.png" alt=""> Játékos 2: <span>0</span>/${treasureAll} <img class="treasure-icon" src="style/treasure-icon.png" alt="">`
        player3.innerHTML = `<img class="player-color" src="style/p3.png" alt=""> Játékos 3: <span>0</span>/${treasureAll} <img class="treasure-icon" src="style/treasure-icon.png" alt="">`
        player4.innerHTML = `<img class="player-color" src="style/p4.png" alt=""> Játékos 4: <span>0</span>/${treasureAll} <img class="treasure-icon" src="style/treasure-icon.png" alt="">`
        player1.style.display = "flex"
        player2.style.display = "flex"
        player3.style.display = "flex"
        player4.style.display = "flex"
        playersData[0].position.style.display = "flex"
        playersData[1].position.style.display = "flex"
        playersData[2].position.style.display = "flex"
        playersData[3].position.style.display = "flex"
        data[0][0].players.push(playersData[0])
        data[0][6].players.push(playersData[1])
        data[6][0].players.push(playersData[2])
        data[6][6].players.push(playersData[3])
    }

    let extraRotation = 0
    let extraField = document.createElement("div")
    extraField.id = extra
    extraField.style.top = "70px"
    extraField.style.left = "-140px"
    extraField.className = "item extra"
    extraField.innerHTML = `<img src="style/random/${extra}.png" style="transform: rotate(${extraRotation}deg)"></img>`
    container.appendChild(extraField)

    extraData = {
        id: extra,
        type: getType(extra),
        rotation: extraRotation,
        players: [],
        hasTreasure: false,
        treasure: null,
        isFixed: false,
        x: null,
        y: null
    }
    document.addEventListener("keydown", rotateOnClick)
    function rotateOnClick(e)
    {
        if (e.code == "Space")
        {
            extraRotation = (extraRotation + 90) % 360
            extraField.innerHTML = `<img src="style/random/${extraData.id}.png" style="transform: rotate(${extraRotation}deg)"></img>`
            extraData.rotation = extraRotation
        }
    }

    function delegate(parent, type, selector, handler)
    {
        parent.addEventListener(type, function (event)
        {
            const targetElement = event.target.closest(selector);

            if (this.contains(targetElement))
            {
                handler.call(targetElement, event);
            }
        });
    }
    delegate(document, "mouseover", ".arrow", extraMove)

    function extraMove()
    {
        if (this.style.top == "-70px")
        {
            extraField.style.top = -140 + "px"
            extraField.style.left = this.style.left
        }
        if (this.style.top == "490px")
        {
            extraField.style.top = 560 + "px"
            extraField.style.left = this.style.left
        }
        if (this.style.left == "-70px")
        {
            extraField.style.top = this.style.top
            extraField.style.left = -140 + "px"
        }
        if (this.style.left == "490px")
        {
            extraField.style.top = this.style.top
            extraField.style.left = 560 + "px"
        }
        if (extraData.hasTreasure)
        {
            extraData.treasure.treasure.style.top = extraField.style.top
            extraData.treasure.treasure.style.left = extraField.style.left
        }
    }

    function getPlayerDiff(diff)
    {
        diff = Math.abs(diff)
        while (diff > 70)
        {
            diff -= 70
        }

        if (diff > 35)
        {
            diff -= 60
        }

        return diff
    }

    delegate(document, "click", ".arrow", moveCells)
    function moveCells()
    {
        let arrowId = this.id.split("_")[0]
        let arrowDirection = this.id.split("_")[1]
        if (!this.classList.contains("disabled") && !playerMoving)
        {
            playerMoving = true
            for (let i = 0; i < data.length; i++)
            {
                let item
                let currData
                let itemCurrTop
                let itemCurrLeft
                if (arrowDirection == "down")
                {
                    currData = data[i][arrowId]
                    item = document.getElementById(currData.id)
                    itemCurrTop = item.style.top
                    itemCurrLeft = item.style.left
                    item.style.top = (i + 1) * 70 + "px"
                }
                else if (arrowDirection == "up")
                {
                    currData = data[i][arrowId]
                    item = document.getElementById(currData.id)
                    itemCurrTop = item.style.top
                    itemCurrLeft = item.style.left
                    item.style.top = (i - 1) * 70 + "px"
                }
                else if (arrowDirection == "right")
                {
                    currData = data[arrowId][i]
                    item = document.getElementById(currData.id)
                    itemCurrTop = item.style.top
                    itemCurrLeft = item.style.left
                    item.style.left = (i + 1) * 70 + "px"
                }
                else
                {
                    currData = data[arrowId][i]
                    item = document.getElementById(currData.id)
                    itemCurrTop = item.style.top
                    itemCurrLeft = item.style.left
                    item.style.left = (i - 1) * 70 + "px"
                }

                if (currData.hasTreasure)
                {
                    currData.treasure.treasure.style.top = item.style.top
                    currData.treasure.treasure.style.left = item.style.left
                }

                if (currData.players.length !== 0)
                {
                    if (i === data.length - 1 && arrowDirection === "right")
                    {
                        item = extraField
                    }
                    else if (i === data.length && arrowDirection === "down")
                    {
                        item = extraField
                    }
                    else if (i === 0 && arrowDirection === "left")
                    {
                        item = extraField
                    }
                    else if (i === 0 && arrowDirection === "up")
                    {
                        item = extraField
                    }

                    for (let j = 0; j < currData.players.length; j++)
                    {
                        let currTop = parseInt(itemCurrTop.replace(/[^\d\-]/g, ''))
                        let currLeft = parseInt(itemCurrLeft.replace(/[^\d\-]/g, ''))
                        let playerTop = Math.abs(currTop - currData.players[j].position.style.top.replace(/[^\d\-]/g, ''))
                        let playerLeft = Math.abs(currLeft - currData.players[j].position.style.left.replace(/[^\d\-]/g, ''))
                        let top = parseInt(item.style.top.replace(/[^\d\-]/g, ''))
                        let left = parseInt(item.style.left.replace(/[^\d\-]/g, ''))

                        currData.players[j].position.style.top = (top + playerTop) + "px"
                        currData.players[j].position.style.left = (left + playerLeft) + "px"
                    }
                }
            }

            if (arrowDirection == "down")
            {
                let newExtra = data[6][arrowId]
                if (newExtra.players.length !== 0)
                {
                    extraData.players = newExtra.players
                    newExtra.players = []
                }

                for (let i = 6; i > 0; i--)
                {
                    data[i][arrowId] = data[i - 1][arrowId]
                }
                data[0][arrowId] = extraData

                if (extraData.hasTreasure)
                {
                    extraData.treasure.treasure.style.top = "0px"
                }
                extraData = newExtra
                extraField.style.top = "0px"
                extraField.className = "item"
                extraField = document.getElementById(newExtra.id)
                extraField.className = "item extra"
            }
            else if (arrowDirection == "up")
            {
                let newExtra = data[0][arrowId]
                if (newExtra.players.length !== 0)
                {
                    extraData.players = newExtra.players
                    newExtra.players = []
                }

                for (let i = 0; i < 6; i++)
                {
                    data[i][arrowId] = data[i + 1][arrowId]
                }
                data[6][arrowId] = extraData

                if (extraData.hasTreasure)
                {
                    extraData.treasure.treasure.style.top = "420px"
                }
                extraData = newExtra
                extraField.style.top = "420px"
                extraField.className = "item"
                extraField = document.getElementById(newExtra.id)
                extraField.className = "item extra"
            }
            else if (arrowDirection == "right")
            {
                let newExtra = data[arrowId].pop()
                if (newExtra.players.length !== 0)
                {
                    extraData.players = newExtra.players
                    newExtra.players = []
                }
                data[arrowId].unshift(extraData)

                if (extraData.hasTreasure)
                {
                    extraData.treasure.treasure.style.left = "0px"
                }
                extraData = newExtra
                extraField.style.left = "0px"
                extraField.className = "item"
                extraField = document.getElementById(newExtra.id)
                extraField.className = "item extra"
            }
            else
            {
                let newExtra = data[arrowId].shift()
                if (newExtra.players.length !== 0)
                {
                    extraData.players = newExtra.players
                    newExtra.players = []
                }
                data[arrowId].push(extraData)

                if (extraData.hasTreasure)
                {
                    extraData.treasure.treasure.style.left = "420px"
                }
                extraData = newExtra
                extraField.style.left = "420px"
                extraField.className = "item"
                extraField = document.getElementById(newExtra.id)
                extraField.className = "item extra"
            }

            let fieldPlayers = data.flat().filter(field => field.players.length !== 0)
            for (let i = 0; i < fieldPlayers.length; i++)
            {
                let newItem = document.getElementById(fieldPlayers[i].id)
                for (let j = 0; j < fieldPlayers[i].players.length; j++)
                {
                    let playerLeft = getPlayerDiff(fieldPlayers[i].players[j].position.style.left.replace(/[^\d\-]/g, ''))
                    let playerTop = getPlayerDiff(fieldPlayers[i].players[j].position.style.top.replace(/[^\d\-]/g, ''))
                    let top = parseInt(newItem.style.top.replace(/[^\d\-]/g, ''))
                    let left = parseInt(newItem.style.left.replace(/[^\d\-]/g, ''))

                    fieldPlayers[i].players[j].position.style.top = (top + playerTop) + "px"
                    fieldPlayers[i].players[j].position.style.left = (left + playerLeft) + "px"
                }
            }

            setTimeout(() => extraMove.call(this), 450)
            let disabledArrow = document.querySelector(".disabled")
            if (disabledArrow !== null)
            {
                disabledArrow.classList.remove("disabled")
            }

            if (arrowDirection === "left")
            {
                document.getElementById(`${arrowId}_right`).classList.add("disabled")
            }
            else if (arrowDirection === "right")
            {
                document.getElementById(`${arrowId}_left`).classList.add("disabled")
            }
            else if (arrowDirection === "down")
            {
                document.getElementById(`${arrowId}_up`).classList.add("disabled")
            }
            else if (arrowDirection === "up")
            {
                document.getElementById(`${arrowId}_down`).classList.add("disabled")
            }
        }
    }

    function treasures()
    {
        for (let i = 1; i <= parseInt(players); i++)
        {
            let treasureNum = parseInt(treasureAll)
            while (treasureNum > 0)
            {
                let x = randomNumber(0, 6)
                let y = randomNumber(0, 6)
                if ((x === 0 && y === 0) || (x === 0 && y === 6) || (x === 6 && y === 0) || (x === 6 && y === 6))
                {
                    continue
                }
                let currentData = data[x][y]
                let currentItem = document.getElementById(currentData.id)
                if (!currentData.hasTreasure)
                {
                    let treasureCell = document.createElement("div")

                    treasureCell.className = "random-treasure"
                    treasureCell.innerHTML = `<img src="style/treasure-icon2.png">`
                    treasureCell.style.display = "none"
                    treasureCell.style.top = currentItem.style.top
                    treasureCell.style.left = currentItem.style.left
                    currentData.hasTreasure = true
                    currentData.treasure = {
                        player: i,
                        treasure: treasureCell,
                        active: false
                    }
                    container.appendChild(treasureCell)
                    treasureNum--
                }
            }
        }
    }
    treasures()

    function setActiveTreasure()
    {
        for (let p = 0; p < parseInt(players); p++)
        {
            let found = false
            if (extraData.hasTreasure)
            {
                if (extraData.treasure.player === playersData[p].num && extraData.treasure.active)
                {
                    found = true
                }
            }

            for (let i = 0; i < data.length; i++)
            {
                for (let j = 0; j < data.length; j++)
                {
                    if (data[i][j].hasTreasure)
                    {
                        if (data[i][j].treasure.player === playersData[p].num && !found && data[i][j].treasure.active)
                        {
                            found = true
                        }
                    }
                }
            }

            if (!found && playersData[p].points < parseInt(treasureAll))
            {
                let newActive = false
                if (extraData.hasTreasure)
                {
                    if (extraData.treasure.player === playersData[p].num && !extraData.treasure.active)
                    {
                        newActive = true
                        extraData.treasure.active = true
                    }
                }

                for (let i = 0; i < data.length && !newActive; i++)
                {
                    for (let j = 0; j < data.length; j++)
                    {
                        if (data[i][j].hasTreasure)
                        {
                            if (data[i][j].treasure.player === playersData[p].num && !found && !data[i][j].treasure.active)
                            {
                                data[i][j].treasure.active = true
                                newActive = true
                                break
                            }
                        }
                    }
                }
            }
        }
    }
    setActiveTreasure()

    function showTreasure()
    {
        let found = false
        if (extraData.hasTreasure)
        {
            if (extraData.treasure.player === currPlayer.num && extraData.treasure.active)
            {
                extraData.treasure.treasure.style.display = "block"
                found = true
            }
            else
            {
                extraData.treasure.treasure.style.display = "none"
            }
        }

        for (let i = 0; i < data.length; i++)
        {
            for (let j = 0; j < data.length; j++)
            {
                if (data[i][j].hasTreasure)
                {
                    data[i][j].treasure.treasure.style.display = "none"
                    if (data[i][j].treasure.player === currPlayer.num && !found && data[i][j].treasure.active)
                    {
                        data[i][j].treasure.treasure.style.display = "block"
                        found = true
                    }
                }
            }
        }
    }
    showTreasure()

    function itemDirections(item)
    {
        if (item.type === "straight")
        {
            if (item.rotation === 0)
            {
                return ["left", "right"]
            }
            else if (item.rotation === 90)
            {
                return ["up", "down"]
            }
            else if (item.rotation === 180)
            {
                return ["left", "right"]
            }
            else if (item.rotation === 270)
            {
                return ["up", "down"]
            }
        }
        else if (item.type === "curve")
        {
            if (item.rotation === 0)
            {
                return ["up", "right"]
            }
            else if (item.rotation === 90)
            {
                return ["right", "down"]
            }
            else if (item.rotation === 180)
            {
                return ["down", "left"]
            }
            else if (item.rotation === 270)
            {
                return ["left", "up"]
            }
        }
        else if (item.type === "branching")
        {
            if (item.rotation === 0)
            {
                return ["up", "right", "down"]
            }
            else if (item.rotation === 90)
            {
                return ["right", "left", "down"]
            }
            else if (item.rotation === 180)
            {
                return ["up", "down", "left"]
            }
            else if (item.rotation === 270)
            {
                return ["right", "left", "up"]
            }
        }
    }

    delegate(document, "click", ".item", movePlayer)
    function movePlayer()
    {
        if (!this.classList.contains("arrow") && playerMoving)
        {
            let currData = data.flat().find(curr => curr.players.includes(currPlayer))
            let newData = data.flat().find(newd => newd.id == this.id)
            let playerCurrPos = document.getElementById(currData.id)
            let currTop = parseInt(playerCurrPos.style.top.replace(/[^\d\-]/g, ''))
            let currLeft = parseInt(playerCurrPos.style.left.replace(/[^\d\-]/g, ''))
            let playerTop = Math.abs(currTop - currPlayer.position.style.top.replace(/[^\d\-]/g, ''))
            let playerLeft = Math.abs(currLeft - currPlayer.position.style.left.replace(/[^\d\-]/g, ''))
            let top = parseInt(this.style.top.replace(/[^\d\-]/g, ''))
            let left = parseInt(this.style.left.replace(/[^\d\-]/g, ''))

            if (Math.abs(Math.abs(currTop) - Math.abs(top)) <= 70 && Math.abs(Math.abs(currLeft) - Math.abs(left)) <= 70)
            {
                let direction
                let newDirection
                if (Math.abs(currTop) - Math.abs(top) < 0)
                {
                    direction = "down"
                    newDirection = "up"
                }
                else if (Math.abs(currTop) - Math.abs(top) > 0)
                {
                    direction = "up"
                    newDirection = "down"
                }
                else if (Math.abs(currLeft) - Math.abs(left) < 0)
                {
                    direction = "right"
                    newDirection = "left"
                }
                else
                {
                    direction = "left"
                    newDirection = "right"
                }

                if ((itemDirections(currData).includes(direction) && itemDirections(newData).includes(newDirection)) || currData === newData)
                {
                    if (newData.hasTreasure && newData.treasure.player === currPlayer.num && newData.treasure.active)
                    {
                        newData.hasTreasure = false
                        newData.treasure.treasure.style.display = "none"
                        currPlayer.points++
                        currPlayer.id.querySelector("span").innerText = currPlayer.points
                    }
                    currPlayer.position.style.top = (top + playerTop) + "px"
                    currPlayer.position.style.left = (left + playerLeft) + "px"
                    currData.players.splice(currData.players.indexOf(currPlayer), 1)
                    newData.players.push(currPlayer)

                    if (currPlayer.points === parseInt(treasureAll) && newData.id === currPlayer.startPos)
                    {
                        restartGame(currPlayer)
                    }
                    setCurrentPlayer(currPlayer.num + 1 > parseInt(players) ? 1 : currPlayer.num + 1)
                    currPlayer = playersData[currPlayer.num > parseInt(players) - 1 ? 0 : currPlayer.num]
                    playerMoving = false
                    setActiveTreasure()
                    showTreasure()
                }
            }
        }
    }
}

function restartGame(winnerPlayer)
{
    const description = document.querySelector("#end-menu")
    if (description.style.display === "none")
    {
        description.style.display = "block";
        const winner = document.querySelector("#winner")
        winner.innerHTML = "Játékos " + winnerPlayer.num
    }
}

