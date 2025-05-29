document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form'); // Seleciona o formulário
  
    form.addEventListener('submit', async function(event) {
      event.preventDefault(); // Impede o envio normal do formulário
  
      // Coletando os dados dos campos do formulário
      const produto = {
        nome_produto: document.getElementById('nome').value,
        qtde: document.getElementById('quantidade').value,
        unidade_medida: document.getElementById('unidadeMedida').value,
        cod_omie: "23"
      };
  
      try {
        // Enviando os dados para o backend via API
        const response = await fetch('http://localhost:5500/api/produto', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(produto), // Converte os dados para JSON
        });
  
        if (response.ok) {
          // Se a resposta for bem-sucedida
          alert('Produto cadastrado com sucesso!');
          window.location.href = '../Home/Home.html'; // Redireciona para a página inicial após o cadastro
        } else {
          const errorText = await response.text(); // Pega a resposta de erro, caso tenha
          alert('Erro ao cadastrar produto: ' + errorText);
        }
      } catch (error) {
        // Caso ocorra algum erro de rede ou outro tipo
        console.error('Erro ao enviar dados:', error);
        alert('Erro ao cadastrar produto. Verifique sua conexão com o servidor.');
      }
    });
  });
  