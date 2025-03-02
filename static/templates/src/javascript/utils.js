
function checkCaixaError(){
    const caixaError = document.querySelector('.caixa-error');
    if(caixaError){
        setTimeout(()=> {
            caixaError.style.display = 'none';
        }, 3500);
    }
}

