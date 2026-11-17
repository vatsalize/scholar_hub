package com.java_project.ScholarHub.Services;

import com.java_project.ScholarHub.DTOs.TodoTaskRequest;
import com.java_project.ScholarHub.DTOs.TodoTaskResponse;
import com.java_project.ScholarHub.Models.Board;
import com.java_project.ScholarHub.Models.TodoTask;
import com.java_project.ScholarHub.Models.User;
import com.java_project.ScholarHub.Repositories.BoardRepository;
import com.java_project.ScholarHub.Repositories.TodoTaskRepository;
import com.java_project.ScholarHub.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class TodoService {

    @Autowired
    BoardRepository boardRepository;

    @Autowired
    TodoTaskRepository todoTaskRepository;

    @Autowired
    UserRepository userRepository;

    public Board addBoard(UUID userId, String boardName) {
        Board board = new Board();
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        board.setName(boardName);
        board.setUser(user);
        boardRepository.save(board);
        return board;
    }

    public void updateBoard(UUID boardId, String boardName) {
        Board board = boardRepository.findById(boardId).orElseThrow(() -> new RuntimeException("Couldn't find board"));
        board.setName(boardName);
        boardRepository.save(board);
    }

    public void deleteBoard(UUID boardId) {
        boardRepository.deleteById(boardId);
    }

    public TodoTask addTask(TodoTaskRequest todoTaskRequest) {
        TodoTask todoTask = new TodoTask();
        Board board = null;
        if (todoTaskRequest.getBoardId() != null) {
            board = boardRepository.findById(todoTaskRequest.getBoardId()).orElse(null);
        }
        if (board == null) {
            List<Board> boards = boardRepository.findAll();
            if (!boards.isEmpty()) {
                board = boards.getFirst();
            } else {
                User user = userRepository.findAll().stream().findFirst().orElseGet(() -> {
                    User u = new User();
                    u.setName("Alex Morgan");
                    u.setEmail("alex.morgan@scholarhub.edu");
                    u.setPassword("password123");
                    return userRepository.save(u);
                });
                board = new Board();
                board.setName("General Tasks");
                board.setUser(user);
                board = boardRepository.save(board);
            }
        }
        todoTask.setBoard(board);
        todoTask.setUser(board.getUser());
        todoTask.setPriority(todoTaskRequest.getPriority() != null ? todoTaskRequest.getPriority() : "Medium");
        todoTask.setTitle(todoTaskRequest.getTitle() != null ? todoTaskRequest.getTitle() : "Untitled Task");
        todoTask.setDueDate(todoTaskRequest.getDueDate() != null ? todoTaskRequest.getDueDate() : java.time.LocalDateTime.now().plusDays(3));
        todoTaskRepository.save(todoTask);
        return todoTask;
    }

    public List<TodoTaskResponse> getAllTasks() {
        List<TodoTask> list = todoTaskRepository.findAll();
        List<TodoTaskResponse> responseList = new ArrayList<>();
        for (TodoTask todoTask : list) {
            TodoTaskResponse todoTaskResponse = new TodoTaskResponse();
            todoTaskResponse.setId(todoTask.getId());
            todoTaskResponse.setTitle(todoTask.getTitle());
            if (todoTask.getBoard() != null) {
                todoTaskResponse.setBoardId(todoTask.getBoard().getId());
            }
            todoTaskResponse.setCreatedAt(todoTask.getCreatedAt());
            todoTaskResponse.setDueDate(todoTask.getDueDate());
            todoTaskResponse.setPriority(todoTask.getPriority());
            responseList.add(todoTaskResponse);
        }
        return responseList;
    }

    public List<TodoTaskResponse> getAllTasksForUser(UUID userId) {
        List<TodoTask> list = todoTaskRepository.findByUserId(userId);
        List<TodoTaskResponse> responseList = new ArrayList<>();
        for (TodoTask todoTask : list) {
            TodoTaskResponse todoTaskResponse = new TodoTaskResponse();
            todoTaskResponse.setId(todoTask.getId());
            todoTaskResponse.setTitle(todoTask.getTitle());
            todoTaskResponse.setBoardId(todoTask.getBoard().getId());
            todoTaskResponse.setCreatedAt(todoTask.getCreatedAt());
            todoTaskResponse.setDueDate(todoTask.getDueDate());
            todoTaskResponse.setPriority(todoTask.getPriority());
            responseList.add(todoTaskResponse);
        }
        return responseList;
    }

    public void deleteTask(UUID taskId) {
        todoTaskRepository.deleteById(taskId);
    }

    public List<Board> getAllBoardsForUser(UUID userId) {
        if (userId == null) {
            return boardRepository.findAll();
        }
        return boardRepository.findByUserId(userId);
    }

}
