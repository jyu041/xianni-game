// backend/src/main/java/org/jyu041/backend/service/DataInitializationService.java
package org.jyu041.backend.service;

import org.jyu041.backend.entity.Player;
import org.jyu041.backend.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class DataInitializationService implements CommandLineRunner {

    @Autowired
    private PlayerRepository playerRepository;

    @Override
    public void run(String... args) throws Exception {
        // Initialize sample data if database is empty
        if (playerRepository.count() == 0) {
            initializeSamplePlayers();
        }
    }

    private void initializeSamplePlayers() {
        // Create sample players for testing
        Player player1 = new Player("逆天修士", "normal", "talented", "fire");
        player1.setLevel(15);
        player1.setExperience(2000);
        player1.setGold(500);
        player1.setGems(50);
        player1.setCurrentStage(3);
        player1.setUnlockedStages(List.of(1, 2, 3));

        Player player2 = new Player("仙道至尊", "easy", "mortal", "water");
        player2.setLevel(8);
        player2.setExperience(800);
        player2.setGold(200);
        player2.setGems(20);
        player2.setCurrentStage(2);
        player2.setUnlockedStages(List.of(1, 2));

        playerRepository.save(player1);
        playerRepository.save(player2);

        System.out.println("Initialized sample players in database");
    }
}