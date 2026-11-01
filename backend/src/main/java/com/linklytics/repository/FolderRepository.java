package com.linklytics.repository;

import com.linklytics.entity.Folder;
import com.linklytics.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FolderRepository extends JpaRepository<Folder, Long> {
    List<Folder> findByUserOrderByNameAsc(User user);
    Optional<Folder> findByIdAndUser(Long id, User user);
    boolean existsByNameAndUser(String name, User user);
}
