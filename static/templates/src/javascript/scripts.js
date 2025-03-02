const modal = document.querySelector('.modal');
const prioridades = document.querySelectorAll("input[name='prioridade']");
const caixa_fade = document.querySelector('#caixa-fade');
const span_required = document.querySelector('.input-required');
const imagesCard = document.querySelectorAll('.card-img')
modal.classList.add('animationModalShow');

document.querySelector('.modal form').addEventListener('keydown', (e)=>{
    if(e.key === "Enter"){
        e.preventDefault()
        document.querySelector('.section-save button').click();
    }
})

document.querySelectorAll('.kanban-cards').forEach(column => {
    column.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    })

    column.addEventListener('dragleave', (e) => {
        e.currentTarget.classList.remove('drag-over');
    })


    column.addEventListener('drop', e => {
        const cardDrag = document.querySelector('.dragging');
        e.currentTarget.classList.remove('drag-over');
        e.currentTarget.appendChild(cardDrag);


        fetch('/api/changeCardColumn/', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": document.cookie.split('=')[1]
            },
            body: JSON.stringify({
                "column_id": parseInt(e.currentTarget.getAttribute('column-id')),
                "titulo": document.querySelector('.dragging .card-title').textContent,
                "id": parseInt(cardDrag.dataset.cardId)
            })
        }).then(response =>{
            if(!response.ok){
                throw new Error("Erro na requisição de mudar coluna do card no banco de dados: ", response.status);
            }
            return response.json()
        }).then(result => {
            console.log(result);
        })

        
    })
})

const btns_add = document.querySelectorAll('.btn_add');


function show_modal(columnId){
    caixa_fade.style.display = 'block';
    modal.style.display = 'block';
    modal.show();
    modal.id = columnId;
}


btns_add.forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector('.modal-title h2').textContent = 'Adicionar Card'
        show_modal(button.getAttribute('column-id'));
    });
})

const btn_close = document.querySelector('.btn-close');

function close_modal(){
    caixa_fade.style.display = 'none';
    modal.style.display = 'none';
    for(let i = 0; i < prioridades.length; i++){
        if(prioridades[i].checked){
            prioridades[i].checked = false;
        }
    }
    document.querySelector('#card-name').value = '';
    removeReplacingClass();
    modal.close();
}

function removeReplacingClass(){
    const cards = document.querySelectorAll('.card');
    cards.forEach((card)=>{
        if(card.classList.contains('replacing')){
            card.classList.remove('replacing');
            return
        }
    })
}

btn_close.addEventListener('click', () => {
    close_modal();
})

document.addEventListener('click', (e) => {
    if(e.target === caixa_fade){
        close_modal();
    }
})

const btn_save = document.querySelector('.section-save button');


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

function getPrioridadeFormatForRequest(prioridade){
    if (prioridade === "Média"){
        return "MEDIA";
    }
    else{
        if (prioridade === "Baixa") {
            return "BAIXA";
        }
        return "ALTA";
    }
}

function getPrioridadeFormatOnLoadingPage(prioridade){
    if (prioridade === "MEDIA"){
        return "Média";
    }
    else{
        if (prioridade === "BAIXA") {
            return "Baixa";
        }
        return "Alta";
    }
}

function getPrioridadeFormatForStyling(prioridade){
    if (prioridade === "MEDIA"){
        return "medium";
    }
    else{
        if (prioridade === "BAIXA") {
            return "low";
        }
        return "high";
    }
}

