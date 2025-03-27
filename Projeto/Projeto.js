async function carregarProjeto() {
  try {
    const response = await fetch('http://localhost:5500/api/projetos');
    const projeto = await response.json();
    const tabela = document.querySelector('#ProjetosTable tbody');

    tabela.innerHTML = '';
    projeto.forEach(projeto => {

      // Formatar a data para o formato dd/mm/yyyy
      const dataEntrega = new Date(projeto.data_entrega).toLocaleDateString('pt-BR');
      const dataPedido = new Date(projeto.data_pedido).toLocaleDateString('pt-BR');

      const linha = document.createElement('tr');
      linha.innerHTML = `
        <td>${projeto.num_proposta}</td>
        <td>${projeto.titulo}</td>
        <td>${projeto.cod_empresa}</td>
        <td>${projeto.cod_cliente}</td>
        <td>${dataEntrega}</td>  <!-- Data formatada -->
        <td>${projeto.num_pedido}</td>
        <td>${projeto.num_itempedido}</td>
        <td>${dataPedido}</td>  <!-- Data formatada -->
        <td>${projeto.resp_pedido}</td>
        <td>
          <button onclick="editarProjeto(${projeto.cod_proj})">Editar</button>
          <button onclick="excluirProjeto(${projeto.cod_proj})">Excluir</button>
        </td>
      `;
      tabela.appendChild(linha);
    });
  } catch (error) {
    console.error('Erro ao carregar projetos:', error);
  }
}

// Redireciona para editarcliente.html passando o código do projeto na URL
function editarProjeto(cod_proj) {
  window.location.href = `editarprojeto.html?cod_proj=${cod_proj}`;
}

async function excluirProjeto(cod_proj) {
  if (confirm('Tem certeza que deseja excluir este projeto?')) {
    try {
      const response = await fetch(`http://localhost:5500/api/projetos/${cod_proj}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Erro ao excluir: ${response.status} - ${response.statusText}`);
      }

      alert("Projeto excluído com sucesso!");
      carregarProjeto();
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
      alert("Erro ao excluir projeto! Verifique o console.");
    }
  }
}

document.addEventListener('DOMContentLoaded', carregarProjeto);