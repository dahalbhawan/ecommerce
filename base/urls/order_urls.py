from django.urls import path

from base.views import order_views as views

urlpatterns = [
    path('', views.getOrders, name='orders'),
    path('add/', views.addOrderItems, name='orders-add'),
    path('my-orders/', views.getUserOrders, name='orders-get-user-orders'),
    path('<str:pk>/', views.getOrderById, name='orders-get-order'),
    path('<str:pk>/deliver/', views.updateOrderToDelivered, name = 'orders-set-delivered'),
    path('<str:pk>/pay/', views.updateOrderToPaid, name='orders-set-paid'),
]