function criarCard(inputValue, prioridade){
    const caixa_card = document.createElement('div');
    fetch('/api/addCard/', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": document.cookie.split('=')[1]
        },

        body: JSON.stringify({
            titulo: inputValue,
            prioridade: getPrioridadeFormatForRequest(prioridade.value),
            column_id: parseInt(modal.id)
        })
    }).then(response =>{
        console.log(response);
        if(!response.ok){
            throw new Error("Erro na requisição de criar card: ", response.status);
        }
        img_editar.classList.remove("desabilitado");
        img_lixeira.classList.remove("desabilitado");
        caixa_card.draggable = true;
        caixa_card.classList.remove("desabilitado");
        return response.json();
    }).then(card => {
        caixa_card.dataset.cardId = card.id;
        console.log("Card criado: ", card);
        console.log("Card id: ", card.id);
    })


    caixa_card.classList.add('card');

    const caixa_badge = document.createElement('div');
    caixa_badge.classList.add('badge');

    const span_badge = document.createElement('span');
    span_badge.textContent = `${prioridade.value} prioridade`;

    caixa_badge.classList.add(prioridade.id);

    caixa_badge.appendChild(span_badge);

    const afazer = document.createElement('p');
    afazer.classList.add('card-title');
    afazer.textContent = `${inputValue}`;

    const caixa_afazer = document.createElement('div');
    caixa_afazer.appendChild(afazer);

    const caixa_icons = document.createElement('div');
    caixa_icons.classList.add('kanban-icons');

    const caixa_agrupadora = document.createElement('div');

    const img_editar = document.createElement('img');
    img_editar.src = imagesCard[1].src;
    img_editar.width = 21;
    img_editar.classList.add("desabilitado");

    const img_lixeira = document.createElement('img');
    img_lixeira.src = imagesCard[0].src;
    img_lixeira.width = 19;
    img_lixeira.classList.add("desabilitado");
    img_lixeira.style.marginLeft = '8px'

    caixa_agrupadora.appendChild(img_editar);
    caixa_agrupadora.appendChild(img_lixeira);
    caixa_icons.appendChild(caixa_agrupadora);
    
    const img_user = document.createElement('img');
    img_user.src = imagesCard[2].src;
    img_user.width = 42;

    caixa_icons.appendChild(img_user);
    
    caixa_card.appendChild(caixa_badge);
    caixa_card.appendChild(caixa_afazer);
    caixa_card.appendChild(caixa_icons);

    caixa_card.classList.add("desabilitado");
    caixa_card.setAttribute('column-id', modal.id);
    caixa_card.addEventListener('dragstart', e => {
        e.currentTarget.classList.add('dragging');
    });

    caixa_card.addEventListener('dragend', e => {
        e.currentTarget.classList.remove('dragging');
    });

    const coluna = document.querySelector(`.kanban-cards[column-id='${modal.id}']`);
    coluna.appendChild(caixa_card);
    img_lixeira.addEventListener('click', ()=>{
        fetch('/api/delCard/', {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": document.cookie.split('=')[1]
            },
            body: JSON.stringify({
                "id": parseInt(caixa_card.dataset.cardId)
            })
        }).then(response =>{
            if(!response.ok){
                throw new Error("Erro na requisição de deletar o card: ", response.status);
            }
            console.log("Sucesso no delete!");
        })

        caixa_card.remove();
    });

    img_editar.addEventListener('click', ()=>{
        document.querySelector('.modal-title h2').textContent = 'Editar Card'
        caixa_card.classList.add('replacing');
        show_modal(caixa_card.getAttribute('column-id'));
        document.querySelector('#card-name').value = document.querySelector('.card.replacing div .card-title').textContent;
        for(let i = 0; i < prioridades.length; i++){
            if(prioridades[i].value === prioridade.value){
                prioridades[i].checked = true;
            }
        }



    });
}   


function validateTask(input){
    const isValid = input.value.trim().length > 0 || input.value.trim() !== '';
    if (!isValid){
        input.classList.add('input-error');
        span_required.style.display = 'block';
        return false;
    }
    else{
        input.classList.remove('input-error');
        span_required.style.display = 'none';
        return true;
    }
}

function validatePriority(){
    const radios = document.querySelectorAll("input[name='prioridade']");
    const title_prioridade = document.querySelector('.section-prioridades h4');
    for (let i = 0; i < radios.length; i++) {
        if(radios[i].checked){
            title_prioridade.classList.remove('animationTitleError');
            return true;
        }
    }
    title_prioridade.classList.add('animationTitleError');
    setTimeout(()=>{
        title_prioridade.classList.remove('animationTitleError');
    }, 3000);
    return false;
}

btn_save.addEventListener('click', function(e){

    const input = document.querySelector('#card-name');
    


    if(!(validateTask(input) && validatePriority())){
        return;
    }
        

    let prioridadeSelecionada = null;
    for (let i = 0; i < prioridades.length; i++) {
        if (prioridades[i].checked) {
            prioridadeSelecionada = prioridades[i];
            if(document.querySelector('.card.replacing')===null){
                criarCard(input.value, prioridadeSelecionada);
            }else {
                editarCard(input.value, prioridadeSelecionada);
            }
            close_modal();
        }
    }
});

function removeClassesExcept(element, classMaintained){
    const classes = element.classList;

    for(let i = classes.length -1; i >= 0; i--){
        if(classes[i] !== classMaintained){
            element.classList.remove(classes[i]);
        }
    }
}

