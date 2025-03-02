from rest_framework import serializers
from kanbanScreen.models import Card
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = self.Meta.model(**validated_data)

        if password is not None:
            user.set_password(password)
        user.save()
        return user

    class Meta:
        model = User
        fields = ("id", "username", "email", "password")

        

class CardSerializer(serializers.ModelSerializer):


    class Meta:
        model = Card
        fields = ('id', 'titulo', 'prioridade', 'date_of_creation', 'column_id')
