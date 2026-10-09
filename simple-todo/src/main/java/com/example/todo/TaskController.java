package com.example.todo;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final List<Task> tasks = new CopyOnWriteArrayList<>();
    private final AtomicLong counter = new AtomicLong();

    @GetMapping
    public List<Task> getAll() {
        return tasks;
    }

    @PostMapping
    public ResponseEntity<Task> add(@RequestBody Task request) {
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        Task task = new Task(counter.incrementAndGet(), request.getTitle().trim(), false);
        tasks.add(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(task);
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<Task> toggle(@PathVariable long id) {
        return tasks.stream()
                .filter(t -> t.getId() == id)
                .findFirst()
                .map(t -> {
                    t.setDone(!t.isDone());
                    return ResponseEntity.ok(t);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id) {
        boolean removed = tasks.removeIf(t -> t.getId() == id);
        return removed ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
