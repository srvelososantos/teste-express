
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
