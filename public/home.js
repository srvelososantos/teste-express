
window.load = loadBooks();
/*
document.addEventListener("DOMContentLoaded", function(){
    new Tablesort(document.getElementById('bookTable'))
    
});
*/

async function userData ( ){
    const response = await fetch('http://localhost:3000/api/getuserData')
    const re = await response.json()

    console.log("dados do usuario:" + re.nome, re.email)

    const greetUser = document.getElementById("usergreetName")
    greetUser.innerHTML = `${re.nome}</p>`; 

    const greetEmail = document.getElementById("usergreetMail")
    greetEmail.innerHTML = `<p>${re.email}</p>`
}

userData();

const menu = document.getElementById("sidemenu-main")
const div = document.getElementById("item-user")

const observer = new MutationObserver( () => {

    if(!menu.classList.contains("expand")){
        div.style.display = "none";
        console.log("bosta")
    }else{
        div.style.display = "flex"
    }
});

observer.observe(menu, { attributes: true, attributeFilter: ['class'] });
    

//          SEARCH
document.addEventListener("DOMContentLoaded", () => {
    const inputBusca = document.getElementById("searchBox");
    const divResultados = document.getElementById("resultados");

    // Função para buscar os dados do servidor
    async function buscarUsuarios(termo) {
        if (termo.length < 2) { 
            divResultados.innerHTML = ""; // Limpa os resultados se tiver menos de 2 caracteres
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/buscar?termo=${termo}`);
            const usuarios = await response.json();

            // Atualiza a lista de resultados
            divResultados.innerHTML = usuarios
                .map(book => `<div class="resultado-item" style="text-align: center; font-size:1.4rem; 
                    ">${book.title}</div>`)
                .join('');
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
        }
    }

    // Captura o evento de digitação no campo de busca
    inputBusca.addEventListener("input", () => {
        buscarUsuarios(inputBusca.value);
    });
});



document.addEventListener("DOMContentLoaded", function() {
    const table = document.getElementById("bookTable");
    const tablesort = new Tablesort(table);

    // Adiciona evento de clique para atualizar as setas corretamente
    document.querySelectorAll("th").forEach(th => {
        th.addEventListener("click", function() {
            // Remove estilos de todas as colunas
            document.querySelectorAll("th").forEach(el => el.classList.remove("sorted"));

            // Verifica se a tabela está ordenada em descendente
            var isDescending = th.classList.contains("sorted-desc");

            // Adiciona a classe correspondente para exibir a seta correta
            th.classList.add("sorted");
            console.log(isDescending);
            if (isDescending) {
                th.classList.remove("sorted");
                    th.classList.add("sorted-desc");
            }
        });
    });
});

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


