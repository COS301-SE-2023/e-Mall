from django.urls import path
from . import views

urlpatterns = [
    path("getProd/", views.getProd, name="get_inventory"),
    path("update/", views.update, name="update_inventory"),
    path("delete/", views.delete, name="delete_inventory"),
    path("getSimilarProducts/", views.getSimilarProducts, name="get_similar_products"),
    path(
        "createSimilarProduct/",
        views.createSimilarProduct,
        name="create_similar_product",
    ),
    path("createNewProduct/", views.createNewProduct, name="create_new_product"),
]
