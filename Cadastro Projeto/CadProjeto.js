async function carregarOpcoes() {
 try {
   // Buscar empresas
   const empresasResponse = await fetch('http://localhost:5500/api/empresa');
   const empresas = await empresasResponse.json();
   const empresaSelect = document.getElementById('empresa');

   empresas.forEach(empresa => {
     const option = document.createElement('option');
     option.value = empresa.cod_empresa;  // Ajuste conforme seu banco de dados
     option.textContent = empresa.nome_empresa;
     empresaSelect.appendChild(option);
   });

   // Buscar clientes
   const clientesResponse = await fetch('http://localhost:5500/api/cliente');
   const clientes = await clientesResponse.json();
   const clienteSelect = document.getElementById('cliente');

   clientes.forEach(cliente => {
     const option = document.createElement('option');
     option.value = cliente.cod_cliente;  // Ajuste conforme seu banco de dados
     option.textContent = cliente.nome_cliente;
     clienteSelect.appendChild(option);
   });

   // Buscar responsáveis (usuários)
   const usuariosResponse = await fetch('http://localhost:5500/api/auth');
   const usuarios = await usuariosResponse.json();
   const responsavelSelect = document.getElementById('responsavel');

   usuarios.forEach(usuario => {
     const option = document.createElement('option');
     option.value = usuario.cod_user;  // Ajuste conforme seu banco de dados
     option.textContent = usuario.nome_user;
     responsavelSelect.appendChild(option);
   });

 } catch (error) {
   console.error('Erro ao carregar opções:', error);
 }
}

document.addEventListener('DOMContentLoaded', carregarOpcoes);

document.getElementById('cadastroForm').addEventListener('submit', async function (event) {
 event.preventDefault();

 const projeto = {
   num_proposta: document.getElementById('proposta').value,
   titulo: document.getElementById('projeto').value,
   cod_empresa: document.getElementById('empresa').value,
   cod_cliente: document.getElementById('cliente').value,
   data_entrega: document.getElementById('data').value,
   num_pedido: document.getElementById('numpedido').value,
   num_itempedido: document.getElementById('numitempedido').value,
   data_pedido: document.getElementById('datapedido').value,
   resp_pedido: document.getElementById('responsavel').value
 };

 try {
   const response = await fetch('http://localhost:5500/api/projetos', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(projeto)
   });

   if (response.ok) {
     alert('Projeto cadastrado com sucesso!');
   } else {
     alert('Erro ao cadastrar projeto.');
   }
 } catch (error) {
   console.error('Erro ao enviar dados:', error);
   alert('Erro ao cadastrar projeto. Verifique sua conexão com o servidor.');
 }
});
