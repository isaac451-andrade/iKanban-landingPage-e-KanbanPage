from django.shortcuts import render, redirect
from django.contrib import auth
from django.contrib import messages
def loadUserKanban(request):
    if not request.user.is_authenticated:
        messages.warning(request, "Faça login na sua conta do iKanban primeiro!")
        return redirect('loginPage')
    else:
        return render(request, 'kanban.html', {"user": request.user})
        
    