//modal
function openModal() {
    document.getElementById('modal').style.display = 'flex';
    
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function openModalUpgrade() {
    document.getElementById('modalUpgrade').style.display = 'flex';
    
}

function closeModalUpgrade() {
    document.getElementById('modalUpgrade').style.display = 'none';
}

const logOut = document.getElementById('logoff');
logOut.addEventListener('click', async () =>{
    try {
        const response = await fetch('http://localhost:3000/api/logout',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (response.redirected) {
            window.location.href = response.url; // 🔹 Redireciona para /login
        } else {
            const data = await response.json();
            alert('Usuário ou senha incorretos');
        }
    }catch (error) {
        console.error('Erro:', error);
    }
});

async function loadBooks(){
    const response = await fetch('http://localhost:3000/api/books');
    const books = await response.json();
    const table = document.getElementById('bookTable2');
    table.innerHTML = "";

    books.forEach(book => {
        const row = `<tr>
            <td>${book.title}</td>
            <td>${book.status}</td>
            <td>${book.author}</td>
            <td>${book.progress}%</td>
            <td>${book.voice}</td>
        </tr>`;
        table.innerHTML += row;
    });
    
}

async function uplFl() {
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');

    if (!fileInput.files.length) {
        if(fileList.hasChildNodes()){
            uploadFile(selectedFile)
        }
    }else{
        uploadFile(fileInput.files[0])
    }

    
}

async function uploadFile(file){
    const voiceSelect = document.getElementById('voiceSelect');

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("voice", voiceSelect.value);

    try {
        console.log('test')
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        alert(result.message);
        closeModal();
        loadBooks(); // Atualiza a tabela
        
    } catch (error) {
        console.error("Erro no upload:", error);
    }
}

//              DRAG AND DROP FILES

let selectedFile = null;

document.addEventListener("DOMContentLoaded", () => {
    const dropzone = document.getElementById("dropzone");
    const fileList = document.getElementById("fileList");
  
    // Evita comportamento padrão de abrir arquivo no navegador
    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
      dropzone.addEventListener(eventName, e => e.preventDefault());
      dropzone.addEventListener(eventName, e => e.stopPropagation());
    });
  
    // Estiliza quando o arquivo está sobre a zona de drop
    dropzone.addEventListener("dragover", () => {
      dropzone.classList.add("hover");
    });
  
    dropzone.addEventListener("dragleave", () => {
      dropzone.classList.remove("hover");
    });

    
  
    // Quando o arquivo é solto
    dropzone.addEventListener("drop", (e) => {
      dropzone.classList.remove("hover");
      const files = e.dataTransfer.files;
      
      if(files.length > 0){
        selectedFile = files[0]
      }

      mostrarArquivos(files)
    });
  
    function mostrarArquivos(files) {
        document.getElementById('fileInput').style.display = 'none'
      fileList.innerHTML = "<h4>Arquivos recebidos:<br></h4>";
      Array.from(files).forEach(file => {
        const item = document.createElement("div");
        item.textContent = `📄 ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
        fileList.appendChild(item);
      });
    }
  
    
  });


//             VIEW DIV

function gridView(){
    const tabela = document.getElementById("bookTable");
    const grade = document.getElementById("gradeUsuarios");

    if(tabela.style.display != "none"){
        // Muda para grade
        const linhas = tabela.querySelectorAll("tbody tr");
        grade.innerHTML = ""; // limpa a grade

        linhas.forEach(linha => {
            const colunas = linha.querySelectorAll("td");

            const card = document.createElement("div");
            card.className = "card-usuario";
            card.innerHTML = `<i class="bi bi-book"></i>
                <strong>Title:</strong> ${colunas[0].textContent}<br>
                <strong>Status:</strong> ${colunas[1].textContent}<br>
                <strong>Author:</strong> ${colunas[2].textContent}<br>
                <strong>Progress:</strong> ${colunas[3].textContent}<br>
                <strong>Voice:</strong> ${colunas[4].textContent}
            `;

            grade.appendChild(card);
        });

        tabela.style.display = "none";
        grade.style.display = "grid";
    }else {
        // Volta para tabela
        grade.style.display = "none";
        tabela.style.display = "table";
    }
}

document.getElementById('viewBt').addEventListener("click", gridView)

//          SETTINGS
document.getElementById('settingsMenu').addEventListener('click', () => {
    document.getElementById('ft').style.display = 'none'
    document.getElementById('tb').style.display = 'none'
    document.getElementById('settingsContainer').style.display = 'flex'
    document.getElementById('settingsContainer').style.flexDirection = 'column'
    document.getElementById('gradeUsuarios').style.display = 'none'

})

document.getElementById('homeMenu').addEventListener('click', () => {
    document.getElementById('ft').style.display = 'flex'
    document.getElementById('settingsContainer').style.display = 'none'
    document.getElementById('tb').style.display = 'block'
    document.getElementById('gradeUsuarios').style.display = 'none'
    document.getElementById('bookTable').style.display = ''
})

document.getElementById('collectionMenu').addEventListener('click', () => {
    gridView()
    document.getElementById('settingsContainer').style.display = 'none'
    document.getElementById('ft').style.display = 'none'
})

// ARCHIVE OPENER

document.getElementById("bookTable2").addEventListener("click", async (event) => {
  const row = event.target.closest("tr");
  if (!row) return;

  const title = row.cells[0].textContent; // por exemplo, pega o título da linha
  console.log("Você clicou no livro:", title);

  // Aqui você pode buscar o livro pelo título ou ID no backend
});