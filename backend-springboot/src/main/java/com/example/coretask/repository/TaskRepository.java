package com.example.coretask.repository;

import com.example.coretask.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    // Spring generará automáticamente la consulta SQL para este método
    List<Task> findByUserId(Long userId);
}