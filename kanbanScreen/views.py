from django.shortcuts import render

def loadUserKanban(request):
    if request.method == 'POST':
        return render(request, 'kanban.html', context={'userName': request.POST['usuario']})
    else:
        return render(request, 'login.html', context={'error': 'Faça o login na sua conta para poder acessar o teu Kanban!'})