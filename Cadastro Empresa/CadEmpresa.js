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
  const form = document.getElementById('cadastroEmpresaForm');

  if (form) {
    form.addEventListener('submit', async function (event) {
      event.preventDefault();

      const nome_empresa = document.getElementById('nome').value;
      const CNPJ_empresa = document.getElementById('CNPJ').value.replace(/\D/g, ''); // Remove caracteres não numéricos

      try {
        const response = await fetch('http://localhost:5500/api/empresa/cadastrar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome_empresa, CNPJ_empresa }),
        });

        const data = await response.json();
        if (response.ok) {
          alert('Empresa cadastrada com sucesso!');
          form.reset();
        } else {
          alert(data.error);
        }
      } catch (error) {
        console.error('Erro ao cadastrar empresa:', error);
        alert('Erro ao cadastrar empresa.');
      }
    });
  }
});
