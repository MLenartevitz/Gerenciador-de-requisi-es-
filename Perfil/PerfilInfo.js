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
    console.log("Dados recebidos da API:", data);

    document.getElementById('codUser').value = data.cod_user;
    document.getElementById('nomeUser').value = data.nome_user;
    document.getElementById('funcao').value = data.funcao;

    // Tratamento da data de início
    if (data.data_inicio) {
      console.log("Data bruta recebida:", data.data_inicio);

      // A data está no formato dd/MM/yyyy, então vamos separar as partes
      const partesData = data.data_inicio.split('/'); // Divide em [dia, mês, ano]
      
      if (partesData.length === 3) {
        const dia = parseInt(partesData[0], 10);
        const mes = parseInt(partesData[1], 10) - 1; // Mês começa em 0 (janeiro é 0, fevereiro é 1, etc.)
        const ano = parseInt(partesData[2], 10);

        // Criamos uma nova data com os valores separados
        const dataISO = new Date(ano, mes, dia);

        // Verifica se a data foi interpretada corretamente
        if (!isNaN(dataISO.getTime())) {
          // Extraindo dia, mês e ano formatados corretamente
          const diaFormatado = String(dataISO.getDate()).padStart(2, '0');
          const mesFormatado = String(dataISO.getMonth() + 1).padStart(2, '0'); // Mês começa em zero
          const anoFormatado = dataISO.getFullYear();

          const dataFormatada = `${diaFormatado}/${mesFormatado}/${anoFormatado}`;
          console.log("Data formatada para exibição:", dataFormatada);

          // Atribuindo a data formatada ao campo
          document.getElementById('dataInicio').value = dataFormatada;
        } else {
          console.error("Erro ao converter a data recebida:", data.data_inicio);
        }
      } else {
        console.error("Formato de data inesperado:", data.data_inicio);
      }
    } else {
      console.warn("Nenhuma data recebida da API.");
    }

    document.getElementById('ativo').checked = data.ativo;

    if (data.foto_perfil) {
      document.getElementById('fotoPerfil').src = data.foto_perfil;
    }
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    alert('Erro ao carregar informações do perfil.');
  }
}


  function irParaPaginaDeEdicao() {
    window.location.href = "./PerfilInfoeditar.html";
  }