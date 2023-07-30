from django.urls import path
from . import views

urlpatterns = [
    path('get/', views.get, name='get_profile'),
    path('update/', views.update, name='update_profile'),
    path('updateWishlist/', views.updateWishlist, name='update_wishlist'),
    path('updateFollowedSellers/', views.updateFollowedSellers, name='update_followed_sellers'),
]
