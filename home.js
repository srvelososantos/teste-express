
const sideMenuExpand = document.querySelectorAll('#btn-expand-i')
const menuItem = document.querySelectorAll('.item-menu')

function selectLink(){
    menuItem.forEach((item) => 
        item.classList.remove('ativo')
    );
    this.classList.add('ativo')
}

menuItem.forEach((item) =>
    item.addEventListener('click', selectLink)
)

//expand menu
var btnExp = document.querySelector('#btn-expand-i')
var menuSide = document.querySelector('.sidemenu')

btnExp.addEventListener('click', function(){
    menuSide.classList.toggle('expand')
})


//add book

const btnAddBook = document.querySelector('#btnAdd')

btnAddBook.addEventListener('click', (e) => {
    
})

function newArchive(){

    //data for the new line
    var title = "como fazer inimigos e irritar pessoas"
    var status = "processing"
    var author = "PRETA, CANETA"
    var progress = "26%"
    var voice = "masculine"

    const newLine = document.createElement("tr")

    const celulaTitle = document.createElement("td")
    celulaTitle.textContent = title

    const celulaStatus = document.createElement("td")
    celulaStatus.textContent = status
    
    const celulaAuthor = document.createElement("td")
    celulaAuthor.textContent = author
    
    const celulaProgress = document.createElement("td")
    celulaProgress.textContent = progress
    
    const celulaVoice = document.createElement("td")
    celulaVoice.textContent = voice

    newLine.appendChild(celulaTitle);
    newLine.appendChild(celulaStatus);
    newLine.appendChild(celulaAuthor);
    newLine.appendChild(celulaProgress);
    newLine.appendChild(celulaVoice);

    const table = document.getElementById("bookTable").getElementsByTagName("tbody")[0];
    table.appendChild(newLine);
    
}

function addLine(){
    newArchive();
}
