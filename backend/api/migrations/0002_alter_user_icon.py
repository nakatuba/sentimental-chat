# Generated by Django 4.1 on 2023-06-07 22:48

import api.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='icon',
            field=models.ImageField(blank=True, upload_to=api.models.user_icon_path),
        ),
    ]
