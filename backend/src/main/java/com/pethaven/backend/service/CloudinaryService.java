package com.pethaven.backend.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CloudinaryService {

    private static final Logger log = LoggerFactory.getLogger(CloudinaryService.class);
    private static final String API = "https://api.cloudinary.com/v1_1/{cloud}/image/";

    private final RestClient restClient = RestClient.create();
    private final String cloudName;
    private final String apiKey;
    private final String apiSecret;
    private final String folder;

    public record UploadResult(String secureUrl, String publicId) {}

    public CloudinaryService(@Value("${app.cloudinary.cloud-name}") String cloudName,
                             @Value("${app.cloudinary.api-key}") String apiKey,
                             @Value("${app.cloudinary.api-secret}") String apiSecret,
                             @Value("${app.cloudinary.folder}") String folder) {
        this.cloudName = cloudName;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.folder = folder;
    }

    public UploadResult upload(byte[] bytes, String filename) {
        Map<String, String> params = new TreeMap<>();
        params.put("folder", folder);
        params.put("timestamp", String.valueOf(Instant.now().getEpochSecond()));

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new ByteArrayResource(bytes) {
            @Override
            public String getFilename() {
                return filename != null ? filename : "photo";
            }
        });
        params.forEach(body::add);
        body.add("api_key", apiKey);
        body.add("signature", sign(params));

        try {
            Map<?, ?> result = restClient.post()
                    .uri(API + "upload", cloudName)
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(body)
                    .retrieve()
                    .body(Map.class);
            return new UploadResult((String) result.get("secure_url"), (String) result.get("public_id"));
        } catch (RestClientException e) {
            log.error("Cloudinary upload failed: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Photo upload failed. Please try again.");
        }
    }

    public void delete(String publicId) {
        Map<String, String> params = new TreeMap<>();
        params.put("public_id", publicId);
        params.put("timestamp", String.valueOf(Instant.now().getEpochSecond()));

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        params.forEach(body::add);
        body.add("api_key", apiKey);
        body.add("signature", sign(params));

        try {
            restClient.post()
                    .uri(API + "destroy", cloudName)
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(body)
                    .retrieve()
                    .toBodilessEntity();
        } catch (RestClientException e) {
            log.error("Cloudinary delete failed for {}: {}", publicId, e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Could not delete the photo. Please try again.");
        }
    }

    private String sign(Map<String, String> sortedParams) {
        String toSign = sortedParams.entrySet().stream()
                .map(e -> e.getKey() + "=" + e.getValue())
                .collect(Collectors.joining("&")) + apiSecret;
        try {
            MessageDigest sha1 = MessageDigest.getInstance("SHA-1");
            return HexFormat.of().formatHex(sha1.digest(toSign.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}