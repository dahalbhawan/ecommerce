from django.urls import path

from base.views import product_views as views

urlpatterns = [
    path('', views.getProducts, name='products'),
    path('top-rated/', views.getTopProducts, name='products-top-rated'),
    path('create/', views.createProduct, name='product-create'),
    path('upload-image/', views.imageUpload, name='product-image-upload'),
    path('<str:pk>/', views.getProduct, name='product'),
    path('update/<str:pk>/', views.updateProduct, name='product-update'),
    path('delete/<str:pk>/', views.deleteProduct, name='product-delete'),
    path('<str:pk>/reviews/create/', views.createReview, name='product-create-review'),
    path('reviews/update/<str:pk>/', views.updateReview, name='product-update-review'),
]