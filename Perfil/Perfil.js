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

      // Exibe as informações do usuário na tela
      document.getElementById('nomeUsuario').textContent = data.nome_user;
      document.getElementById('codigoUsuario').textContent = data.cod_user;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      alert('Erro ao carregar informações do perfil.');
    }
  }

  // Função para sair e limpar o token
  function logout() {
    localStorage.removeItem('token');
    window.location.href = '../Login/Login.html';
  }