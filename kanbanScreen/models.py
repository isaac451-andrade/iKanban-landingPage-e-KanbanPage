from django.db import models

from django.contrib.auth.models import User

class Card(models.Model):
    CATEGORIAS_PRIORIDADE = [('ALTA', 'Alta'), ('MEDIA', 'Média'), ('BAIXA', 'Baixa')]

    titulo = models.CharField(max_length=200, blank=False, null=False)
    prioridade = models.CharField(max_length=100, choices=CATEGORIAS_PRIORIDADE, default="")
    column_id = models.IntegerField(null=False)
    date_of_creation = models.DateField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)