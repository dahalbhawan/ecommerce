# Generated by Django 3.1.7 on 2021-08-28 08:26

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0008_auto_20210821_1330'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='order',
            options={'ordering': ['-createdAt', '-deliveredAt', '-paidAt']},
        ),
        migrations.AlterModelOptions(
            name='product',
            options={'ordering': ['-createdAt']},
        ),
        migrations.AddField(
            model_name='review',
            name='createdAt',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
