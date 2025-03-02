from django.contrib import admin
from django.urls import path, include
from kanbanCadastro.views import loadCadastroPage
from kanbanLogin.views import *
urlpatterns = [
    path('admin/', admin.site.urls),
    path('kanban/', include('kanbanScreen.urls')),
    path('cadastro/', loadCadastroPage, name="cadastroPage"),
    path('', loadHomePage, name="homePage"),
    path('login/', loadLoginPage, name="loginPage"),
    path('api/', include('api.urls'))
]
