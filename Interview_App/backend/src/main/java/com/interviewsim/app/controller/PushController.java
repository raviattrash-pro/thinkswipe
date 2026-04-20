package com.interviewsim.app.controller;

import com.interviewsim.app.model.PushSubscription;
import com.interviewsim.app.repository.PushSubscriptionRepository;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.PostConstruct;
import java.security.Security;
import java.util.Map;

@RestController
@RequestMapping("/push")
public class PushController {

    private final PushSubscriptionRepository repository;
    private PushService pushService;

    @Value("${push.vapid.public-key}")
    private String publicKey;

    @Value("${push.vapid.private-key}")
    private String privateKey;

    @Value("${push.vapid.subject}")
    private String subject;

    public PushController(PushSubscriptionRepository repository) {
        this.repository = repository;
    }

    @PostConstruct
    public void init() throws Exception {
        Security.addProvider(new BouncyCastleProvider());
        pushService = new PushService(publicKey, privateKey, subject);
    }

    @PostMapping("/subscribe")
    public void subscribe(@RequestHeader("X-Visitor-Id") String visitorId,
                          @RequestBody Map<String, String> subscription) {
        PushSubscription sub = repository.findByVisitorId(visitorId).orElse(new PushSubscription());
        sub.setVisitorId(visitorId);
        sub.setEndpoint(subscription.get("endpoint"));
        sub.setP256dh(subscription.get("p256dh"));
        sub.setAuth(subscription.get("auth"));
        repository.save(sub);
    }

    @PostMapping("/send/{visitorId}")
    public void sendNotification(@PathVariable String visitorId, @RequestBody Map<String, String> payload) throws Exception {
        repository.findByVisitorId(visitorId).ifPresent(sub -> {
            try {
                Notification notification = new Notification(
                        sub.getEndpoint(),
                        sub.getP256dh(),
                        sub.getAuth(),
                        payload.getOrDefault("message", "Time to swipe some questions!")
                );
                pushService.send(notification);
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }

    @DeleteMapping("/unsubscribe")
    public void unsubscribe(@RequestHeader("X-Visitor-Id") String visitorId) {
        repository.deleteByVisitorId(visitorId);
    }
}
