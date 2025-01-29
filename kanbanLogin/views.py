from django.shortcuts import render

def loadHomePage(request):
    if request.method == 'GET':
        return render(request, 'baseTelaInicial.html')
    

def loadLoginPage(request):
    if request.method == 'GET':
        return render(request, 'login.html')