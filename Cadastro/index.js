import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js';
import { getFirestore, collection, getDocs, addDoc, setDoc, doc, deleteDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore.js';

history.scrollRestoration = "manual";
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}

const firebaseConfig = {
  apiKey: "AIzaSyAduWGBJ8K9j4_5BL9sUqe7UtgQgusi4h0",
  authDomain: "cadastro-joguinho.firebaseapp.com",
  projectId: "cadastro-joguinho",
  storageBucket: "cadastro-joguinho.appspot.com",
  messagingSenderId: "893072177065",
  appId: "1:893072177065:web:c75ab3f5358a2860adb6b8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
var registroBoolean = true;

// Recebendo a lista de objetos do DB
document.querySelector("#botao2").addEventListener("click", async function getJogos() {

  if (registroBoolean) {
    registroBoolean = false
    document.getElementById("titulo2").style.display = "block";
    let arr = [];
    const gamesCol = collection(db, 'Jogos');
    const gameSnapshot = await getDocs(gamesCol);
    arr = gameSnapshot.docs.map(doc => doc.data());
    console.log(arr)

    if (arr.length > 0) {
      document.getElementById("cardDiv").innerHTML = "";
      arr.forEach(doc => {
        let structure = `
            <div class="row">
                <div class="col s12 m7">
                    <div style="width:500px;" style="justify-content:center;" class="card">
                    <div class="card-image">
                      <img style="width:500px;" src="${doc.banner}"" alt"IMG DO JOGO">
                    </div>
                    <div  class="card-action">
                          <h3>${doc.nome}</h3>
                        </div>
                        <div class="card-content">
                            <p>${doc.nome} é um jogo de ${doc.categoria} lançado em ${doc.dataDeLancamento}.</p>
                        </div>             
                        <div style="margin:auto;" class="col s12 m7 divBtn">              
                                <button class="btn waves-effect waves-light btnAtt" value="${doc.id}"><i class="material-icons">edit</i></button>
                                <button class="btn waves-effect waves-light btnDelete" value="${doc.id}"><i class="material-icons">delete</i></button> 
                        </div>
                    </div>
                </div>
            </div>
            `

        document.getElementById('cardDiv').innerHTML += structure
        let delete_btns = document.querySelectorAll(".btnDelete");

        delete_btns.forEach(button => {
          button.addEventListener("click", function () {
            deleteData(button.value)
          })
        })

        let att_btns = document.querySelectorAll(".btnAtt");

        att_btns.forEach(button => {
          button.addEventListener("click", function () {
            attView(arr, button.value);
          })
        })
      });
    }
  } else {
    registroBoolean = true
    document.getElementById("titulo2").style.display = "none";
    document.getElementById("cardDiv").innerHTML = "";
    window.scroll(0,0);
  }
})

async function deleteData(param) {
  if (window.confirm("Deseja realmente excluir este jogo?")) {
    let documento = doc(db, 'Jogos', param);
    await deleteDoc(documento);
    alert(`Jogo deletado!`);
    setTimeout(window.location.reload(), 2000)
  }
}

//Criando o modal de att 
async function attView(docs, param) {
  docs.forEach(el => {
    if (el.id == param) {
      window.scroll(600, 600)
      document.getElementById('modal').style.display = "block"
      document.getElementById('modalFundo').style.visibility = "visible"


      let structure = `
          <div class="card accent-1 bigCard">
              <form class="col s12" name="form_control">
                  <div class="row">
                      <button class="btn waves-effect waves-light btn" type="button" id="fechar" >X
                      </button>
                      <h3 style="margin-bottom: 20px;">Atualize os dados do jogo</h3>
                      <div class="input-field col s4">
                      <label for="categoria" class="active">Nome do Jogo</label>
                          <input  id="first_name" type="text" value="${el.nome}" class="validate" name="nome">
                          
                      </div>
                      <div class="input-field col s4">
                          <input id="last_name" type="text"  class="validate" value="${el.categoria}" name="categoria">
                          <label for="categoria" class="active">Categoria</label>
                      </div>
                      <div class="input-field col s4">
                          <input  id="disabled" type="date" class="validate" value="${el.dataDeLancamento}" name="dataDeLancamento" value="">
                          <label for="date" class="active">Data</label>
                      </div>
                      <div class="input-field col s4">
                          <input  id="disabled" type="text" class="validate"  value="${el.banner}" name="imgBanner" value="">
                          <label for="imgBanner" class="active">URL Banner</label>
                      </div>
                      <button class="btn waves-effect waves-light btn" type="button" id="submit" value="${el.id}">Atualizar 
                          <i class="material-icons right">send</i>
                      </button>
                      
                  </div>
              </form>
          </div>
          `   
      document.getElementById('modal').innerHTML = structure;
      
      var fechar = document.getElementById('fechar')
      fechar.addEventListener("click", function () {
        document.getElementById('modal').style.display = "none"
        document.getElementById('modalFundo').style.visibility = "hidden"
        window.scroll(0,0);
        
      })
      let form = document.forms.form_control;

      const { nome, categoria, dataDeLancamento, imgBanner } = form;

      let btn = document.querySelector("#submit");

      //Atualizando os itens
      btn.addEventListener("click", function () {
        
        if (nome.value != '' && categoria.value != '' && dataDeLancamento.value != '' && imgBanner != "") {
          updateDocument(nome.value, categoria.value, dataDeLancamento.value, imgBanner.value, btn.value);

          document.getElementById('modal').style.display = "none"
          document.getElementById('modalFundo').style.visibility = "hidden"
          window.scroll(600, 600)
          
          
          
        } else {
          alert("Parece que há dados não preenchidos...")
        }
      })
    }
  })
}

async function updateDocument(nomeJogo, categoriaJogo, dataJogo, imgBanner, id) {
  await updateDoc(doc(db, 'Jogos', id), {
    nome: nomeJogo,
    categoria: categoriaJogo,
    dataDeLancamento: dataJogo,
    banner: imgBanner
  });
  alert("Jogo atualizado!");
  document.location.reload(true);
  getJogos();
}

/* getJogos(); */


//Adicionando Objetos no DB FUNCIONANDO
let botao = document.querySelector("#botao");

botao.addEventListener("click", async function () {
  let nomeJogo = document.querySelector(".nome").value;
  let dataJogo = document.querySelector(".datepicker").value;
  let categoriaJogo = document.querySelector(".categoria").value;
  let imgBanner = document.querySelector("#link").value;

  if (nomeJogo != "" && dataJogo != "" && categoriaJogo != "" && imgBanner != "") {
    const docRef = await addDoc(collection(db, "Jogos"), {
      nome: nomeJogo,
      categoria: categoriaJogo,
      dataDeLancamento: dataJogo,
      banner: imgBanner
    })

    await updateDoc(doc(db, "Jogos", docRef.id), {
      id: docRef.id
    })

    console.log("Document written with ID:", docRef.id);

    alert("Novo jogo adicionado com sucesso");
  } else {
    alert("Parece que há dados não preenchidos")
  }
  setTimeout(window.location.reload(), 2000)
})

