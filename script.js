const headRow = document.getElementById('t-head-row')
const tabBody = document.getElementById('t-body')
let curCell;
let cutCell = {}
//accesing  style button
const boldButton = document.getElementById('bold-btn')
const italicButton = document.getElementById('italic-btn')
const underlineButton = document.getElementById('underline-btn')

// accessing align button 
const leftAlign = document.getElementById('left-align')
const centerAlign = document.getElementById('center-align')
const rightAlign = document.getElementById('right-align')

// accessing font-size  && font-family dropdown
const fontSizeDropdown = document.getElementById('font-size')
const fontFamilyDropdown = document.getElementById('font-family')

// accessing cut - copy - paste buttons

const cutButton = document.getElementById('cut-btn')
const copyButton = document.getElementById('copy-btn')
const pasteButton = document.getElementById('paste-btn')

// accesing for color and background-color input
const textColor = document.getElementById('color')
const backgroundColor = document.getElementById('bg-color')

// accesing upload files 

const uploadJSONFiles = document.getElementById('upload-file')


// loop for having Head row

const columns = 26;
const rows = 100;



for(let i = 0; i < columns; i++){
    let th = document.createElement('th');
    th.innerText = String.fromCharCode(i + 65);
    headRow.append(th);
}

// Nested Loop for no.of Rows and Cell in the body
// outer loop for no. of rows 
// inner loop for cells


for(let i = 1; i <= rows; i++){
    let tr = document.createElement('tr');
    let th = document.createElement('th');
    th.innerText = i;
    tr.append(th);

    for(let j = 0; j < columns; j++){
        let td = document.createElement('td')
        td.setAttribute('contenteditable','true')
        td.setAttribute('id',`${String.fromCharCode(j+65)}${i}`)
        td.addEventListener('focus', (event) => onFocus(event))
        td.addEventListener('input', (event) => onInput(event))
        tr.append(td);
    }
    tabBody.append(tr)
}

function onFocus(event){
    curCell = event.target
    document.getElementById('currentCell').innerText = curCell.id
}

// function takecare that whenever the cell get input it call the updateMatrix function to update the matrix
function onInput(event){
    updateMatrix(event.target)
}
// making text bold
boldButton.addEventListener('click', () => {
    if(curCell.style.fontWeight === 'bold'){
        curCell.style.fontWeight = 'normal'
    }
    else{
        curCell.style.fontWeight = 'bold'
    }
 updateMatrix(curCell)
})
// making text italic
italicButton.addEventListener('click',() => {
    if(curCell.style.fontStyle === 'italic'){
        curCell.style.fontStyle = 'normal'
    }
    else{
        curCell.style.fontStyle = 'italic'
    }
 updateMatrix(curCell)
})
// giving text underline
underlineButton.addEventListener('click',() => {
    if(curCell.style.textDecoration === 'underline'){
        curCell.style.textDecoration = 'none';
    }
    else{
        curCell.style.textDecoration = 'underline'
    }
 updateMatrix(curCell)
})

// making text left align

leftAlign.addEventListener('click', () => {
    curCell.style.textAlign = 'left'
 updateMatrix(curCell)
})

// making text center align

centerAlign.addEventListener('click', () => {
    curCell.style.textAlign = 'center'
 updateMatrix(curCell)
})

// making text rigth align

rightAlign.addEventListener('click', () => {
    curCell.style.textAlign = 'right'
 updateMatrix(curCell)
})

// changeing the font size of text

fontSizeDropdown.addEventListener('change', () => {
    curCell.style.fontSize = fontSizeDropdown.value
 updateMatrix(curCell)
})

// changing the font family of text

fontFamilyDropdown.addEventListener('change', () => {
    curCell.style.fontFamily = fontFamilyDropdown.value
 updateMatrix(curCell)
})

// adding functionalities to cut button

cutButton.addEventListener('click', () => {
    cutCell = {
        style : curCell.style.cssText,
        text : curCell.innerText
    }
    curCell.style = null
    curCell.innerText = ''
 updateMatrix(curCell)
})

// adding functionalities to copy button

copyButton.addEventListener('click', () => {
    cutCell = {
        style : curCell.style.cssText,
        text : curCell.innerText
    }
})

// adding functionalities to paste button


pasteButton.addEventListener('click', () => {
    if(cutCell.text){
        curCell.style = cutCell.style
        curCell.innerText = cutCell.text
     updateMatrix(curCell)
    }
})

textColor.addEventListener('input', () => {
    curCell.style.color = textColor.value
 updateMatrix(curCell)
})

backgroundColor.addEventListener('change', () => {
    curCell.style.backgroundColor = backgroundColor.value
 updateMatrix(curCell)
})


// creating 2d Array consisting Arrays of objects

// creating outer array
let matrix = new Array(rows);

// outer loop for creating inner array
// inner loop for creating objects inside the inner array
for(let i = 0; i < rows; i++){
    matrix[i] = new Array(columns)
    for(let j = 0; j < columns; j++){
        matrix[i][j] = {}
    }
}


// this function will update the objects inside the 2d Array whenever there is some changes in the cell
function updateMatrix(curCell){
    let obj = {
        style: curCell.style.cssText,
        text: curCell.innerText,
        id: curCell.id
    }
// here by the help of the id of the table we convert the id into respective indices of the object in the matrix
    let id = curCell.id.split(''); // spliting the id into number and char for matrix indexs
    let i = id[1]-1; // this id for row the last number in the id is the giving the row number by subtracting 1 from it as it is a zero based indexing
    let j = id[0].charCodeAt(0)-65;// this is char in the id we convert it into number

    matrix[i][j] = obj;
}

// function for dowloading the whole table

function downloadJSON(){

    const matrixString = JSON.stringify(matrix); 

    const blob = new Blob([matrixString],{type:'application/json'})
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'data.json'
    document.body.appendChild(link)
    link.click();
    document.body.removeChild(link)
}

// uploadind the files

uploadJSONFiles.addEventListener('change', readJSONfile)

function readJSONfile(event){
  const file = event.target.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = function(e){
        const fileContent = e.target.result;
        try{
            const fileContentJSON = JSON.parse(fileContent);
            matrix = fileContentJSON;
            fileContentJSON.forEach((row) => {
                row.forEach((cell) => {
                    if(cell.id){
                      var curCell = document.getElementById(cell.id)
                      curCell.innerText = cell.text
                      curCell.style.cssText = cell.style 
                    }
                })
            })
        }
        catch(err){
           alert('error ocurred in reading json file',err)
        }
    }
    reader.readAsText(file);
  }
}