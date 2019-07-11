var tabel = document.querySelector('#table');
var time = document.querySelector('#time');
var notifications = document.querySelector('#notifications');
var startGameBtn = document.querySelector('.start-game-btn');
var resetLevelBtn = document.querySelector('.reset-level-btn');
var nextLevelBtn = document.querySelector('.next-level-btn');
var frontBackHolder;
var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 8, 7, 6, 5, 4, 3, 2, 1];
var openedCardCounter = 0;
var randomNumbers = [];
var back, x, y;
var endGame = 0;
var openCardArr = [];
var solvedCard = [];
var idTimeOut, idRemainingTime;
var roundTime = 60;
var level = 1;
// Call Functions and Add Event Listener

startGameBtn.addEventListener('click', startGame);

function startGame() {
    createRandomArr();
    createFields();
    for (let i = 0; i < frontBackHolder.length; i++) {
        frontBackHolder[i].addEventListener('click', rotateCard);
    }
    remainingTime();
    idRemainingTime = setInterval(remainingTime, 1000);
}
// Functions

function nextLevel() {
    nextLevelBtn.style.display = "none";
    resetTableAndParameters();
    roundTime = 45;
   
    notifications.innerHTML = '<h1 class="text-center text-info">Level '+ level +'</h1>';
    let createStartBtn = '<button class="btn btn-success start-game-btn">Start Game</button>';
    tabel.innerHTML = createStartBtn;
    startGameBtn = document.querySelector('.start-game-btn');

    
    if(level === 3) {
        tabel.style.width = "500px";
        tabel.style.height = "500px";
        numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,12,11,10,9,8, 7, 6, 5, 4, 3, 2, 1];
        roundTime = 65;
    }
    time.innerHTML = '<h2 class="text-center text-success">'+ roundTime +' seconds</h2>';
    startGameBtn.addEventListener('click', startGame);
}

function resetTableAndParameters() {
    openCardArr = [];
    solvedCard = [];
    openedCardCounter = 0;
    numbers = randomNumbers.sort();
    randomNumbers = [];
    
}

function resetLevel() {
    resetTableAndParameters();
    roundTime = 60;
    if(level == 2){
        roundTime = 45;
    }
    if(level == 3){
        roundTime = 65;
    }
    let createStartBtn = '<button class="btn btn-success start-game-btn">Start Level Again</button>';
    tabel.innerHTML = createStartBtn;
    startGameBtn = document.querySelector('.start-game-btn');
    notifications.innerHTML = '<h1 class="text-center text-info">Level '+ level +'</h1>';
    time.innerHTML = '<h2 class="text-center text-success">'+ roundTime +' seconds</h2>';
    resetLevelBtn.style.display = "none";
    startGameBtn.addEventListener('click', startGame);
    for (let i = 0; i < frontBackHolder.length; i++) {
        frontBackHolder[i].removeEventListener('click', rotateCard);
    }
}

function remainingTime() {
    time.innerHTML = '<h2 class="text-center text-success">'+ roundTime +' seconds</h2>';
    roundTime--;
    if(roundTime < 0){
        time.innerHTML = '<h2 class="text-center text-success">Times Up!</h2>';
        if(solvedCard.length != randomNumbers.length){
            notifications.innerHTML = '<h2 class="text-center text-danger">We\'re sorry, you have not crossed level '+ level +'.</h2>';
            resetLevelBtn.style.display = "block";
            resetLevelBtn.addEventListener('click', resetLevel);
        }
        for (let i = 0; i < frontBackHolder.length; i++) {
            frontBackHolder[i].removeEventListener('click', rotateCard);
        }
        clearInterval(idRemainingTime);
        clearTimeout(idTimeOut);
    }
}

function closeCard() {
    idTimeOut = setTimeout(function () {
        x = document.getElementById(openCardArr[0].id);
        y = document.getElementById(openCardArr[1].id);
        x.style.transform = "rotateY(0deg)";
        y.style.transform = "rotateY(0deg)";
        openedCardCounter = 0;
        openCardArr = [];
        for (let i = 0; i < frontBackHolder.length; i++) {
            frontBackHolder[i].addEventListener('click', rotateCard);
        }

    }, 1000);
}

function finishedFieldsCheck() {
    for(let i = 0; i < solvedCard.length; i++){
        if(openCardArr[0] === solvedCard[i]){
            openCardArr.shift();
            openedCardCounter--;
        }else if(openCardArr[1] === solvedCard[i]){
            openCardArr.pop();
            openedCardCounter--;
        }
    }
}

function rotateCard() {
    this.style.transform = "rotateY(180deg)";
    openCardArr = openCardArr.concat(this);
    
    openedCardCounter++;
    finishedFieldsCheck(); // Check is this fields is finished and skip if it is
    
    if(openedCardCounter === 2 && openCardArr[0] != openCardArr[1]) {
        for (let i = 0; i < frontBackHolder.length; i++) {
            frontBackHolder[i].removeEventListener('click', rotateCard);
        }
        closeCard();
        let firstCard = openCardArr[0].lastChild.innerText;
        let secondCard = openCardArr[1].lastChild.innerText;
        if (firstCard === secondCard) {
            endGame++;
            
            setTimeout(function () {
                x.style.transform = "rotateY(180deg)";
                y.style.transform = "rotateY(180deg)";
                x.lastChild.style.color = "green";
                y.lastChild.style.color = "green";
                solvedCard.push(x,y);
                openCardArr = [];
                if(solvedCard.length == randomNumbers.length){
                    if(level == 3){
                        tabel.innerHTML = '<h1 class="text-center">Congratulations!!!</h1> <br> <h3 class="text-center">You are at the level of Nikola Tesle! :)</h3>';
                    }
                    clearInterval(idRemainingTime);
                    notifications.innerHTML = "<h3 class='text-center text-danger'>Congratulations, you have successfully passed level "+ level +"!</h3>";
                    level++;
                    nextLevelBtn.style.display = "block";
                    nextLevelBtn.addEventListener('click', nextLevel);
                }
            }, 1000)
        }

    }else if(openCardArr[0] == openCardArr[1] && openCardArr.length != 0){
        openCardArr.splice(1,1);
        openedCardCounter = 1;
    }
    
    
}

function createFields() {
    var txt = '';

    for (let i = 0; i < randomNumbers.length; i++) {

        txt += '<div class="field">';
        txt += '<div class="front-back-holder" id=' + i + '>';
        txt += '<div class="front">';
        txt += 'Click Here';
        txt += '</div>';
        txt += '<div class="back">';
        txt += randomNumbers[i];
        txt += '</div>';
        txt += '</div>';
        txt += '</div>';
    }
    tabel.innerHTML = txt;
    if(level === 3){
        table.style.justifyContent = "space-around";
    }
    frontBackHolder = document.querySelectorAll('.front-back-holder');
}

function createRandomArr() {
    let numbersLength = numbers.length;
    for (let i = 0; i < numbersLength; i++) {
        var randomIndex = Math.floor(Math.random() * numbers.length);
        randomNumbers = randomNumbers.concat(numbers.splice(randomIndex, 1));
    }
    return randomNumbers;
}