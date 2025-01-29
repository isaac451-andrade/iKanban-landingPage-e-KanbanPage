from django.shortcuts import render, redirect

def loadCadastroPage(request):
    if request.method == 'POST':
        return redirect('loginPage')
    else:
        return render(request, 'cadastro.html')
