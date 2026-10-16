package com.eddy.portfolio.security;

import com.eddy.portfolio.model.AdminUser;
import com.eddy.portfolio.repository.AdminUserRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AdminUserDetailsService implements UserDetailsService {

    private final AdminUserRepository adminUserRepository;

    public AdminUserDetailsService(AdminUserRepository adminUserRepository) {
        this.adminUserRepository = adminUserRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) {
        AdminUser admin = adminUserRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UsernameNotFoundException("Identifiants invalides"));
        return User.withUsername(admin.getEmail())
                .password(admin.getPasswordHash())
                .roles(admin.getRole().name())
                .disabled(!admin.isActive())
                .build();
    }
}
