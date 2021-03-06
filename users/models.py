from django.db import models
from django.contrib.auth.models import User
import string
from random import choice


class Artist(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='artist'
    )

    SAVINGS = 'AH'
    CURRENT = 'CR'
    DEFAULT = 'NA'
    BANK_ACCOUNT_TYPE = (
        (SAVINGS, 'Ahorros'),
        (CURRENT, 'Corriente'),
        (DEFAULT, ''),
    )

    avatar = models.ImageField(upload_to='static/avatars/', null=True,
                               blank=True)
    artistic_name = models.CharField(max_length=50, blank=True)
    bank_account_number = models.CharField(max_length=50, blank=True)
    bank_account_type = models.CharField(
        max_length=2,
        choices=BANK_ACCOUNT_TYPE,
        default=DEFAULT,
    )

    bank = models.CharField(max_length=50, blank=True)
    address = models.CharField(max_length=50, blank=True)
    city = models.CharField(max_length=50, blank=True)
    country = models.CharField(max_length=50, blank=True)
    telephone_number = models.CharField(max_length=15, blank=True)
    birth_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.user.username


class Event(models.Model):
    name = models.CharField(max_length=50)
    date = models.DateTimeField(blank=False, null=False)
    place = models.CharField(max_length=50, blank=False, null=False)
    latitude = models.CharField(max_length=10, blank=True, null=True)
    longitude = models.CharField(max_length=10, blank=True, null=True)

    description = models.CharField(max_length=200, null=False)
    image = models.ImageField(upload_to='event_images', null=True, blank=True)

    artist = models.ForeignKey(Artist, blank=False, null=False,
                               on_delete=models.CASCADE,
                               related_name='events')

    def __str__(self):
        return self.name


class Donation(models.Model):
    artist = models.ForeignKey(Artist)
    user = models.ForeignKey(User)
    date = models.DateTimeField(auto_now_add=True)
    value = models.IntegerField()


class BusinessAgent(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='agent'
    )

    avatar = models.ImageField(upload_to='static/avatars/', null=True,
                               blank=True)
    address = models.CharField(max_length=50, blank=True)
    city = models.CharField(max_length=50, blank=True)
    country = models.CharField(max_length=50, blank=True)
    telephone_number = models.CharField(max_length=15, blank=True)

    def __str__(self):
        return self.user.username


class TokenUser(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    token = models.CharField(max_length=10, blank=True, null=True)

    @classmethod
    def get_token(self):
        chars = string.ascii_letters + string.digits
        token = ''.join(choice(chars) for i in range(10))
        return token

    def save(self, *args, **kwargs):
        if (self.id is None):
            self.token = self.get_token()
        super(TokenUser, self).save(*args, **kwargs)

    def __str__(self):
        return self.user.username
