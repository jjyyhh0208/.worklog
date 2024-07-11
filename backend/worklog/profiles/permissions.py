from rest_framework import permissions

# 비회원이어도 내용을 읽어올 수 있는 set 제공
class UnauthenticatedReadOrSafeMethods(permissions.BasePermission):
    def has_permission(self, request, view):
        # Allow GET, HEAD, OPTIONS requests without authentication
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated