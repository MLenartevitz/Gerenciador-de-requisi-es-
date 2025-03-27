document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form'); // Seleciona o formulário

  form.addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o envio normal do formulário

    // Coletando os dados dos campos do formulário
    const fornecedor = {
      nome: document.getElementById('nome').value,
      endereco: document.getElementById('endereco').value,
      email: document.getElementById('email').value,
      telefone: document.getElementById('telefone').value,
      tipo_peca: document.getElementById('tipo_peca').value,
      quantidade: document.getElementById('quantidade').value,
      marca: document.getElementById('marca').value,
      descricao: document.getElementById('descricao').value,
      responsavel: document.getElementById('responsavel').value,
    };

    // Validação do email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(fornecedor.email)) {
      alert('Por favor, insira um email válido.');
      return; // Interrompe o envio se o email não for válido
    }

    // Validação do telefone (exemplo para número de telefone brasileiro)
    const telefoneRegex = /^\(\d{2}\)\s?\d{5}-\d{4}$/;
    if (!telefoneRegex.test(fornecedor.telefone)) {
      alert('Por favor, insira um telefone válido no formato (XX) XXXXX-XXXX.');
      return; // Interrompe o envio se o telefone não for válido
    }

    try {
      // Enviando os dados para o backend via API
      const response = await fetch('http://localhost:5500/api/fornecedores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fornecedor), // Converte os dados para JSON
      });

      if (response.ok) {
        // Se a resposta for bem-sucedida
        alert('Fornecedor cadastrado com sucesso!');
        window.location.href = '../Home/Home.html'; // Redireciona para a página inicial após o cadastro
      } else {
        const errorText = await response.text(); // Pega a resposta de erro, caso tenha
        alert('Erro ao cadastrar fornecedor: ' + errorText);
      }
    } catch (error) {
      // Caso ocorra algum erro de rede ou outro tipo
      console.error('Erro ao enviar dados:', error);
      alert('Erro ao cadastrar fornecedor. Verifique sua conexão com o servidor.');
    }
  });
});
