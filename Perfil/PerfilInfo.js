// 🔥 Formata a data para exibição no input tipo TEXT (formato BR - DD/MM/AAAA)
function formatarDataParaTexto(dataIso) {
  if (!dataIso) return '';
  const dataCorrigida = dataIso.includes('T') ? dataIso : dataIso.replace(' ', 'T');
  const data = new Date(dataCorrigida);
  return isNaN(data.getTime()) ? '' : data.toLocaleDateString('pt-BR');
}

// 🚀 Carrega os dados do perfil
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

    const data = await response.json();
    console.log('🔗 Dados recebidos da API:', data);

    if (!response.ok) {
      throw new Error('Erro ao carregar dados do usuário');
    }

    // ✅ Preenche os campos
    document.getElementById('codUser').value = data.cod_user || '';
    document.getElementById('nomeUser').value = data.nome_user || '';
    document.getElementById('funcao').value = data.funcao || '';
    
    // Se quiser exibir no formato brasileiro (texto):
    document.getElementById('dataInicio').value = (data.data_inicio);

    // 🔥 Se quiser input tipo date, use essa linha no lugar da de cima:
    // document.getElementById('dataInicio').value = formatarDataParaInputDate(data.data_inicio);

    document.getElementById('ativo').checked = data.ativo === true;

    const foto = document.getElementById('fotoPerfil');
    foto.src = data.foto_perfil || '../img/ale.jpg';

  } catch (error) {
    console.error('❌ Erro ao buscar perfil:', error);
    alert('Erro ao carregar informações do perfil.');
  }
}

// 🔗 Navegar para tela de edição
function irParaPaginaDeEdicao() {
  window.location.href = "./PerfilInfoeditar.html";
}

// 🚀 Executa ao carregar a página
window.onload = carregarPerfil;
