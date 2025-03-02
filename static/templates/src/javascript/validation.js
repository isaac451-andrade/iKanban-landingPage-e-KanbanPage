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

if(window.location.pathname === '/cadastro/'){
    document.querySelector('.btn-enviarCadastro').addEventListener('click', function(e){
        if(!validateConfirmaSenha()){
            e.preventDefault();
        }else{
            sendUserCadastroToApi();
        }
    })
}


function getCookie(name){
    let cookieValue = null;
    if(document.cookie && document.cookie !== "") {
        const listaCookies = document.cookie.split(';');
        for(let c =0; c < listaCookies.length; c++){
            const cookie = listaCookies[c].trim()
            if(cookie.substring(0, name +1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


async function sendUserCadastroToApi() {
    const userName = document.querySelector('#usuario').value;
    const senha = document.querySelector('#input-senha').value;
    const emailUser = document.querySelector('#email').value;
    const csrftoken = getCookie('csrftoken');
    
    const response = await fetch('/api/addUser/', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken
        },
        body: JSON.stringify({
            username: userName,
            password: senha,
            email: emailUser
        })
        
        
    });

    const responseJson = await response.json();

    const dados = responseJson.msg;

}


async function getUserFromApi(userName) {
    const response = await fetch(`/api/getUserByName/${userName}`);

    const responseJson = await response.json();
    return responseJson;
}
