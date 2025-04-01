async function carregarPerfil() {
  const token = localStorage.getItem('token');

  // Verifica se o token de autenticação está presente
  if (!token) {
    alert('Você precisa estar logado para acessar esta página.');
    window.location.href = '../Login/Login.html';
    return;
  }

  try {
    // Faz a requisição para a API para buscar os dados do usuário
    const response = await fetch('http://localhost:5500/api/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // Verifica se a resposta da API é bem-sucedida
    if (!response.ok) {
      throw new Error('Erro ao carregar dados do usuário');
    }

    const data = await response.json();
    console.log("Dados recebidos da API:", data);

    // Preenche os campos com as informações do usuário
    document.getElementById('codUser').value = data.cod_user;
    document.getElementById('nomeUser').value = data.nome_user;
    document.getElementById('funcao').value = data.funcao;

    // Tratamento da data de início (data no formato ISO 8601)
    if (data.data_inicio) {
      console.log("Data bruta recebida:", data.data_inicio);

      // Substitui o espaço entre data e hora por "T" para converter para formato ISO 8601
      const dataISO = data.data_inicio.replace(' ', 'T'); // Ex: "2025-02-26 00:00:00.000" -> "2025-02-26T00:00:00.000"

      // Cria um objeto Date com o formato ISO
      const dataFormatada = new Date(dataISO);

      // Verifica se a data foi interpretada corretamente
      if (!isNaN(dataFormatada.getTime())) {
        // Extraindo dia, mês e ano formatados corretamente
        const diaFormatado = String(dataFormatada.getDate()).padStart(2, '0');
        const mesFormatado = String(dataFormatada.getMonth() + 1).padStart(2, '0'); // Mês começa em zero
        const anoFormatado = dataFormatada.getFullYear();

        const dataExibicao = `${diaFormatado}/${mesFormatado}/${anoFormatado}`;
        console.log("Data formatada para exibição:", dataExibicao);

        // Atribuindo a data formatada ao campo
        document.getElementById('dataInicio').value = dataExibicao;
      } else {
        console.error("Erro ao converter a data recebida para objeto Date:", data.data_inicio);
        alert('Erro ao converter a data de início. Verifique o formato da data.');
      }
    } else {
      console.warn("Nenhuma data recebida da API.");
    }

    // Preenche o campo 'ativo' com a informação
    document.getElementById('ativo').checked = data.ativo;

    // Preenche a foto de perfil, se disponível
    if (data.foto_perfil) {
      document.getElementById('fotoPerfil').src = data.foto_perfil;
    }
  } catch (error) {
    // Se ocorrer algum erro durante a requisição ou processamento
    console.error('Erro ao buscar perfil:', error);
    alert('Erro ao carregar informações do perfil.');
  }
}

// Função para redirecionar para a página de edição de perfil
function irParaPaginaDeEdicao() {
  window.location.href = "./PerfilInfoeditar.html";
}

// Chama a função ao carregar a página
window.onload = carregarPerfil;
