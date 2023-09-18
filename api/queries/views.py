from django.shortcuts import render
import string
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Query


# Create your views here.
@api_view(["POST"])
def create(request):
    try:
        user = request.user
        if user is None:
            raise Exception("User not found")
        if user.type == "seller":
            raise Exception("Seller cannot create queries")
        if user.type == "consumer":
            # add to db
            query = Query(
                product_id=request.data["product_id"],
                user_email=user.email,
                seller_email=request.data["seller_email"],
                query_option=request.data["query_option"],
            )
            query.save()

        return Response(
            {"message": "Query created successfully"}, status=status.HTTP_201_CREATED
        )
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["Post"])
def getQueries(request):
    try:
        user = request.user
        if user is None:
            raise Exception("User not found")
        if user.type == "consumer":
            raise Exception("Consumer cannot get queries")
        if user.type == "seller":
            query_data = []
            queries = Query.objects.filter(seller_email=user.email)
            for query in queries:
                query_data.append(
                    {
                        "id": query.id,
                        "product_id": query.product_id,
                        "user_email": query.user_email,
                        "seller_email": query.seller_email,
                        "query_option": query.query_option,
                    }
                )
            return Response({"queries": query_data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["Post"])
def deleteQuery(request):
    try:
        user = request.user
        if user is None:
            raise Exception("User not found")
        if user.type == "consumer":
            raise Exception("Consumer cannot delete queries")
        if user.type == "seller":
            query = Query.objects.filter(id=request.data["id"])
            if query is None:
                raise Exception("Query not found")
            query.delete()
            return Response(
                {"message": "Query deleted successfully"}, status=status.HTTP_200_OK
            )
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
