package com.PMT.Backend_PMT.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmailService {

    @Value("${spring.mail.from}")
    private String fromAddress;

    private final JavaMailSender mailSender;

    public void sendEmail(String subject, String content, List<String> recipients) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromAddress);
            helper.setTo(recipients.toArray(new String[0]));
            helper.setSubject(subject);
            helper.setText(content, true); // true = HTML enabled

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Échec d'envoi d'email à " + recipients + ": " + e.getMessage(), e);
        }
    }
}