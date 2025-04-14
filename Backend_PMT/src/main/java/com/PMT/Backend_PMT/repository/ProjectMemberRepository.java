package com.PMT.Backend_PMT.repository;

import com.PMT.Backend_PMT.entity.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {
}