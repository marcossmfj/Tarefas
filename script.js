function salvarTarefa() {
  var tarefaId = document.getElementById("tarefaId").value;
  var nomeTarefa = document.getElementById("nomeTarefa").value;
  var observacoes = document.getElementById("observacoes").value;
  var prioridade = document.getElementById("prioridade").value;
  var categoria = document.getElementById("categoria").value;
  var dataVencimento = document.getElementById("dataVencimento").value;

  if (nomeTarefa === "") {
    alert("Por favor, adicione um nome para a tarefa.");
    return;
  }

  var lista = document.getElementById("listaTarefas");
  var item = tarefaId ? document.getElementById(tarefaId) : document.createElement("li");

  item.innerHTML = '<span class="nomeTarefa">' + nomeTarefa + '</span>' +
    '<span class="observacoes">' + observacoes + '</span>' +
    '<div class="info">' +
    '<span class="prioridade">' + prioridade + '</span> | ' +
    '<span class="categoria">' + categoria + '</span> | ' +
    '<span class="dataVencimento">' + dataVencimento + '</span>' +
    '</div>' +
    '<div class="acoes">' +
    '<button onclick="removerTarefa(this)"><i class="fas fa-trash-alt"></i> Remover</button>' +
    '<button onclick="editarTarefa(this)"><i class="fas fa-pencil-alt"></i> Editar</button>' +
    '<input type="checkbox" onchange="marcarConcluida(this)" aria-label="Marcar como concluída">' +
    '</div>';

  if (!tarefaId) {
    item.id = 'tarefa-' + Date.now();
    lista.appendChild(item);
  }

  document.getElementById("tarefaId").value = "";
  document.getElementById("nomeTarefa").value = "";
  document.getElementById("observacoes").value = "";
  document.getElementById("prioridade").value = "media";
  document.getElementById("categoria").value = "outros";
  document.getElementById("dataVencimento").value = "";

  salvarTarefas();
  fecharPopup();
}

function removerTarefa(botao) {
  var item = botao.parentNode.parentNode;
  item.remove();
  salvarTarefas();
}

function editarTarefa(botao) {
  var item = botao.parentNode.parentNode;
  var tarefaId = item.id;
  var nomeTarefa = item.querySelector(".nomeTarefa").textContent;
  var observacoes = item.querySelector(".observacoes").textContent;
  var prioridade = item.querySelector(".prioridade").textContent;
  var categoria = item.querySelector(".categoria").textContent;
  var dataVencimento = item.querySelector(".dataVencimento").textContent;

  document.getElementById("tarefaId").value = tarefaId;
  document.getElementById("nomeTarefa").value = nomeTarefa;
  document.getElementById("observacoes").value = observacoes;
  document.getElementById("prioridade").value = prioridade;
  document.getElementById("categoria").value = categoria;
  document.getElementById("dataVencimento").value = dataVencimento;

  abrirPopup();
}

function marcarConcluida(checkbox) {
  var item = checkbox.parentNode.parentNode;
  if (checkbox.checked) {
    item.classList.add("concluida");
    // Adiciona uma micro-interação (opcional):
    item.style.transition = "transform 0.2s ease";
    item.style.transform = "scale(1.05)";
    setTimeout(function() {
      item.style.transform = "scale(1)";
    }, 200);
  } else {
    item.classList.remove("concluida");
  }
  salvarTarefas();
}

function salvarTarefas() {
  var usuarioLogado = sessionStorage.getItem("usuarioLogado");
  if (usuarioLogado) {
    var tarefas = [];
    var lista = document.getElementById("listaTarefas");
    for (var i = 0; i < lista.children.length; i++) {
      var tarefa = {
        id: lista.children[i].id,
        nome: lista.children[i].querySelector(".nomeTarefa").textContent,
        observacoes: lista.children[i].querySelector(".observacoes").textContent,
        prioridade: lista.children[i].querySelector(".prioridade").textContent,
        categoria: lista.children[i].querySelector(".categoria").textContent,
        dataVencimento: lista.children[i].querySelector(".dataVencimento").textContent,
        concluida: lista.children[i].classList.contains("concluida")
      };
      tarefas.push(tarefa);
    }
    localStorage.setItem("tarefas_" + usuarioLogado, JSON.stringify(tarefas));
  }
}

function carregarTarefas() {
  // Limpa a lista de tarefas antes de carregar
  var lista = document.getElementById("listaTarefas");
  lista.innerHTML = "";

  var usuarioLogado = sessionStorage.getItem("usuarioLogado");
  if (usuarioLogado) {
    var tarefas = JSON.parse(localStorage.getItem("tarefas_" + usuarioLogado)) || [];

    for (var i = 0; i < tarefas.length; i++) {
      var item = document.createElement("li");
      item.id = tarefas[i].id;
      item.innerHTML = '<span class="nomeTarefa">' + tarefas[i].nome + '</span>' +
        '<span class="observacoes">' + tarefas[i].observacoes + '</span>' +
        '<div class="info">' +
        '<span class="prioridade">' + tarefas[i].prioridade + '</span> | ' +
        '<span class="categoria">' + tarefas[i].categoria + '</span> | ' +
        '<span class="dataVencimento">' + tarefas[i].dataVencimento + '</span>' +
        '</div>' +
        '<div class="acoes">' +
        '<button onclick="removerTarefa(this)"><i class="fas fa-trash-alt"></i> Remover</button>' +
        '<button onclick="editarTarefa(this)"><i class="fas fa-pencil-alt"></i> Editar</button>' +
        '<input type="checkbox" onchange="marcarConcluida(this)" aria-label="Marcar como concluída">' +
        '</div>';
      if (tarefas[i].concluida) {
        item.classList.add("concluida");
        item.querySelector("input[type='checkbox']").checked = true;
      }
      lista.appendChild(item);
    }
  }
}

function abrirPopup() {
  document.getElementById("popup").style.display = "block";
}

function fecharPopup() {
  document.getElementById("popup").style.display = "none";
}

document.getElementById("abrirPopup").addEventListener("click", abrirPopup);
document.querySelector(".fecharPopup").addEventListener("click", fecharPopup);

function logar() {
  var usuario = document.getElementById("usuario").value;
  var senha = document.getElementById("senha").value;
  var senhaArmazenada = localStorage.getItem("usuario_" + usuario);
  if (senhaArmazenada && senha === senhaArmazenada) {
    sessionStorage.setItem("usuarioLogado", usuario);
    document.getElementById("telaLogin").style.display = "none";
    document.getElementById("conteudo").style.display = "block";

    carregarTarefas(); // Chama carregarTarefas() após o login
  } else {
    alert("Usuário ou senha inválidos.");
  }
}

function deslogar() {
  sessionStorage.removeItem("usuarioLogado");

  document.getElementById("telaLogin").style.display = "block";
  document.getElementById("conteudo").style.display = "none";
}

function mostrarTelaCadastro() {
  document.getElementById("telaLogin").style.display = "none";
  document.getElementById("telaCadastro").style.display = "block";
}

function mostrarTelaLogin() {
  document.getElementById("telaCadastro").style.display = "none";
  document.getElementById("telaLogin").style.display = "block";
}

function cadastrar() {
  var novoUsuario = document.getElementById("novoUsuario").value;
  var novaSenha = document.getElementById("novaSenha").value;
  localStorage.setItem("usuario_" + novoUsuario, novaSenha);

  alert("Usuário cadastrado com sucesso!");
  mostrarTelaLogin();
}