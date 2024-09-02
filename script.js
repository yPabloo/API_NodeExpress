const formulario = document.getElementById('forms');
const cpfEnter = document.getElementById('cpf');
const nomeEnter = document.getElementById('name');
const data_nascimentoEnter = document.getElementById('born');

formulario.addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede o envio tradicional do formulário

    const cpf = cpfEnter.value;
    const nome = nomeEnter.value;
    const data_nascimento = data_nascimentoEnter.value;
    cpfEnter.value = ''; 
    nomeEnter.value = '';
    data_nascimentoEnter.value = '';

    const usuario = {
        cpf: cpf,
        nome: nome,
        data_nascimento: data_nascimento
    };

    try {
        const response = await fetch('http://localhost:3000/usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });

        if (response.ok) {
            alert('Usuário adicionado com sucesso!');
        } else {
            alert('Falha ao adicionar usuário.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar-se à API.');
    }
});

document.getElementById('segundoForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede o envio tradicional do formulário

    const cpf = document.getElementById('cpfBusca').value;

    try {
        const response = await fetch(`http://localhost:3000/usuario/${cpf}`);

        if (response.ok) {
            const usuario = await response.json();
            document.getElementById('areaUsers').innerHTML = `
                <p>CPF: ${usuario.cpf}</p>
                <p>Nome: ${usuario.nome}</p>
                <p>Data de Nascimento: ${usuario.data_nascimento}</p>
            `;
        } else {
            document.getElementById('areaUsers').innerHTML = '<p>Usuário não encontrado.</p>';
        }
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        document.getElementById('areaUsers').innerHTML = '<p>Erro ao conectar-se à API.</p>';
    }
});

document.getElementById('showAll').addEventListener('click', async (e) => {
    e.preventDefault(); // Impede o comportamento padrão do botão

    try {
        const response = await fetch('http://localhost:3000/usuarios');

        if (response.ok) {
            const usuarios = await response.json();
            let usersHtml = '<h2>Todos os Usuários</h2>';
            usuarios.forEach((usuario) => {
                usersHtml += `
                    <p>CPF: ${usuario.cpf}</p>
                    <p>Nome: ${usuario.nome}</p>
                    <p>Data de Nascimento: ${usuario.data_nascimento}</p>
                    <hr>
                `;
            });
            document.getElementById('areaUsers').innerHTML = usersHtml;
        } else {
            document.getElementById('areaUsers').innerHTML = '<p>Erro ao buscar usuários.</p>';
        }
    } catch (error) {
        console.error('Erro ao buscar todos os usuários:', error);
        document.getElementById('areaUsers').innerHTML = '<p>Erro ao conectar-se à API.</p>';
    }
});
