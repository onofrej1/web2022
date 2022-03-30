from django.db import models
from django.contrib.auth.models import User


class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True)


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()


class Post(models.Model):
    title = models.CharField(max_length=100)
    text = models.TextField()
    views = models.IntegerField()
    tags = models.ManyToManyField(
        Tag,
        related_name='posts',
        blank=True
    )
    author = models.ForeignKey(
        User,
        related_name='posts',
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    category = models.ForeignKey(
        Category,
        related_name='categories',
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )
