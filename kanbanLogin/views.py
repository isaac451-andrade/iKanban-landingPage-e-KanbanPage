from django.shortcuts import render, redirect
from django.contrib import auth
from django.contrib import messages

def loadHomePage(request):
    if request.method == 'GET':
        return render(request, 'baseTelaInicial.html')
    

def loadLoginPage(request):
    if request.method == 'GET':

        response = render(request, 'login.html')

        response['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
        response['Pragma'] = 'no-cache'
        response['Expires'] = '0'
        return response
    elif request.method == 'POST':
        nome = request.POST['usuario']
        senha = request.POST['input-senha']

        user = auth.authenticate(request, username=nome, password=senha)
        if user is not None:
            auth.login(request, user)
            return redirect('kanbanScreen')
        
        messages.error(request, "Usuário ou senha incorreta!")
        return redirect('loginPage')
