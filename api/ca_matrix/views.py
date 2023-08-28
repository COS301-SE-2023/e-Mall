# Create your views here.
from django.db.models import Count, Case, When, IntegerField
from django.http import JsonResponse
from rest_framework.views import APIView
from ca_matrix.models import ca_matrix
from analytics.models import Analytics
from product.models import Product
from rest_framework.permissions import AllowAny
from django.db import transaction


class CAMatrixView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            with transaction.atomic():
                # Clear existing data in CAMatrix before creating the new matrix
                ca_matrix.objects.all().delete()

                # Fetch all unique products and users
                unique_products = Analytics.objects.values_list('product', flat=True).distinct()
                unique_users = Analytics.objects.filter(consumer_email__isnull=False).values_list('consumer_email', flat=True).distinct()

                # Loop through each product and user to create/update CAMatrix entries
                for product_name in unique_products:
                    for user_email in unique_users:
                        # Check if there's an interaction for the product and user
                        interaction = Analytics.objects.filter(product=product_name, consumer_email=user_email, event_type__in=['	product_click', 'link_click', 'favourited_product']).first()

                        if interaction:
                            event_type = interaction.event_type
                            if event_type == 'favourited_product':
                                value = 3
                            elif event_type == 'link_click':
                                value = 2
                            else:  # link_click
                                value = 1
                        else:
                            value = 0

                        # Create or update CAMatrix entry
                        existing_entry, created = ca_matrix.objects.update_or_create(
                            product=product_name,
                            user_email=user_email,
                            defaults={'value': value}
                        )

            return JsonResponse({"message": "Initial matrix created successfully"}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)



