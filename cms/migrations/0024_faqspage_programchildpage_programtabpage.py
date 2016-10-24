# -*- coding: utf-8 -*-
# Generated by Django 1.9.10 on 2016-10-20 18:12
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import wagtail.wagtailcore.fields


class Migration(migrations.Migration):

    dependencies = [
        ('wagtailcore', '0029_unicode_slugfield_dj19'),
        ('cms', '0023_remove_faqspage'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProgramChildPage',
            fields=[
                ('page_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='wagtailcore.Page')),
            ],
            options={
                'abstract': False,
            },
            bases=('wagtailcore.page',),
        ),
        migrations.CreateModel(
            name='FaqsPage',
            fields=[
                ('programchildpage_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='cms.ProgramChildPage')),
            ],
            options={
                'abstract': False,
            },
            bases=('cms.programchildpage',),
        ),
        migrations.CreateModel(
            name='ProgramTabPage',
            fields=[
                ('programchildpage_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='cms.ProgramChildPage')),
                ('content', wagtail.wagtailcore.fields.RichTextField(blank=True, help_text='The content of this tab on the program page')),
            ],
            options={
                'abstract': False,
            },
            bases=('cms.programchildpage',),
        ),
    ]