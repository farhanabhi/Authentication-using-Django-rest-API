from django.urls import path
from .views import (
    UserRegistrationView,
    CustomTokenObtainPairView,
    UserLogoutView,
    ProtectedView,
    register_view,
    login_view,
    protected_view
)

urlpatterns = [
    # API endpoints
    path('api/auth/register/', UserRegistrationView.as_view(), name='register'),
    path('api/auth/login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('api/auth/logout/', UserLogoutView.as_view(), name='logout'),
    path('api/auth/protected/', ProtectedView.as_view(), name='protected'),
    
    # UI endpoints
    path('ui/register/', register_view, name='ui_register'),
    path('ui/login/', login_view, name='ui_login'),
    path('ui/protected/', protected_view, name='ui_protected'),
]