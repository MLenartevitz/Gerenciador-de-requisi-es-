async function carregarPerfil() {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Você precisa estar logado para acessar esta página.');
    window.location.href = '../Login/Login.html';
    return;
  }

  try {
    // Buscar os dados do usuário
    const response = await fetch('http://localhost:5500/api/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // Se a resposta da API não for bem-sucedida, lançar erro
    if (!response.ok) {
      throw new Error('Erro ao carregar dados do usuário');
    }

    const data = await response.json();

    // Preencher os campos com as informações do usuário
    document.getElementById('codUser').value = data.cod_user;
    document.getElementById('nomeUser').value = data.nome_user;
    document.getElementById('funcao').value = data.funcao;

    // Verificar e formatar a data de início
    if (data.data_inicio) {
      console.log("Data bruta recebida:", data.data_inicio);
      
      // Verificar se a data está no formato dd/MM/yyyy
      const partesData = data.data_inicio.split('/'); // Divide a data em [dia, mês, ano]

      if (partesData.length === 3) {
        const dia = parseInt(partesData[0], 10); // Parte do dia
        const mes = parseInt(partesData[1], 10) - 1; // Parte do mês (subtraímos 1 porque os meses começam em 0)
        const ano = parseInt(partesData[2], 10); // Parte do ano

        // Criar a data no formato ISO (YYYY-MM-DD)
        const dataInicio = new Date(ano, mes, dia);
        
        // Verificar se a data foi convertida corretamente
        if (!isNaN(dataInicio.getTime())) {
          const dataFormatada = dataInicio.toISOString().split('T')[0]; // Formato YYYY-MM-DD
          document.getElementById('dataInicio').value = dataFormatada;
        } else {
          console.error("Erro ao converter a data para formato válido:", data.data_inicio);
          alert('Erro ao converter a data de início. Verifique o formato da data.');
        }
      } else {
        console.error("Formato de data inesperado:", data.data_inicio);
        alert('Formato de data inválido.');
      }
    }

    document.getElementById('ativo').checked = data.ativo;

    if (data.foto_perfil) {
      document.getElementById('fotoPerfil').src = data.foto_perfil;
    }

    // Exibir a mensagem de edição
    document.getElementById('mensagemEdicao').style.display = 'block';

  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    alert('Erro ao carregar informações do perfil.');
  }
}

// Função para salvar as alterações do perfil
function salvarAlteracoes() {
  const token = localStorage.getItem('token');
  const codUser = document.getElementById('codUser').value;
  const nomeUser = document.getElementById('nomeUser').value;
  const funcao = document.getElementById('funcao').value;
  const dataInicio = document.getElementById('dataInicio').value;
  const ativo = document.getElementById('ativo').checked;

  // Formatar a data para YYYY-MM-DD
  const dataInicioFormatada = `${dataInicio} 00:00:00`;

  fetch('http://localhost:5500/api/auth/usuario', {  // URL corrigida para a rota correta
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      codUser,
      nomeUser,
      funcao,
      dataInicio: dataInicioFormatada,
      ativo,
    }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao salvar alterações');
    }
    return response.json();
  })
  .then(data => {
    alert('Alterações salvas com sucesso!');
    document.getElementById('mensagemEdicao').style.display = 'none';
  })
  .catch(error => {
    console.error('Erro ao salvar alterações:', error);
    alert('Erro ao salvar alterações.');
  });
}

// Função para alterar a foto de perfil
function alterarFoto(event) {
  const fotoInput = event.target;
  const fotoPerfil = document.getElementById('fotoPerfil');

  if (fotoInput.files && fotoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      fotoPerfil.src = e.target.result;
    };
    reader.readAsDataURL(fotoInput.files[0]);
  }
}

// Chama a função ao carregar a página
window.onload = carregarPerfil;
