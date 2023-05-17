from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions


class IndexView(APIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get(self, request, format=None):
        content = {
            'wmsg': 'Welcome to full stack dev examples'
        }
        return Response(content)
