# from django.urls import reverse
# from rest_framework import status
# from analytics.models import Analytics
# from consumer.models import Consumer
# import uuid
# from django.utils.timezone import now
# from rest_framework import status
# from rest_framework.test import APITestCase
# from datetime import timedelta


# class ProductAnalyticsAPIViewTestCase(APITestCase):
#     def test_get_product_analytics(self):
#         # Create test data
#         seller_name = "TestSeller"
#         product_name = "TestProduct"
#         Analytics.objects.create(
#             seller=seller_name,
#             product=product_name,
#             event_type="product_click",
#             event_date=now(),
#         )

#         url = reverse("productanalytics")
#         response = self.client.get(url, {"seller_name": seller_name})

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(
#             response.data,
#             {
#                 "product_clicks": 1,
#                 "link_clicks": 0,
#                 "favourites": 0,
#             },  # Assuming link_clicks count is 0
#         )


# class AllProductAnalyticsAPIViewTestCase(APITestCase):
#     def setUp(self):
#         # Create test data for the test seller
#         self.seller_name = "TestSeller"
#         for i in range(1, 31):
#             product_name = f"TestProduct{i}"
#             Analytics.objects.create(
#                 seller=self.seller_name,
#                 product=product_name,
#                 event_type="product_click",
#                 event_date=now() - timedelta(days=i),
#             )

#     def test_get_top_ten_products_analytics(self):
#         url = reverse("allproductanalytics")
#         response = self.client.post(url, {"seller_name": self.seller_name})

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(
#             len(response.data["data"]), 10
#         )  # Assuming there are at least 10 products

#     def test_get_top_products_by_search(self):
#         url = reverse("allproductanalytics")
#         response = self.client.post(
#             url, {"seller_name": self.seller_name, "search": "TestProduct1"}
#         )

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(len(response.data["data"]), 10)
#         self.assertEqual(response.data["data"][0]["product_name"], "TestProduct1")

#     def test_get_top_products_by_sorting(self):
#         url = reverse("allproductanalytics")
#         response = self.client.post(
#             url, {"seller_name": self.seller_name, "sort": "clicks"}
#         )

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         sorted_data = sorted(
#             response.data["data"], key=lambda k: k["clicks"], reverse=True
#         )
#         self.assertEqual(response.data["data"], sorted_data)

#     def test_get_top_products_with_pagination(self):
#         url = reverse("allproductanalytics")
#         page_size = 5
#         response = self.client.post(
#             url, {"seller_name": self.seller_name, "page_size": page_size}
#         )

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(len(response.data["data"]), page_size)

#     def test_get_top_products_no_data(self):
#         url = reverse("allproductanalytics")
#         response = self.client.post(url, {"seller_name": "NonExistentSeller"})

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(response.data, {"data": [], "total_count": 0})


# class CreateProductAnalyticsAPIViewTestCase(APITestCase):
#     def test_create_product_analytics(self):
#         seller_name = "TestSeller"
#         product_name = "TestProduct"
#         data = {
#             "seller": seller_name,
#             "product": product_name,
#             "product_category": "TestCategory",
#             "consumer_id": "c7c700c9-a5b4-4600-bd8d-a24bd355bd46",
#             "event_type": "product_click",
#             "metadata": None,
#         }

#         url = reverse("createproductanalytics")
#         response = self.client.post(url, data, format="json")

#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#         self.assertEqual(
#             Analytics.objects.filter(seller=seller_name, product=product_name).count(),
#             1,
#         )


# class ConversionRateAPIViewTestCase(APITestCase):
#     def test_get_conversion_rate(self):
#         seller_name = "TestSeller"
#         product_name = "TestProduct"
#         link_clicks = 10
#         product_clicks = 5

#         # Create test data
#         Analytics.objects.create(
#             seller=seller_name,
#             product=product_name,
#             event_type="link_click",
#             event_date=now(),
#         )
#         for _ in range(link_clicks - 1):
#             Analytics.objects.create(
#                 seller=seller_name,
#                 product=product_name,
#                 event_type="link_click",
#                 event_date=now() - timedelta(days=1),
#             )

#         for _ in range(product_clicks):
#             Analytics.objects.create(
#                 seller=seller_name,
#                 product=product_name,
#                 event_type="product_click",
#                 event_date=now(),
#             )

#         url = reverse("conversionrate")
#         response = self.client.get(url, {"seller_name": seller_name})

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(len(response.data), 1)
#         self.assertEqual(
#             response.data[0]["product_name"], product_name
#         )  # Assuming there is only one product
#         # self.assertEqual(response.data[0]["conversion_rate"], 50.0)  # 5 / 10 * 100


# class CategoryPercentageAPIViewTestCase(APITestCase):
#     def test_get_category_percentage(self):
#         seller_name = "TestSeller"
#         category1 = "TestCategory1"
#         category2 = "TestCategory2"

#         # Create test data
#         for _ in range(10):
#             Analytics.objects.create(
#                 seller=seller_name,
#                 product_category=category1,
#                 event_type="product_click",
#                 event_date=now(),
#             )
#         for _ in range(5):
#             Analytics.objects.create(
#                 seller=seller_name,
#                 product_category=category2,
#                 event_type="product_click",
#                 event_date=now(),
#             )

#         url = reverse("categorypercentage")
#         response = self.client.get(url, {"seller_name": seller_name})

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(len(response.data), 2)  # Assuming there are 2 categories
#         self.assertEqual(
#             response.data[0]["category"], category1
#         )  # Assuming response is sorted by category
#         self.assertEqual(response.data[0]["percentage"], 66.67)  # 10 / 15 * 100
#         self.assertEqual(
#             response.data[1]["category"], category2
#         )  # Assuming response is sorted by category
#         self.assertEqual(response.data[1]["percentage"], 33.33)  # 5 / 15 * 100


# class SelectedProductsAPIViewTestCase(APITestCase):
#     def test_get_selected_products_analytics(self):
#         seller_name = "TestSeller"
#         product_names = ["TestProduct1", "TestProduct2"]
#         date_range = "1_year"

#         # Create test data
#         for product_name in product_names:
#             for i in range(1, 31):
#                 Analytics.objects.create(
#                     seller=seller_name,
#                     product=product_name,
#                     event_type="product_click",
#                     event_date=now() - timedelta(days=i),
#                 )

#         url = reverse("selectedproducts")
#         data = {"product_names": product_names, "date_range": date_range}
#         response = self.client.post(url, data, format="json")

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
