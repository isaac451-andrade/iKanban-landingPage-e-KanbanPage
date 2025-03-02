from django.urls import path
from . import views
urlpatterns = [
    path('getUsers/', views.getUsers),
    path('addUser/', views.addUser),
    path('getUserByName/<str:userName>', views.getUserByName),
    path('addCard/', views.addCard),
    path('changeCardColumn/', views.changeCardColumn),
    path('editCard/', views.editCard),
    path('delCard/', views.delCard),
    path('getCards/', views.getCards)
]