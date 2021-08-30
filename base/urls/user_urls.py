from django.urls import path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
)

from base.views import user_views as views

urlpatterns = [
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('profile/', views.getUserProfile, name='user-profile'),
    path('profile/update/', views.updateUserProfile, name='user-update-profile'),
    path('register/', views.registerUser, name='user-register'),
    path('', views.getUsers, name='user-users'),
    path('<str:pk>/', views.getUserById, name='user-get'),
    path('update/<str:pk>/', views.updateUser, name='user-update'),
    path('delete/<str:pk>/', views.deleteUser, name='user-delete'),
]