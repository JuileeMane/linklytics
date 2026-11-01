package com.linklytics.repository;

import com.linklytics.entity.Tag;
import com.linklytics.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    List<Tag> findByUserOrderByNameAsc(User user);
    Optional<Tag> findByIdAndUser(Long id, User user);
    Optional<Tag> findByNameAndUser(String name, User user);
    List<Tag> findByUserAndNameIn(User user, Set<String> names);
}
