package com.interviewsim.app.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedDeque;

@Component
public class RateLimitFilter implements Filter {

    // Simple in-memory rate limiting: 10 requests per 60s per IP for /questions/{id}/answer
    private final Map<String, Deque<Long>> requestLog = new ConcurrentHashMap<>();
    private static final int MAX_REQUESTS = 10;
    private static final long WINDOW_MS = 60000;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String path = httpRequest.getRequestURI();
        
        if (path.contains("/answer") && "POST".equalsIgnoreCase(httpRequest.getMethod())) {
            String ip = httpRequest.getRemoteAddr();
            long now = System.currentTimeMillis();
            
            requestLog.putIfAbsent(ip, new ConcurrentLinkedDeque<>());
            Deque<Long> timestamps = requestLog.get(ip);
            
            // Clean up old timestamps
            Long first;
            while ((first = timestamps.peekFirst()) != null && now - first > WINDOW_MS) {
                timestamps.remove(first);
            }
            
            if (timestamps.size() >= MAX_REQUESTS) {
                HttpServletResponse httpResponse = (HttpServletResponse) response;
                httpResponse.setStatus(429);
                httpResponse.getWriter().write("Too Many Requests. Rate limit: 10 submissions per minute.");
                return;
            }
            
            timestamps.addLast(now);
        }
        
        chain.doFilter(request, response);
    }
}
