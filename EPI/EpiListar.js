document.addEventListener('DOMContentLoaded', async () => {
  const tabela = document.querySelector('#tabelaEpis tbody');
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Usuário não autenticado.');
    window.location.href = '../Login/Login.html';
    return;
  }

  try {
    const response = await fetch('http://localhost:5500/api/epi', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const registros = await response.json();

    // ✅ Ordena da data mais antiga para a mais recente
    registros.sort((a, b) => new Date(a.data_retirada) - new Date(b.data_retirada));

    registros.forEach(registro => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${registro.nome_user || 'Desconhecido'}</td>
        <td>${new Date(registro.data_retirada).toLocaleDateString('pt-BR')}</td>
        <td>${registro.quantidadeOculos > 0 ? registro.quantidadeOculos : '-'}</td>
        <td>${registro.caOculos || '-'}</td>
        <td>${registro.quantidadeProtetor > 0 ? registro.quantidadeProtetor : '-'}</td>
        <td>${registro.caProtetor || '-'}</td>
        <td>${registro.quantidadeLuvas > 0 ? registro.quantidadeLuvas : '-'}</td>
        <td>${registro.caLuvas || '-'}</td>
        <td>${registro.quantidadeMascara > 0 ? registro.quantidadeMascara : '-'}</td>
        <td>${registro.caMascara || '-'}</td>
      `;
      tabela.appendChild(row);
    });

  } catch (error) {
    console.error('Erro ao carregar dados dos EPIs:', error);
    alert('Erro ao carregar dados. Verifique sua conexão ou o servidor.');
  }
});

// 🔥 Função para gerar página de impressão da tabela
function imprimirTabela() {
  const tabela = document.getElementById('tabelaEpis').outerHTML;

  const estilo = `
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 20px;
      }
      h1 {
        text-align: center;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      th, td {
        border: 1px solid #000;
        padding: 8px;
        text-align: center;
      }
      th {
        background-color: #f2f2f2;
      }
    </style>
  `;

  const janela = window.open('', '', 'width=900,height=700');
  janela.document.write(`
    <html>
      <head>
        <title>Relatório de EPIs</title>
        ${estilo}
      </head>
      <body>
        <h1>Relatório de Controle de EPIs</h1>
        ${tabela}
      </body>
    </html>
  `);

  janela.document.close();
  janela.print();
}