function editarCard(inputValue, prioridadeSelecionada){
    const cardToBeUpdated = document.querySelector('.card.replacing');
    console.log(cardToBeUpdated);
    document.querySelector('.card.replacing div .card-title').textContent = inputValue;
    const badge = document.querySelector('.card.replacing .badge');
    removeClassesExcept(badge, 'badge');
    badge.classList.add(prioridadeSelecionada.id);
    badge.childNodes[0].textContent = `${prioridadeSelecionada.value} prioridade`;

    fetch('/api/editCard/', {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": document.cookie.split('=')[1]
        },
        body: JSON.stringify({
            "prioridade": getPrioridadeFormatForRequest(prioridadeSelecionada.value),
            "titulo": inputValue,
            "id": parseInt(cardToBeUpdated.dataset.cardId)
        })
    }).then(response =>{
        if(!response.ok){
            throw new Error("Erro na requisição de editar o card: ", response.status);
        }
        return response.json()
    }).then(result => {
        console.log(result);
    })
}


setInterval(()=>{
    const prog = document.querySelector("progress");
    prog.value += 10;
    if(prog.value === prog.max){
        prog.value = 0;
    }
}, 100)


async function sendCardsToFront(){

    const response = await fetch("/api/getCards/");

    const responseJson = await response.json().then(cards =>{

        document.querySelector("#caixa-loading").style.display = "none";
        cards.forEach(card=>{
            const coluna = document.querySelector(`.kanban-cards[column-id='${card.column_id}']`)
        
            const caixa_card = document.createElement('div');
            caixa_card.dataset.cardId = card.id;
            caixa_card.classList.add('card');
    
            const caixa_badge = document.createElement('div');
            caixa_badge.classList.add('badge');
    
            const span_badge = document.createElement('span');
            span_badge.textContent = `${getPrioridadeFormatOnLoadingPage(card.prioridade)} prioridade`;
    
            caixa_badge.classList.add(getPrioridadeFormatForStyling(card.prioridade));
    
            caixa_badge.appendChild(span_badge);
    
            const afazer = document.createElement('p');
            afazer.classList.add('card-title');
            afazer.textContent = `${card.titulo}`;
    
            const caixa_afazer = document.createElement('div');
            caixa_afazer.appendChild(afazer);
    
            const caixa_icons = document.createElement('div');
            caixa_icons.classList.add('kanban-icons');
    
            const caixa_agrupadora = document.createElement('div');
    
            const img_editar = document.createElement('img');
            img_editar.src = imagesCard[1].src;
            img_editar.width = 21;
    
            const img_lixeira = document.createElement('img');
            img_lixeira.src = imagesCard[0].src;
            img_lixeira.width = 19;
            img_lixeira.style.marginLeft = '8px'
    
            caixa_agrupadora.appendChild(img_editar);
            caixa_agrupadora.appendChild(img_lixeira);
            caixa_icons.appendChild(caixa_agrupadora);
        
            const img_user = document.createElement('img');
            img_user.src = imagesCard[2].src;
            img_user.width = 42;
    
            caixa_icons.appendChild(img_user);
            
            caixa_card.appendChild(caixa_badge);
            caixa_card.appendChild(caixa_afazer);
            caixa_card.appendChild(caixa_icons);
    
            caixa_card.draggable = true;
            caixa_card.setAttribute('column-id', modal.id);
            caixa_card.addEventListener('dragstart', e => {
                e.currentTarget.classList.add('dragging');
            });
    
            caixa_card.addEventListener('dragend', e => {
                e.currentTarget.classList.remove('dragging');
            });
    
            coluna.appendChild(caixa_card);
            img_lixeira.addEventListener('click', ()=>{
                fetch('/api/delCard/', {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": document.cookie.split('=')[1]
                    },
                    body: JSON.stringify({
                        "id": parseInt(caixa_card.dataset.cardId)
                    })
                }).then(response =>{
                    if(!response.ok){
                        throw new Error("Erro na requisição de deletar o card: ", response.status);
                    }
                    console.log("Sucesso no delete!");
                })
    
                caixa_card.remove();
            });
    
            img_editar.addEventListener('click', ()=>{
                document.querySelector('.modal-title h2').textContent = 'Editar Card'
                caixa_card.classList.add('replacing');
                show_modal(caixa_card.getAttribute('column-id'));
                document.querySelector('#card-name').value = document.querySelector('.card.replacing div .card-title').textContent;
                for(let i = 0; i < prioridades.length; i++){
                    if(prioridades[i].value === card.prioridade){
                        prioridades[i].checked = true;
                    }
                }
        
            })


        })
    })
}