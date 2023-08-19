from django.urls import path
from . import views

urlpatterns = [
    path("get/", views.get, name="get_profile"),
    path("update/", views.update, name="update_profile"),
    path("updateWishlist/", views.updateWishlist, name="update_wishlist"),
    path(
        "updateFollowedSellers/",
        views.updateFollowedSellers,
        name="update_followed_sellers",
    ),
    path(
        "fetchFollowedSellerDetails/",
        views.get_followed_seller_details,
        name="fetchFollowedSellerDetails",
    ),
    path(
        "fetchRecommendedProducts/",
        views.get_recommended_products,
        name="fetchRecommendedProducts",
    ),
    path(
        "updateRecommendedProducts/",
        views.update_recommended_products,
        name="updateRecommendedProducts",
    ),
]
