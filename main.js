// ==============================
// 🔥 IMPORTS FIREBASE (CDN v12)
// ==============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc 
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";


// ==============================
// 🔐 CONFIG FIREBASE
// ==============================
const firebaseConfig = {
  apiKey: "AIzaSyC1EsrdPLyHdhVgUOvuhdDIBu_-Wr97gzM",
  authDomain: "convite-aniversario-38ee9.firebaseapp.com",
  projectId: "convite-aniversario-38ee9",
  storageBucket: "convite-aniversario-38ee9.firebasestorage.app",
  messagingSenderId: "732818926982",
  appId: "1:732818926982:web:1cdcecf2cc5c961f5c5007",
  measurementId: "G-HWZFN7LHKP"
};


// ==============================
// 🚀 INICIAR FIREBASE
// ==============================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const convidadosRef = collection(db, "convidados");


// ==============================
// 🔐 SENHA DO SITE
// ==============================
const senhaCorreta = "26";

window.verificarSenha = function() {
  const senha = document.getElementById("senhaInput").value;

  if (senha === senhaCorreta) {
    document.getElementById("telaSenha").style.display = "none";
    document.getElementById("conteudo").style.display = "block";
  } else {
    alert("Senha incorreta 🚫");
  }
};


// ==============================
// 🧠 NORMALIZAR NOME
// ==============================
function normalizarNome(nome) {
  return nome.trim().replace(/\s+/g, " ").toLowerCase();
}


// ==============================
// ✅ CONFIRMAR PRESENÇA
// ==============================
window.confirmar = async function(status) {

  const nomeInput = document.getElementById("nome").value;

  if (!nomeInput.trim()) {
    alert("Digite seu nome 😊");
    return;
  }

  const nomeFormatado = nomeInput.trim().replace(/\s+/g, " ");
  const nomeNormalizado = normalizarNome(nomeFormatado);

  const q = query(convidadosRef, where("nomeNormalizado", "==", nomeNormalizado));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const docId = snapshot.docs[0].id;

    await updateDoc(doc(db, "convidados", docId), {
      status: status,
      nome: nomeFormatado
    });

  } else {

    await addDoc(convidadosRef, {
      nome: nomeFormatado,
      nomeNormalizado: nomeNormalizado,
      status: status,
      criadoEm: new Date()
    });
  }

  document.getElementById("nome").value = "";
};


// ==============================
// 📊 ATUALIZAÇÃO EM TEMPO REAL
// ==============================

document.addEventListener("DOMContentLoaded", () => {

  onSnapshot(convidadosRef, (snapshot) => {

    let total = 0;
    let vao = 0;
    let nao = 0;

    const lista = document.getElementById("lista");
    if (!lista) return;

    lista.innerHTML = "";

    snapshot.forEach((docItem) => {

      const p = docItem.data();

      total++;

      if (p.status === "vou") vao++;
      if (p.status === "nao") nao++;

      lista.innerHTML += `
        <div class="item">
          <span>${p.nome}</span>
          <span class="${p.status === "vou" ? "status-vou" : "status-nao"}">
            ${p.status === "vou" ? "Vai" : "Não vai"}
          </span>
        </div>
      `;
    });

    document.getElementById("total").innerText = total;
    document.getElementById("vao").innerText = vao;
    document.getElementById("naoVao").innerText = nao;

  });

});