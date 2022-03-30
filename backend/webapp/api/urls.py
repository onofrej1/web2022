from django.urls import include, path
from rest_framework import routers
from . import views
from rest_framework.urlpatterns import format_suffix_patterns

router = routers.DefaultRouter()
router.register(r'posts', views.PostViewSet)
router.register(r'tags', views.TagViewSet)
router.register(r'users', views.UserViewSet)
router.register(r'categories', views.CategoryViewSet)
#route.register(r'schema', views.SchemaView)
router.register(r'upload', views.UploadViewSet, basename="upload")

urlpatterns = [
    path('', include(router.urls)),
    path('schema/<str:model>', views.SchemaView.as_view()),
]

#urlpatterns = format_suffix_patterns(urlpatterns)
