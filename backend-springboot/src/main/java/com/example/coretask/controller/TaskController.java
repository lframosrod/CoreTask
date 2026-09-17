package com.example.coretask.controller;

import com.example.coretask.model.Task;
import com.example.coretask.repository.TaskRepository;
import com.example.coretask.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskController(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/user/{userId}")
    public List<Task> getTasksByUser(@PathVariable Long userId) {
        return taskRepository.findByUserId(userId);
    }

    @PostMapping("/user/{userId}")
    public Task createTask(@PathVariable Long userId, @RequestBody Task task) {
        return userRepository.findById(userId).map(user -> {
            task.setUser(user);
            return taskRepository.save(task);
        }).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return taskRepository.save(task);
    }
}