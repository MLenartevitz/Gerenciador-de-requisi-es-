// Função para abrir a modal
function openModal() {
  document.getElementById("myModal").style.display = "flex";
}
// Função para abrir a modal 2
function openModal2() {
  document.getElementById("myModal2").style.display = "flex";
}
// Função para abrir a modal 3
function openModal3() {
  document.getElementById("myModal3").style.display = "flex";
}
// Função para abrir a modal 4
function openModal4() {
  document.getElementById("myModal4").style.display = "flex";
}
// Função para abrir a modal 5
function openModal5() {
  document.getElementById("myModal5").style.display = "flex";
}
// Função para abrir a modal 6
function openModal6() {
  document.getElementById("myModal6").style.display = "flex";
}
// Função para fechar a modal
function closeModal() {
  document.getElementById("myModal").style.display = "none";
  document.getElementById("myModal2").style.display = "none";
  document.getElementById("myModal3").style.display = "none";
  document.getElementById("myModal4").style.display = "none";
  document.getElementById("myModal5").style.display = "none";
  document.getElementById("myModal6").style.display = "none";
}
// Navegação - Requisição
function novaRequisicao() {
  window.location.href = '../Cadastro Requisição/Cadastro requisição.html';
}
function consultaRequisicao() {
  window.location.href = '../Cadastro Requisição/Consulta requisição.html';
}
function itemRequisicao() {
  window.location.href = '../Cadastro Requisição/Cadastro requisição grid.html';
}

// Navegação - Cliente
function cadastrarCliente() {
  window.location.href = '../Cadastro Cliente/Cadastro cliente.html';
}
function consultaCliente() {
  window.location.href = '../Clientes/Clientes.html';
}

// Navegação - Produto
function cadastrarProduto() {
  window.location.href = '../Cadastro Produto/Cadastro produto.html';
}
function consultaProduto() {
  window.location.href = '../Produto/Produto.html';
}

// Navegação - Projeto
function cadastrarProjeto() {
  window.location.href = '../Cadastro Projeto/Cadastro projeto.html';
}
function consultaProjeto() {
  window.location.href = '../Projeto/Projeto.html';
}

// Navegação - Fornecedor
function cadastrarFornecedor() {
  window.location.href = '../Cadastro Fornecedor/Cadastro fornecedor.html';
}
function consultaFornecedor() {
  window.location.href = '../Fornecedor/Fornecedor.html';
}
// Navegação - Compras
function subirCotação() {
  window.location.href = '../Compras/Subir cotação.html';
}
function pendCotação() {
  window.location.href = '../Compras/listar cotacoes.html';
}

// Navegação - Empresa
function cadastrarEmpresa() {
  window.location.href = '../Cadastro Empresa/Cadastro empresa.html';
}

// Navegação - Carro
function cadastrarCarro() {
  window.location.href = '../Cadastro Carro/Cadastro carro.html';
}
function Saida() {
  window.location.href = '../Carros/SaidaCarro.html';
}
function Retorno() {
  window.location.href = '../Carros/RetornoCarro.html';
}
function Listar() {
  window.location.href = '../Carros/Lista veiculos.html';
}

// Navegação - Epi
function retiradaEPIDESC() {
  window.location.href = '../EPI/Controle de EPI Descartaveis.html';
}
function listaEPIDESC() {
  window.location.href = '../EPI/Lista de retirada EPI descartaveis.html'
}