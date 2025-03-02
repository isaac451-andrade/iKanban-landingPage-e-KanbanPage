from django.urls import path
from .views import loadUserKanban
urlpatterns = [
    path('', loadUserKanban, name='kanbanScreen')
]