from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User

# local imports
from base.serializers import UserSerializer, UserWithTokenSerializer

# third party imports
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# Create your views here.

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserWithTokenSerializer(self.user)
        for key, value in serializer.data.items():
            data[key] = value

        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        user = User.objects.create(
            username = data['email'],
            email = data['email'],
            first_name = data['name'],
            password = make_password(data['password'])
        )
        serializer = UserWithTokenSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except: 
        message = {'detail': 'User with this email already exixts.'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    data = request.data

    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']

    if data['password'] != '':
        user.password = make_password(data['password'])
    
    user.save()
    serializer = UserWithTokenSerializer(user, many=False)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request, pk):
    try:
        userToDelete = User.objects.get(pk=pk)
        userToDelete.delete()
        return Response({'detail': 'User was deleted successfully'}, status=status.HTTP_200_OK)
    except User.DoesNotExist as e:
        return Response({'detail': e.message if hasattr(e, 'message') else e}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUserById(request, pk):
    try:
        user = User.objects.get(pk=pk)
        serializer = UserSerializer(user, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except User.DoesNotExist as e:
        return Response({'detail': e.message if hasattr(e, 'message') else e}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateUser(request, pk):
    try:
        user = User.objects.get(pk=pk)
        data = request.data

        user.first_name = data['name']
        user.username = data['email']
        user.email = data['email']
        user.is_staff = data['isAdmin']
        
        user.save()
        serializer = UserSerializer(user, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except User.DoesNotExist as e:
        return Response({'detail': e.message if hasattr(e, 'message') else e}, status=status.HTTP_400_BAD_REQUEST)