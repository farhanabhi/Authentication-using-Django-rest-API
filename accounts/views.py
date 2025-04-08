from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .models import UserMessage
from .serializers import (
    UserRegistrationSerializer,
    CustomTokenObtainPairSerializer,
    UserSerializer,
    UserMessageSerializer
)
from rest_framework_simplejwt.views import TokenObtainPairView
from django.shortcuts import render

User = get_user_model()

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserLogoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data['refresh']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class ProtectedView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        message, created = UserMessage.objects.get_or_create(
            user=request.user,
            defaults={'message': ''}
        )
        serializer = UserMessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        message, created = UserMessage.objects.update_or_create(
            user=request.user,
            defaults={'message': request.data.get('message', '')}
        )
        serializer = UserMessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_200_OK)

def register_view(request):
    return render(request, 'register.html')

def login_view(request):
    return render(request, 'login.html')

def protected_view(request):
    return render(request, 'protected.html')