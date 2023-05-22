# Generated by Django 4.2.1 on 2023-05-22 17:16

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Users',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=15, unique=True)),
                ('email', models.EmailField(max_length=30, unique=True)),
                ('type', models.CharField(choices=[('SELLER', 'seller'), ('USER', 'user')], max_length=6)),
            ],
        ),
    ]
