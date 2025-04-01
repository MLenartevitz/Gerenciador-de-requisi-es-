// Carrega as opções de revisores (usuários)
async function carregarOpcoes() {
  try {
    // Buscar empresas
    const empresasResponse = await fetch('http://localhost:5500/api/empresa');
    const empresas = await empresasResponse.json();
    const empresaSelect = document.getElementById('empresa');

    empresas.forEach(empresa => {
      const option = document.createElement('option');
      option.value = empresa.cod_empresa;  // Ajuste conforme seu banco de dados
      option.textContent = empresa.nome_empresa;
      empresaSelect.appendChild(option);
    });

    const revisorSelect = document.getElementById('revisor');
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Usuário não autenticado. Faça login novamente.');
      window.location.href = '../Login/Login.html';
      return;
    }

    const response = await fetch('http://localhost:5500/api/auth', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const usuarios = await response.json();

    if (Array.isArray(usuarios)) {
      // Carrega todos os usuários
      usuarios.forEach(usuario => {
        const option = document.createElement('option');
        option.value = usuario.cod_user;
        option.textContent = usuario.nome_user;
        revisorSelect.appendChild(option);
      });
    } else {
      console.error('Resposta inesperada: deveria ser um array de usuários', usuarios);
      alert('Erro ao carregar usuários. Resposta inesperada.');
    }

  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
    alert('Erro ao carregar usuários. Verifique sua conexão.');
  }
}

// Carrega os projetos disponíveis
async function carregarProjetos() {
  try {
    const projetoSelect = document.getElementById('cod_proj');
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Usuário não autenticado. Faça login novamente.');
      window.location.href = '../Login/Login.html';
      return;
    }

    const response = await fetch('http://localhost:5500/api/projetos', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const projetos = await response.json();

    projetos.forEach(projeto => {
      const option = document.createElement('option');
      option.value = projeto.cod_proj;
      option.textContent = `${projeto.cod_proj} - ${projeto.titulo}`;
      projetoSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Erro ao carregar projetos:', error);
    alert('Erro ao carregar projetos.');
  }
}

// Cadastra a requisição
document.getElementById('cadastroRequisicao').addEventListener('submit', async function (event) {
  event.preventDefault();

  const token = localStorage.getItem('token');
  if (!token) {
    alert('Usuário não autenticado.');
    return;
  }

  try {
    const responseUsuario = await fetch('http://localhost:5500/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!responseUsuario.ok) {
      alert('Erro ao obter informações do usuário logado.');
      return;
    }

    const usuarioLogado = await responseUsuario.json();
    if (!usuarioLogado || !usuarioLogado.cod_user) {
      alert('Erro ao identificar o usuário logado.');
      return;
    }

    const revReq = document.getElementById('revisor').value;
    if (!revReq) {
      alert('Por favor, selecione um revisor!');
      return;
    }

    const codProj = parseInt(document.getElementById('cod_proj').value, 10);
    if (isNaN(codProj)) {
      alert('Projeto inválido!');
      return;
    }

    const dataRequisicao = document.getElementById('data').value;
    if (!dataRequisicao) {
      alert('Data inválida!');
      return;
    }

    const requisicao = {
      cod_proj: codProj, // Garantir que seja um número
      data_requisicao: dataRequisicao,
      cod_user: usuarioLogado.cod_user, // Envia o usuário logado automaticamente
      rev_req: revReq
    };

    console.log('Requisição a ser enviada:', requisicao); // Log para ver os dados enviados

    const response = await fetch('http://localhost:5500/api/requisicoes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requisicao)
    });

    if (response.ok) {
      const confirmacao = confirm('Requisição cadastrada com sucesso! Deseja ir para a página de requisições?');
      if (confirmacao) {
        irParaGrindeview(); // Agora vai redirecionar somente se o usuário confirmar
      }
    } else {
      const errorText = await response.text();
      console.error('Erro ao cadastrar requisição:', errorText);
      alert('Erro ao cadastrar requisição: ' + errorText);
    }
  } catch (error) {
    console.error('Erro ao enviar requisição:', error);
    alert('Erro ao cadastrar requisição.');
  }
});

// Define a data atual no campo
function setDataAtual() {
  const dataCampo = document.getElementById('data');
  if (dataCampo) {
    const hoje = new Date().toISOString().split('T')[0];
    dataCampo.value = hoje;
  }
}

function validarFormulario(event) {
  const cod_proj = document.getElementById('cod_proj').value;
  const data = document.getElementById('data').value;
  const empresa = document.getElementById('empresa').value;
  const revisor = document.getElementById('revisor').value;

  if (!cod_proj || !data || !empresa || !revisor) {
    alert('Por favor, preencha todos os campos!');
    event.preventDefault();
    return false;
  }

  return true;
}

function irParaGrindeview() {
  window.location.href = "./Cadastro requisição grid.html";
}

document.addEventListener('DOMContentLoaded', () => {
  carregarOpcoes();
  carregarProjetos();
  setDataAtual();
});
