from django.shortcuts import render, redirect
from django.contrib.auth import logout

def loadCadastroPage(request):
    if request.method == 'POST':
        return redirect('loginPage')
    elif request.method == "GET":
        if request.user.is_authenticated:
            logout(request)
        return render(request, 'cadastro.html')
