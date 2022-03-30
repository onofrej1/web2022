from rest_framework import viewsets, status
from api.models import Post, Tag, User, Category
from api.serializers import PostSerializer, TagSerializer, UserSerializer, CategorySerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializers import UploadSerializer
from rest_framework.viewsets import ViewSet
from django.core.files.storage import FileSystemStorage

# ViewSets define the view behavior.
class UploadViewSet(ViewSet):
    serializer_class = UploadSerializer

    def list(self, request):
        return Response("GET API")

    def create(self, request):
        file_uploaded = request.FILES.get('file_uploaded')
        fs = FileSystemStorage()
        filename = fs.save(file_uploaded.name, file_uploaded)
        
        content_type = file_uploaded.content_type
        response = "POST API and you have uploaded a {} file".format(content_type)
        return Response(response)

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    filterset_fields = ('title', 'author__first_name',
                        'author__last_name', 'author__email')


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = (
        User.objects.all()
            .order_by('last_name')
    )
    serializer_class = UserSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class SchemaView(APIView):
    types = {
        'AutoField': 'auto',
        'BigAutoField': 'bigAuto',
        'CharField': 'text',
        'TextField': 'text',
        'DateField': 'date',
        'DateTimeField': 'datetime',
        'IntegerField': 'number',
        'DecimalField': 'float_number',
        'FloatField': 'float_number',
        'BooleanField': 'boolean',
        'EmailField': 'email',

        'ForeignKey': 'fk',
        'ManyToOneRel': 'm2o',
        'ManyToManyField': 'm2m',
    }

    models = {
        'posts': Post,
        'users': User,
        'categories': Category,
    }

    def get_validators(self, validators):
        for validator in validators:
            fieldValidator = {}
            type = validator.__class__.__name__
            fieldValidator[type] = {}

            for attr in dir(validator):
                if attr.startswith('_'):
                    continue
                value = getattr(validator, attr, '')
                if not callable(value):
                    fieldValidator[type][attr] = value
            return fieldValidator

    # @action(methods=['GET'], detail=True)
    def get(self, request, *args, **kwargs):
        model = self.models[kwargs.get('model')]
        # print(serializer_class)
        fieldsMeta = model._meta.get_fields()
        fields = []
        for meta in fieldsMeta:
            field = {}
            field['name'] = getattr(meta, 'name')
            field['type'] = self.types[meta.__class__.__name__]
            field['required'] = getattr(meta, 'blank', 'false')
            field['is_relation'] = getattr(meta, 'is_relation', 'false')
            #field['validators'] = self.get_validators(
            #    getattr(meta, 'validators', []))
            fields.append(field)
        return Response(fields)
