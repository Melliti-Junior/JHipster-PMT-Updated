package com.erp.app.repository.custom;

import com.erp.app.domain.custom.CustomBoard;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardCustomRepository extends MongoRepository<CustomBoard, String> {

}
