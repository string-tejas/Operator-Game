// Requirement : 
// 1) generate random numbers set and an answer
// 2) performing mathematical operation using BODMAS operation will yield the answer
// 3) User has to select right operators so that the operations on the set of numbers will be equal to the answer
// 4) 1 to 100 levels : level 1 will have 2 number and A S operation
//                      level 2 will have 2 number and A S M D operation    
//                      level 3 will have 3 number and A S operation
//                      So on ... 
// 
// Objects : 
// set          - the numbers set (operands)
// result       - the result 



// Function : setSize 
// Params   : level (the number of level)
// pattern w.r.t to level : 2 2 3 3 4 4 5 5 6 6 ....
// 1 <= level <= 100 for current build
// Approach : 
// The above pattern w.r.t to level for even and odd is :
// level :  1 2 3 4 5 6 7 ....
// even  :  - 2 - 3 - 4 - ....
// odd   :  2 - 3 - 4 - 5 ....
function setSize(level) {
    if (typeof level != "number" || level < 1) 
        return null 
    return level % 2 == 0 ? level/2 + 1 : (level + 1) / 2 + 1;
}

// Funtion : numberSet
// Params  : n (size of set)
// Returns : set of random numbers from 1 to 100
function numberSet(n) {
    var set = [];
    for (let i = 1; i <= n; i++) {
        set.push(Math.round(Math.random() * 100))
    }
    return set;
}

// Function : evaluate
// Params   : x, y are int and o is a string representing operator
// Returns  : result of o operation between x and y

function randomOperator() {
    let i = Math.round(Math.random() * 4)
    switch (i) {
        case 1: return '+'
        case 2: return '-'
        case 3: return '*'
        case 4: return '/'
        default : return '+'
    }
}

function resultGen(set) {
    var result = 0
    var exp = ""
    set.forEach((x, i) => {
        exp += x 
        if (i != set.length - 1)
            exp += randomOperator()        
    })
    return Math.round(eval(exp) * 100) / 100
}

function createLvlData(level) {
    var lvlData = {
        level : level,
        setLength : setSize(level),
        setOfNum : numberSet(setSize(level)),
        opLength : setSize(level) - 1,
    }
    lvlData.result = resultGen(lvlData.setOfNum)
    return lvlData
}

var currentLevel = 1

const playBtn = document.getElementById('btn-play')
playBtn.addEventListener('click', (e)=> {
    var lvlData = createLvlData(currentLevel)
    loadLevel(lvlData)
    let dialogBox = document.getElementsByClassName('dialog')
    let screenBox = document.getElementsByClassName('game-screen')
    
    dialogBox[0].style.display = 'none'
    screenBox[0].style.display = 'flex'
})

const nextDialog = document.getElementById('next')
const checkBtn = document.getElementById('submit')
var checking = false
checkBtn.addEventListener('click', e=> {
    e.preventDefault()
    let exp = '';
    let validOp = ['+', '-', '*', '/', 'x']
    const numbers = document.getElementsByClassName('number')
    const operators = document.getElementsByClassName('operator')
    const msg = document.getElementById('msg')
    if (!checking) {
        checking = true
        for (var i = 0; i < numbers.length - 1; i++) {
            exp += numbers[i].innerHTML
            if (i < numbers.length - 2) {
                if (operators[i].value == '' || !validOp.includes(operators[i].value)) {
                    msg.style.color = 'red'
                    msg.innerHTML = `That's not an Operator 😜`
                    setTimeout(() => {
                        msg.innerHTML = ' '
                    }, 2000);
                    return
                }
                if (operators[i].value === 'x') exp += '*'  
                else exp += operators[i].value
                
            }
        }
        var result = parseInt(numbers[numbers.length - 1].innerHTML.split(' ')[2]);
        var curr = eval(exp)
        if (result === curr) {
            msg.style.color = 'lightgreen'
            msg.innerHTML = '😎 Bingo !'   
            setTimeout(()=>nextDialog.classList.toggle('hide'), 1000)
        } else {
            msg.style.color = 'red'
            msg.innerHTML = 'Incorrect 😣'
        }
        setTimeout(() => {
            msg.innerHTML = ' '
        }, 1000);
        checking = false
    }
    
})

const nextBtn = document.getElementById('btn-next') 
var isClickProccessing = false
nextBtn.addEventListener('click', (e)=> {
    e.preventDefault();
    if (!isClickProccessing) {
        isClickProccessing = true
        currentLevel += 1
        const levelData = createLvlData(currentLevel)
        const numContainer = document.getElementById('nums')
        numContainer.textContent  = ''
        loadLevel(levelData)
        nextDialog.classList.toggle('hide')
        setTimeout(()=>isClickProccessing = false, 900)
    }
})

function loadLevel({level, setLength, setOfNum, opLength, result}) {
    const container = document.getElementById('nums')
    let levelTitle = document.getElementById('lvl')
    levelTitle.innerText = `Level ${level}`

    // dynamically create elements
    setOfNum.forEach(n=> {
        let div = document.createElement('div')
        div.classList.add('number')
        div.innerText = n
        container.appendChild(div)
        if (opLength != 0) {
            let input = document.createElement('input')
            input.classList.add('operator')
            input.setAttribute('maxlength', '1')
            input.setAttribute('type', 'text')
            input.setAttribute('required','')
            container.appendChild(input)
            opLength -= 1
        }
    })
    
    let div = document.createElement('div')
    div.classList.add('number')
    div.id = 'result';
    div.innerText = ` = ${result}`
    container.appendChild(div)

}

