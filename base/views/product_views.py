# local imports
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.core.exceptions import PermissionDenied
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from base.models import Product, Review
from base.serializers import ProductSerializer

# third party imports
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

# Create your views here.

@api_view(['GET'])
def getProducts(request):
    query = request.query_params.get('keyword')
    user = request.user

    if query == None or query == '':
        products = Product.objects.all() if user.is_staff else Product.objects.filter(isActive=True)
    else:
        products = Product.objects.filter(name__icontains=query) if user.is_staff else Product.objects.filter(isActive=True, name__icontains=query)
    
    page = request.query_params.get('page')
    paginator = Paginator(products, 4)

    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)
    
    if page == None:
        page = 1

    serializer = ProductSerializer(products, many=True)
    return Response(
        {
            'products': serializer.data, 
            'page': int(page), 
            'numPages': paginator.num_pages
        }, 
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
def getProduct(request, pk):
    try:
        product = Product.objects.get(pk=pk)
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Product.DoesNotExist as e:
        return Response({'detail': str(e.message) if hasattr(e, 'message') else str(e)}, status=status.HTTP_400_BAD_REQUEST)      


@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    try:
        product = Product.objects.create(
            user = request.user,
            isActive = False
        )
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        return Response({'detail': 'Something went wrong. Product was not created.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    user = request.user
    data = request.data
    try:
        product = Product.objects.get(pk=pk)
        product.user = user
        product.name = data['name']
        product.brand = data['brand']
        product.category = data['category']
        product.description = data['description']
        product.price = data['price']
        product.countInStock = data['countInStock']
        product.isActive = data['isActive']
        product.save()
        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'detail': str(e.message) if hasattr(e, 'message') else str(e)}, status=status.HTTP_400_BAD_REQUEST)   


@api_view(['POST'])
@permission_classes([IsAdminUser])
def imageUpload(request):
    try:
        data = request.data
        image = request.FILES.get('image')

        product = Product.objects.get(pk=data['productId'])
        product.image = image
        product.save()
        return Response({'detail': 'Image was uploaded'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'detail': str(e.message) if hasattr(e, 'message') else str(e)}, status=status.HTTP_400_BAD_REQUEST)   


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    try:
        productToDelete = Product.objects.get(pk=pk)
        productToDelete.delete()
        return Response({'detail': 'Product was deleted successfully'}, status=status.HTTP_200_OK)
    except Product.DoesNotExist as e:
        return Response({'detail': str(e.message) if hasattr(e, 'message') else str(e)}, status=status.HTTP_400_BAD_REQUEST)  


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createReview(request, pk):
    try:
        product = Product.objects.get(pk=pk)
        user = request.user
        data = request.data

        alreadyExists = product.review_set.filter(user=user).exists()

        if alreadyExists:
            return Response({'detail': 'You have already written a review for this product.'}, status=status.HTTP_400_BAD_REQUEST)

        elif int(data['rating']) not in range(1, 6):
            return Response({'detail': 'Please select a rating.'}, status=status.HTTP_400_BAD_REQUEST)
        
        else:

            rating = data['rating']
            comment = data['comment']

            review = Review.objects.create(
                product = product,
                user = user,
                name = user.first_name if user.first_name else user.username,
                rating = rating,
                comment = comment
            )

            reviews = product.review_set.all()
            product.numReviews = len(reviews)
            product.rating = sum([review.rating for review in reviews]) / len(reviews)

            product.save()

            return Response({'detail': 'Your review was successfully posted.'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'detail': str(e.message) if hasattr(e, 'message') else str(e)}, status=status.HTTP_400_BAD_REQUEST)  


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateReview(request, pk):
    try:
        user = request.user
        review = Review.objects.get(pk=pk)
        product = review.product

        if user == review.user:
            data = request.data

            if data['rating'] == 0:
                return Response({'detail': 'Please select a rating.'}, status=status.HTTP_400_BAD_REQUEST)

            review.rating = data['rating']
            review.comment = data['comment']

            reviews = product.review_set.all()
            product.rating = sum([review.rating for review in reviews]) / len(reviews)

            product.save()

            return Response({'detail': 'Your reveiw was updated successfully.'}, status=status.HTTP_200_OK)
        else:
            raise PermissionDenied('You are not authorized to perform this action.')
    except Exception as e:
        return Response({'detail': str(e.message) if hasattr(e, 'message') else str(e)}, status=status.HTTP_400_BAD_REQUEST)  


@api_view(['GET'])
def getTopProducts(request):
    products = Product.objects.filter(rating__gte=4).order_by('-rating')[0:5]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

