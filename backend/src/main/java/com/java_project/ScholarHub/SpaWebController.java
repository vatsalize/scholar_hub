package com.java_project.ScholarHub;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controller to forward SPA client-side routes to index.html when served by Spring Boot.
 */
@Controller
public class SpaWebController {

    @GetMapping(value = {
            "/",
            "/dashboard",
            "/attendance",
            "/tasks",
            "/projects",
            "/projects/**",
            "/calendar",
            "/settings",
            "/login",
            "/register",
            "/auth/**",
            "/notifications",
            "/professor",
            "/professor/**"
    })
    public String forwardSpaRoutes() {
        return "forward:/index.html";
    }
}
