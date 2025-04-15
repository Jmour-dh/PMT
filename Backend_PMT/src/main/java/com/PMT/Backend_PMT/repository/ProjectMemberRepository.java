package com.PMT.Backend_PMT.repository;

import com.PMT.Backend_PMT.entity.Project;
import com.PMT.Backend_PMT.entity.ProjectMember;
import com.PMT.Backend_PMT.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {
    boolean existsByUserAndProject(User user, Project project);
}