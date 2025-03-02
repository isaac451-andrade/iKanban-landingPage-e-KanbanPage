from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from .serializers import UserSerializer, CardSerializer
from kanbanScreen.models import Card

from django.contrib import messages
@api_view(['GET'])
def getUsers(request):
    usuarios = User.objects.all()
    serializer = UserSerializer(usuarios, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getUserByName(request, userName):
    try:
        user = User.objects.get(username=userName)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        return Response({"msg":"Usuário não existe!"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def addUser(request):
    serializer = UserSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        print("Usuario criado com sucesso!")
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        messages.error(request, "Usuário já existe!")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def addCard(request):

    if request.user.is_authenticated:
        serializer = CardSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_406_NOT_ACCEPTABLE)
    else:
        return Response({}, status=status.HTTP_403_FORBIDDEN)


@api_view(['PUT'])
def changeCardColumn(request):
    try:
        cardToBeUpdated = Card.objects.get(id=request.data['id'])
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = CardSerializer(cardToBeUpdated, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_406_NOT_ACCEPTABLE)    


@api_view(["PUT"])
def editCard(request):

    try:
        cardToBeUpdated = Card.objects.get(id=request.data['id'])
    except:
        print("não achou")
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = CardSerializer(cardToBeUpdated, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_406_NOT_ACCEPTABLE)

@api_view(['DELETE'])
def delCard(request):
    try:
        cardTobeDeleted = Card.objects.get(id=request.data['id'])
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    cardTobeDeleted.delete()

    return Response(status=status.HTTP_200_OK)

@api_view(["GET"])
def getCards(request):
    if request.user.is_authenticated:
        cards = Card.objects.filter(user=request.user)

        serializer = CardSerializer(cards, many=True)

        return Response(serializer.data)
    else:
        return Response(status=status.HTTP_403_FORBIDDEN)


