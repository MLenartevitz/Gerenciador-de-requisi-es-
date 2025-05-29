// Carrega as opções de revisores (usuários)
async function carregarOpcoes() {
  try {
    // Buscar empresas
    const empresasResponse = await fetch('http://localhost:5500/api/empresa');
    const empresas = await empresasResponse.json();
    const empresaSelect = document.getElementById('empresa');

    if (!empresas || empresas.length === 0) {
      console.error('Nenhuma empresa encontrada');
      return;
    }

    empresas.forEach(empresa => {
      const option = document.createElement('option');
      option.value = empresa.cod_empresa;  // Ajuste conforme seu banco de dados
      option.textContent = empresa.nome_empresa;
      empresaSelect.appendChild(option);
    });

    // Chama a função para carregar os projetos quando uma empresa for selecionada
    empresaSelect.addEventListener('change', carregarProjetosPorEmpresa);

    // Carregar os usuários para o revisor
    await carregarUsuarios();
  } catch (error) {
    console.error('Erro ao carregar empresas:', error);
    alert('Erro ao carregar empresas.');
  }
}

// Carregar usuários para o revisor
async function carregarUsuarios() {
  try {
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

    if (!response.ok) {
      alert('Erro ao carregar usuários. Token inválido ou expirado.');
      window.location.href = '../Login/Login.html'; // Redireciona para a página de login
      return;
    }

    const usuarios = await response.json();

    if (Array.isArray(usuarios)) {
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

// Carrega os projetos relacionados a uma empresa específica
async function carregarProjetosPorEmpresa() {
  try {
    const empresaSelect = document.getElementById('empresa');
    const projetoSelect = document.getElementById('cod_proj');
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Usuário não autenticado. Faça login novamente.');
      window.location.href = '../Login/Login.html';
      return;
    }

    const codEmpresa = empresaSelect.value;

    // Se não houver uma empresa selecionada, limpa os projetos
    if (!codEmpresa) {
      projetoSelect.innerHTML = '<option value="">Selecione um projeto</option>';
      return;
    }

    // Fazer requisição para buscar projetos da empresa selecionada
    const response = await fetch(`http://localhost:5500/api/projetos?empresa=${codEmpresa}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      alert('Erro ao carregar projetos. Token inválido ou expirado.');
      window.location.href = '../Login/Login.html'; // Redireciona para a página de login
      return;
    }

    const projetos = await response.json();

    // Limpa os projetos antigos antes de carregar novos
    projetoSelect.innerHTML = '<option value="">Selecione um projeto</option>';

    // Verifique se os projetos foram encontrados para a empresa
    if (projetos && projetos.length > 0) {
      projetos.forEach(projeto => {
        const option = document.createElement('option');
        option.value = projeto.cod_proj;
        option.textContent = `${projeto.cod_proj} - ${projeto.titulo}`;
        projetoSelect.appendChild(option);
      });
    } else {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'Nenhum projeto encontrado';
      projetoSelect.appendChild(option);
    }
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
      if (responseUsuario.status === 401) {
        alert('Sessão expirada. Faça login novamente.');
        window.location.href = '../Login/Login.html';  // Redireciona para a tela de login
        return;
      } else {
        alert('Erro ao obter informações do usuário logado.');
        return;
      }
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

    const codEmpresa = document.getElementById('empresa').value;  // Coleta o código da empresa selecionada
    if (!codEmpresa) {
      alert('Por favor, selecione uma empresa!');
      return;
    }

    const dataRequisicao = document.getElementById('data').value;
    if (!dataRequisicao) {
      alert('Data inválida!');
      return;
    }

    // Criar o objeto da requisição com todos os dados
    const requisicao = {
      cod_proj: codProj, // Garantir que seja um número
      data_requisicao: dataRequisicao,
      cod_user: usuarioLogado.cod_user, // Envia o usuário logado automaticamente
      rev_req: revReq,
      cod_empresa: codEmpresa  // Incluindo o código da empresa na requisição
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


// Função para carregar projetos por empresa
async function carregarProjetosPorEmpresa() {
  const empresaSelect = document.getElementById('empresa');
  const projetoSelect = document.getElementById('cod_proj');
  const codEmpresa = empresaSelect.value; // Obtém o código da empresa selecionada

  console.log("Código da empresa selecionada:", codEmpresa);  // Verifique o código da empresa selecionada

  if (!codEmpresa) {
    projetoSelect.innerHTML = '<option value="">Selecione um projeto</option>';
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    alert('Usuário não autenticado. Faça login novamente.');
    window.location.href = '../Login/Login.html';  // Redireciona para a página de login
    return;
  }

  try {
    // Log para verificar se a empresa está sendo passada corretamente
    console.log("Buscando projetos para a empresa com cod_empresa:", codEmpresa);

    const response = await fetch(`http://localhost:5500/api/projetos/empresa/${codEmpresa}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`  // Envia o token no cabeçalho
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        alert('Sessão expirada ou token inválido. Faça login novamente.');
        window.location.href = '../Login/Login.html'; // Redireciona para a página de login
      } else if (response.status === 404) {
        alert('Nenhum projeto encontrado para esta empresa.');
      } else {
        alert('Erro ao carregar projetos.');
      }
      return;
    }

    const projetos = await response.json();

    // Limpa os projetos antigos antes de carregar novos
    projetoSelect.innerHTML = '<option value="">Selecione um projeto</option>';

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

function irParaGrindeview() {
  window.location.href = './Cadastro requisição grid.html';
}

// Define a data atual no campo
function setDataAtual() {
  const dataCampo = document.getElementById('data');
  if (dataCampo) {
    const hoje = new Date().toISOString().split('T')[0];
    dataCampo.value = hoje;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  carregarOpcoes();
  setDataAtual();
});
