from django.test import TestCase
from seller.models import Seller
from productseller.models import ProductSeller
from product.models import Product
from decimal import Decimal


class ProductSellerModelTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.seller1 = Seller.objects.create(
            username="Test Seller 1",
            business_name="Test Seller 1",
            email="test1@example.com",
            reg_no="1234567891011",
            website="http://www.test1.com",
            feed_url="http://www.test1.com",
        )

        cls.seller2 = Seller.objects.create(
            username="Test Seller 2",
            business_name="Test Seller 2",
            email="test2@example.com",
            reg_no="1234567891012",
            website="http://www.test2.com",
            feed_url="http://www.test2.com",
        )

        cls.product1 = Product.objects.create(
            name="Test Product 1", brand="Test Brand 1", category="Test Category 1"
        )
        cls.product2 = Product.objects.create(
            name="Test Product 2", brand="Test Brand 2", category="Test Category 2"
        )
        cls.product_seller1 = ProductSeller.objects.create(
            product=cls.product1,
            seller=cls.seller1,
            original_price=100,
            price=90,
            discount=10,
            discount_rate=Decimal("0.1"),
            in_stock=True,
            product_url="https://example.com/product1",
            img_array=[
                "https://example.com/image1.jpg",
                "https://example.com/image2.jpg",
            ],
        )
        cls.product_seller2 = ProductSeller.objects.create(
            product=cls.product2,
            seller=cls.seller2,
            original_price=200,
            price=180,
            discount=20,
            discount_rate=Decimal("0.1"),
            in_stock=False,
            product_url="https://example.com/product2",
            img_array=[
                "https://example.com/image3.jpg",
                "https://example.com/image4.jpg",
            ],
        )

    def test_product_seller_model(self):
        product_seller = ProductSeller.objects.first()
        self.assertEqual(product_seller.price, 90)
        self.assertAlmostEqual(product_seller.discount_rate, Decimal("0.1"))
        self.assertEqual(product_seller.in_stock, True)

    def test_get_names(self):
        names = self.product_seller1.get_names()
        self.assertEqual(names, ("Test Seller 1", "Test Category 1"))

    def test_business_name(self):
        business_name = self.product_seller1.business_name
        self.assertEqual(business_name, "Test Seller 1")

    def test_product_category(self):
        product_category = self.product_seller1.product_category
        self.assertEqual(product_category, "Test Category 1")
