function aplicarMascaraCNPJ(cnpj) {
  cnpj = cnpj.replace(/\D/g, ""); // Remove tudo o que não for número
  cnpj = cnpj.replace(/^(\d{2})(\d)/, "$1.$2");
  cnpj = cnpj.replace(/(\d{3})(\d)/, "$1.$2");
  cnpj = cnpj.replace(/(\d{3})(\d)/, "$1/$2");
  cnpj = cnpj.replace(/(\d{4})(\d)/, "$1-$2");
  return cnpj;
}

function formatarCNPJ(event) {
  var input = event.target;
  input.value = aplicarMascaraCNPJ(input.value);
}

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('cadastroClienteForm');

  if (form) {
    form.addEventListener('submit', async function (event) {
      event.preventDefault();

      const nome_cliente = document.getElementById('nome').value;
      const CNPJ_cliente = document.getElementById('CNPJ').value.replace(/\D/g, ''); // Remove caracteres não numéricos

      try {
        const response = await fetch('http://localhost:5500/api/cliente/cadastrar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome_cliente, CNPJ_cliente }),
        });

        const data = await response.json();
        if (response.ok) {
          alert('Cliente cadastrado com sucesso!');
          form.reset();
        } else {
          alert(data.error);
        }
      } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        alert('Erro ao cadastrar cliente.');
      }
    });
  }
});
