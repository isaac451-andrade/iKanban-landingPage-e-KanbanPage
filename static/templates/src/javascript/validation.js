const inputs = document.querySelectorAll('.input input');

function validateInput(input, span){
    const isValid = input.value.trim().length > 0 || input.value.trim() !== '';
    const spanError = document.querySelector(span);
    if (!isValid){
        input.classList.add('input-error');
        spanError.style.display = 'block';
        return false;
    }
    else{
        input.classList.remove('input-error');
        spanError.style.display = 'none';
        return true;
    }
}

function validateConfirmaSenha(){
    const inputConfirma = document.querySelector('#confirma-senha');
    if(!(inputConfirma.value === inputs[2].value)){
        inputs[3].classList.add('input-error');
        document.getElementById('errorSenhaIgual').style.display = 'block';
        return false;
    }
    inputs[3].classList.remove('input-error');
    document.getElementById('errorSenhaIgual').style.display = 'none';
    return true;
}
if(!localStorage.getItem('usuarios')){
    localStorage.setItem('usuarios', '')
}

if(window.location.pathname === '/cadastro/'){
    document.querySelector('.btn-enviarCadastro').addEventListener('click', function(e){
        if(!validateConfirmaSenha()){
            e.preventDefault();
        }else{
            const userName = document.querySelector('#usuario');
            const senha = document.querySelector('#input-senha');
            let user;
            if(localStorage.getItem('usuarios') === ''){
                user = JSON.stringify([{name: userName.value, pass: senha.value}]);
                localStorage.setItem('usuarios', user);
                return;
            }else {
                let usuarios = JSON.parse(localStorage.getItem('usuarios'));
                for(let i= 0; i < usuarios.length; i++){
                    if(usuarios[i].name === userName.value){
                        e.preventDefault();
                        alert('Usuário já cadastrado!')
                        return;
                    }
                }

                user = {name: userName.value, pass: senha.value}
                usuarios.push(user);
                localStorage.setItem('usuarios', JSON.stringify(usuarios));
            }
        }
    })
}

function validateLogin(e){
    const userName = document.querySelector('#usuario');
    const senha = document.querySelector('#input-senha');
    const usuarios = JSON.parse(localStorage.getItem('usuarios'));

    for(let i = 0; i < usuarios.length; i++){
        if(usuarios[i].name === userName.value){
            if(!(usuarios[i].pass === senha.value)){
                e.preventDefault();
                alert("Senha Incorreta!")
                senha.value = '';
                return;
            }else {
                return;
            }
        }
        e.preventDefault();
        alert("Nome de usuário não existe!")
            
    }
}

if(window.location.pathname === '/login/'){
    document.querySelector('.btn-enviarCadastro').addEventListener('click',(e) =>{
        validateLogin(e);
    })
}