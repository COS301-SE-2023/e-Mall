from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.views import APIView
from ca_matrix.models import ca_matrix
from ca_matrix.views import CAMatrixView
from rest_framework.permissions import AllowAny
from django.db import transaction
from cust_analytics.models import cust_analytics
from sklearn.neighbors import NearestNeighbors
import numpy as np
import pandas as pd
from rest_framework.test import APIRequestFactory

# Create your views here.


class PredictCustAnalyticsView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            with transaction.atomic():
                # Call the ca_matrix model and make it recalculate the data 
                # for the cust_analytics model
                create_initial_matrix()

                # copy of initial data from ca_matrix
                predictions_data = ca_matrix.objects.all()
                
                predicated_values = calculate_predicted_values(predictions_data)

                # Store predictions in the CustAnalytics model
                for index, row in predicated_values.iterrows():
                    for user_id in row.index:
                        cust_analytics.objects.update_or_create(
                            product=index,
                            user_id=user_id,
                            defaults={'value': row[user_id]}
                        )

            return JsonResponse({"message": "Predictions created successfully"}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)



def create_initial_matrix():
    try:
        # Create an APIView instance
        camatrix_view = CAMatrixView.as_view(permission_classes=[AllowAny])

        # Use APIRequestFactory to create a POST request
        factory = APIRequestFactory()
        request = factory.post('initdb/')

        # Execute the view with the request
        response = camatrix_view(request)

        if response.status_code == 200:
            return "Initial matrix created successfully"
        else:
            return "Error creating initial matrix"

    except Exception as e:
        return str(e)
        
def calculate_predicted_values(predictions_data):
    # Prepare data for NearestNeighbors
    user_indices = predictions_data.values_list('user_id', flat=True)
    product_indices = predictions_data.values_list('product', flat=True)
    values = predictions_data.values_list('value', flat=True)
    
    #recreating the df table
    data = {
        'user_id': user_indices,
        'product': product_indices,
        'value': values
    }
    predictions_df = pd.DataFrame(data)
    # Pivot the data to create the table
    df = predictions_df.pivot(index='product', columns='user_id', values='value')
    df1 = df.copy()


    # Create a user-product matrix for prediction
    user_product_matrix = create_user_product_matrix(user_indices, product_indices, values)
    # Perform NearestNeighbors calculation
    number_neighbors = 3
    knn = NearestNeighbors(metric='cosine', algorithm='brute')
    knn.fit(user_product_matrix)
    distances, indices = knn.kneighbors(user_product_matrix, n_neighbors=number_neighbors)
    # iterating through all users 
    for user_index,user_uuid in list(enumerate(df.columns)):
        # iterating through all products. 
        for row,name in list(enumerate(df.index)):
            #find products that have not been interacted with by the user
            if df.iloc[row,user_index] == 0:
                sim_products = indices[row].tolist()
                product_distances = distances[row].tolist()
            
                if row in sim_products:
                    id_product = sim_products.index(row)
                    sim_products.remove(row)
                    product_distances.pop(id_product)
                else:
                    sim_products = sim_products[:number_neighbors-1]
                    product_distances = product_distances[:number_neighbors-1]

                #product similarity = 1 - distance
                product_similarity = [1 - x for x in product_distances]
                product_similarity_copy = product_similarity.copy()
                nominator = 0

                #for each similar movie
                for s in range(0, len(product_similarity)):

                    #check if the rating of a similar produicty is 0
                    if df.iloc[sim_products[s],user_index] == 0:

                        #check if the rating is 0, ignore the similarity in calculating the predicated rating
                        if len(product_similarity_copy) == ( number_neighbors -1):
                            product_similarity_copy.pop(s)
                        
                        else:
                            product_similarity_copy.pop(s-(len(product_similarity)-len(product_similarity_copy)))
                    
                    else:
                        nominator = nominator + product_similarity[s] * df.iloc[sim_products[s],user_index]
                
                #check if the number of the ratings with non-zero is positive
                if len(product_similarity_copy) > 0:
                    #check if the sum of the similarity is positive
                    if sum(product_similarity_copy) > 0:
                        predicted_value = nominator / sum(product_similarity_copy)

                    else:
                        predicted_value = 0
                else:
                    predicted_value = 0
                
                #place the predicted value in the dataframe
                df1.iloc[row,user_index] = predicted_value
    
    return df1

def create_user_product_matrix(user_indices, product_indices, values):
    # Create a user-product matrix using numpy
    unique_users = np.unique(user_indices)
    unique_products = np.unique(product_indices)
    user_index_map = {user: idx for idx, user in enumerate(unique_users)}
    product_index_map = {product: idx for idx, product in enumerate(unique_products)}
    
    matrix = np.zeros((len(unique_products), len(unique_users)))  # Swap dimensions
    for user, product, value in zip(user_indices, product_indices, values):
        user_idx = user_index_map[user]
        product_idx = product_index_map[product]
        matrix[product_idx, user_idx] = value  # Swap indices
    
    return matrix

