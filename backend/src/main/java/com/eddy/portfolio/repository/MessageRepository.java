package com.eddy.portfolio.repository;

import com.eddy.portfolio.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {

    long countByReadFalse();
}
