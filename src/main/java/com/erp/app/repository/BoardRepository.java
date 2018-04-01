package com.erp.app.repository;

import com.erp.app.domain.Board;
import org.springframework.stereotype.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the Board entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BoardRepository extends MongoRepository<Board, String> {

}
