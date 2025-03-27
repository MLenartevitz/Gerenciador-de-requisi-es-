    // Função para formatar CNPJ
    function formatarCNPJ(cnpj) {
        return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
      }
      
      async function carregarClientes() {
        try {
          const response = await fetch('http://localhost:5500/api/cliente');
          const clientes = await response.json();
          const tabela = document.querySelector('#clientesTable tbody');
      
          tabela.innerHTML = '';
          clientes.forEach(cliente => {
            const cnpjFormatado = formatarCNPJ(cliente.CNPJ_cliente); // Aplicando a máscara
      
            const linha = document.createElement('tr');
            linha.innerHTML = `
              <td>${cliente.cod_cliente}</td>
              <td>${cliente.nome_cliente}</td>
              <td>${cnpjFormatado}</td> 
              <td>
                <button onclick="editarCliente(${cliente.cod_cliente})">Editar</button>
                <button onclick="excluirCliente(${cliente.cod_cliente})">Excluir</button>
              </td>
            `;
            tabela.appendChild(linha);
          });
        } catch (error) {
          console.error('Erro ao carregar clientes:', error);
        }
      }
      
      // Redireciona para editarcliente.html passando o código do cliente na URL
      function editarCliente(cod_cliente) {
        window.location.href = `editarcliente.html?cod_cliente=${cod_cliente}`;
      }
      
      async function excluirCliente(cod_cliente) {
        if (confirm('Tem certeza que deseja excluir este cliente?')) {
          try {
            const response = await fetch(`http://localhost:5500/api/cliente/${cod_cliente}`, { 
              method: 'DELETE' 
            });
      
            if (!response.ok) {
              throw new Error(`Erro ao excluir: ${response.status} - ${response.statusText}`);
            }
      
            alert("Cliente excluído com sucesso!");
            carregarClientes();
          } catch (error) {
            console.error('Erro ao excluir cliente:', error);
            alert("Erro ao excluir cliente! Verifique o console.");
          }
        }
      }
          
      document.addEventListener('DOMContentLoaded', carregarClientes);