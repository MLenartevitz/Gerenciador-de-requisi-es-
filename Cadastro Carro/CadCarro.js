document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form'); // Seleciona o formulário
  
    form.addEventListener('submit', async function(event) {
      event.preventDefault(); // Impede o envio normal do formulário
  
      // Coletando os dados dos campos do formulário
      const carro = {
        placa: document.getElementById('placa').value.toUpperCase(),
        marca: document.getElementById('marca').value,
        modelo: document.getElementById('modelo').value,
      };
  
      try {
        // Enviando os dados para o backend via API
        const response = await fetch('http://localhost:5500/api/carro', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(carro), // Converte os dados para JSON
        });
  
        if (response.ok) {
          // Se a resposta for bem-sucedida
          alert('Carro cadastrado com sucesso!');
          window.location.href = '../Home/Home.html'; // Redireciona para a página inicial após o cadastro
        } else {
          const errorText = await response.text(); // Pega a resposta de erro, caso tenha
          alert('Erro ao cadastrar carro: ' + errorText);
        }
      } catch (error) {
        // Caso ocorra algum erro de rede ou outro tipo
        console.error('Erro ao enviar dados:', error);
        alert('Erro ao cadastrar carro. Verifique sua conexão com o servidor.');
      }
    });
  });
  