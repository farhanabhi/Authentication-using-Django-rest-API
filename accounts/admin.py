from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, UserMessage

# Register CustomUser with custom admin
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'is_staff')
    search_fields = ('username', 'email')
    ordering = ('username',)

admin.site.register(CustomUser, CustomUserAdmin)

# Register UserMessage
class UserMessageAdmin(admin.ModelAdmin):
    list_display = ('user', 'message', 'created_at')
    search_fields = ('user__username', 'message')
    list_filter = ('created_at',)

admin.site.register(UserMessage, UserMessageAdmin)