async function carregarPerfil() {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Você precisa estar logado para acessar esta página.');
      window.location.href = '../Login/Login.html';
      return;
    }

    try {
      const response = await fetch('http://localhost:5500/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar dados do usuário');
      }

      const data = await response.json();

      document.getElementById('codUser').value = data.cod_user;
      document.getElementById('nomeUser').value = data.nome_user;
      document.getElementById('funcao').value = data.funcao;

      // Formatar a data para YYYY-MM-DD
      if (data.data_inicio) {
        const dataInicio = new Date(data.data_inicio);
        const dataFormatada = dataInicio.toISOString().split('T')[0];
        document.getElementById('dataInicio').value = dataFormatada;
      }

      document.getElementById('ativo').checked = data.ativo;

      if (data.foto_perfil) {
        document.getElementById('fotoPerfil').src = data.foto_perfil;
      }

      // Exibe a mensagem de edição
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